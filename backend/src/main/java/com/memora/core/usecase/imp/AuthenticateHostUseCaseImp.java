package com.memora.core.usecase.imp;

import com.memora.core.domain.model.User;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.AuthenticateHostParam;
import com.memora.core.usecase.AuthenticateHostUseCase;
import com.memora.dataprovider.database.mapper.UserDatabaseMapper;
import com.memora.dataprovider.database.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticateHostUseCaseImp implements AuthenticateHostUseCase {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthenticateHostUseCaseImp(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public User execute(AuthenticateHostParam param) {
		String email = param.email().trim().toLowerCase();
		var entity = userRepository.findByEmail(email)
			.orElseThrow(() -> new SecurityException("Invalid email or password"));
		User user = UserDatabaseMapper.toDomain(entity);

		if (!passwordEncoder.matches(param.rawPassword(), user.getPasswordHash())) {
			throw new SecurityException("Invalid email or password");
		}

		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new SecurityException("Account is not active");
		}

		entity.setLastLoginAt(LocalDateTime.now(ZoneOffset.UTC));
		entity.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
		return UserDatabaseMapper.toDomain(userRepository.save(entity));
	}
}
