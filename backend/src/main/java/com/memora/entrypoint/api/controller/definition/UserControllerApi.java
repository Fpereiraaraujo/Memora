package com.memora.entrypoint.api.controller.definition;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.memora.entrypoint.api.dto.UserLoginRequestDto;
import com.memora.entrypoint.api.dto.UserLoginResponseDto;
import com.memora.entrypoint.api.dto.UserProfileResponseDto;
import com.memora.entrypoint.api.dto.UserRegisterRequestDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;

@Tag(name = "users", description = "User account operations")
@Validated
public interface UserControllerApi {

	@PostMapping("/api/auth/register")
	@Operation(
		summary = "Register host account",
		description = "Creates a host account for the Memora private dashboard.",
		responses = {
			@ApiResponse(responseCode = "201", description = "Host created"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "409", description = "Email already registered")
		}
	)
	ResponseEntity<UserRegisterResponseDto> register(@Valid @RequestBody UserRegisterRequestDto request);

	@PostMapping("/api/auth/login")
	@Operation(
		summary = "Authenticate host account",
		description = "Validates e-mail and password and returns a JWT access token.",
		responses = {
			@ApiResponse(responseCode = "200", description = "Authenticated"),
			@ApiResponse(responseCode = "400", description = "Invalid payload"),
			@ApiResponse(responseCode = "401", description = "Invalid credentials")
		}
	)
	ResponseEntity<UserLoginResponseDto> login(@Valid @RequestBody UserLoginRequestDto request);

	@PostMapping("/api/auth/logout")
	@Operation(
		summary = "Logout host account",
		description = "Client-side logout for stateless JWT authentication.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "204", description = "Logged out"),
			@ApiResponse(responseCode = "401", description = "Unauthorized")
		}
	)
	ResponseEntity<Void> logout(Authentication authentication);

	@GetMapping("/api/me")
	@Operation(
		summary = "Get logged user",
		description = "Returns the profile of the authenticated host.",
		security = { @SecurityRequirement(name = "bearerAuth") },
		responses = {
			@ApiResponse(responseCode = "200", description = "Current user"),
			@ApiResponse(responseCode = "401", description = "Unauthorized")
		}
	)
	ResponseEntity<UserProfileResponseDto> me(Authentication authentication);
}
