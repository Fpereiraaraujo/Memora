package com.memora.core.service;

import com.memora.core.domain.model.User;
import com.memora.core.domain.port.UserRepositoryPort;
import com.memora.core.usecase.GetCurrentUserUseCase;
import org.springframework.stereotype.Service;

@Service
public class GetCurrentUserService implements GetCurrentUserUseCase {

	private final UserRepositoryPort userRepositoryPort;

	public GetCurrentUserService(UserRepositoryPort userRepositoryPort) {
		this.userRepositoryPort = userRepositoryPort;
	}

	@Override
	public User execute(Command command) {
		String email = command.email().trim().toLowerCase();
		return userRepositoryPort.findByEmail(email)
			.orElseThrow(() -> new SecurityException("Authenticated user not found"));
	}
}
