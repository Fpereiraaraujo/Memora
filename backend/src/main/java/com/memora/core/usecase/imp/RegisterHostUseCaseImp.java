package com.memora.core.usecase.imp;

import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.RegisterHostParam;
import com.memora.core.usecase.RegisterHostUseCase;
import com.memora.dataprovider.database.mapper.UserDatabaseMapper;
import com.memora.dataprovider.database.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterHostUseCaseImp implements RegisterHostUseCase {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public RegisterHostUseCaseImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User execute(RegisterHostParam param) {
		String email = param.email().trim().toLowerCase();
		if (userRepository.existsByEmail(email)) {
			throw new IllegalArgumentException("Email already registered");
		}

		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		User user = User.builder()
			.id(UUID.randomUUID())
			.name(param.name().trim())
			.email(email)
			.passwordHash(passwordEncoder.encode(param.rawPassword()))
			.role(UserRole.HOST)
			.status(UserStatus.ACTIVE)
			.deletedAt(null)
			.lastLoginAt(null)
			.createdAt(now)
			.updatedAt(now)
			.build();

		return UserDatabaseMapper.toDomain(userRepository.save(UserDatabaseMapper.toEntity(user)));
	}
}
