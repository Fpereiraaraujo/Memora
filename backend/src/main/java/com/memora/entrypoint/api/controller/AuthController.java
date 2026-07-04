package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.User;
import com.memora.core.usecase.AuthenticateHostUseCase;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.core.usecase.RegisterHostUseCase;
import com.memora.config.JwtTokenService;
import com.memora.entrypoint.api.controller.definition.UserControllerApi;
import com.memora.entrypoint.api.dto.UserLoginRequestDto;
import com.memora.entrypoint.api.dto.UserLoginResponseDto;
import com.memora.entrypoint.api.dto.UserProfileResponseDto;
import com.memora.entrypoint.api.dto.UserRegisterRequestDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements UserControllerApi {

	private final RegisterHostUseCase registerHostUseCase;
	private final AuthenticateHostUseCase authenticateHostUseCase;
	private final GetCurrentUserUseCase getCurrentUserUseCase;
	private final JwtTokenService jwtTokenService;

	public AuthController(
		RegisterHostUseCase registerHostUseCase,
		AuthenticateHostUseCase authenticateHostUseCase,
		GetCurrentUserUseCase getCurrentUserUseCase,
		JwtTokenService jwtTokenService
	) {
		this.registerHostUseCase = registerHostUseCase;
		this.authenticateHostUseCase = authenticateHostUseCase;
		this.getCurrentUserUseCase = getCurrentUserUseCase;
		this.jwtTokenService = jwtTokenService;
	}

	@Override
	public ResponseEntity<UserRegisterResponseDto> register(UserRegisterRequestDto request) {
		User user = registerHostUseCase.execute(new RegisterHostUseCase.Command(
			request.name(),
			request.email(),
			request.password()
		));

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(new UserRegisterResponseDto(user.getId(), user.getName(), user.getEmail()));
	}

	@Override
	public ResponseEntity<UserLoginResponseDto> login(UserLoginRequestDto request) {
		User user = authenticateHostUseCase.execute(new AuthenticateHostUseCase.Command(
			request.email(),
			request.password()
		));

		String token = jwtTokenService.generateToken(user);
		return ResponseEntity.ok(new UserLoginResponseDto(token, user.getId(), user.getName(), user.getEmail()));
	}

	@Override
	public ResponseEntity<Void> logout(Authentication authentication) {
		if (authentication == null) {
			throw new SecurityException("Unauthorized");
		}
		return ResponseEntity.noContent().build();
	}

	@Override
	public ResponseEntity<UserProfileResponseDto> me(Authentication authentication) {
		if (authentication == null) {
			throw new SecurityException("Unauthorized");
		}

		User user = getCurrentUserUseCase.execute(new GetCurrentUserUseCase.Command(authentication.getName()));
		return ResponseEntity.ok(new UserProfileResponseDto(user.getId(), user.getName(), user.getEmail()));
	}
}
