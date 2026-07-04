package com.memora.entrypoint.api.controller;

import com.memora.core.domain.model.User;
import com.memora.core.usecase.RegisterHostUseCase;
import com.memora.entrypoint.api.controller.definition.UserControllerApi;
import com.memora.entrypoint.api.dto.UserRegisterRequestDto;
import com.memora.entrypoint.api.dto.UserRegisterResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements UserControllerApi {

	private final RegisterHostUseCase registerHostUseCase;

	public AuthController(RegisterHostUseCase registerHostUseCase) {
		this.registerHostUseCase = registerHostUseCase;
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
}
