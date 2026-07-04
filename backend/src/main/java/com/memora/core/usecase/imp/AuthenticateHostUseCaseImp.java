package com.memora.core.usecase.imp;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.AuthenticateHostParam;
import com.memora.core.usecase.AuthenticateHostUseCase;
import com.memora.dataprovider.database.mapper.UserDatabaseMapper;
import com.memora.dataprovider.database.repository.UserRepository;
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
		User user = userRepository.findByEmail(email)
			.map(UserDatabaseMapper::toDomain)
			.orElseThrow(() -> new SecurityException("Invalid email or password"));

		if (!passwordEncoder.matches(param.rawPassword(), user.getPasswordHash())) {
			throw new SecurityException("Invalid email or password");
		}

		return user;
	}
}
