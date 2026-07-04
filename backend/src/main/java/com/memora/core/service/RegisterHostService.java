package com.memora.core.service;

import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.port.UserRepositoryPort;
import com.memora.core.usecase.RegisterHostUseCase;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterHostService implements RegisterHostUseCase {

	private final UserRepositoryPort userRepositoryPort;
	private final PasswordEncoder passwordEncoder;

	public RegisterHostService(UserRepositoryPort userRepositoryPort, PasswordEncoder passwordEncoder) {
		this.userRepositoryPort = userRepositoryPort;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User execute(Command command) {
		String email = command.email().trim().toLowerCase();
		if (userRepositoryPort.existsByEmail(email)) {
			throw new IllegalArgumentException("Email already registered");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		User user = User.builder()
			.id(UUID.randomUUID())
			.name(command.name().trim())
			.email(email)
			.passwordHash(passwordEncoder.encode(command.rawPassword()))
			.role(UserRole.HOST)
			.createdAt(now)
			.updatedAt(now)
			.build();

		return userRepositoryPort.save(user);
	}
}

