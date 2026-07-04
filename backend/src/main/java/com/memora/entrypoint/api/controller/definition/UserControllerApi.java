package com.memora.entrypoint.api.controller.definition;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.memora.entrypoint.api.dto.UserRegisterRequestDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;

@Tag(name = "users", description = "User account operations")
@Validated
@RequestMapping("/api/auth")
public interface UserControllerApi {

	@PostMapping("/register")
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
}
