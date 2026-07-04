package com.memora.core.service;

import com.memora.core.domain.model.User;
import com.memora.core.domain.port.UserRepositoryPort;
import com.memora.core.usecase.AuthenticateHostUseCase;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateHostService implements AuthenticateHostUseCase {

	private final UserRepositoryPort userRepositoryPort;
	private final PasswordEncoder passwordEncoder;

	public AuthenticateHostService(UserRepositoryPort userRepositoryPort, PasswordEncoder passwordEncoder) {
		this.userRepositoryPort = userRepositoryPort;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User execute(Command command) {
		String email = command.email().trim().toLowerCase();
		User user = userRepositoryPort.findByEmail(email)
			.orElseThrow(() -> new SecurityException("Invalid email or password"));

		if (!passwordEncoder.matches(command.rawPassword(), user.getPasswordHash())) {
			throw new SecurityException("Invalid email or password");
		}

		return user;
	}
}
