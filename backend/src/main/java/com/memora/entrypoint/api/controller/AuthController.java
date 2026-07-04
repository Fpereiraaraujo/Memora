package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.AuthenticateHostParam;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.domain.param.RegisterHostParam;
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
import com.memora.entrypoint.api.mapper.UserApiMapper;
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
		User user = registerHostUseCase.execute(new RegisterHostParam(
			request.name(),
			request.email(),
			request.password()
		));

		return ResponseEntity.status(HttpStatus.CREATED)
			.body(UserApiMapper.toRegisterResponse(user));
	}

	@Override
	public ResponseEntity<UserLoginResponseDto> login(UserLoginRequestDto request) {
		User user = authenticateHostUseCase.execute(new AuthenticateHostParam(
			request.email(),
			request.password()
		));

		String token = jwtTokenService.generateToken(user);
		return ResponseEntity.ok(UserApiMapper.toLoginResponse(token, user));
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

		User user = getCurrentUserUseCase.execute(new GetCurrentUserParam(authentication.getName()));
		return ResponseEntity.ok(UserApiMapper.toProfileResponse(user));
	}
}
