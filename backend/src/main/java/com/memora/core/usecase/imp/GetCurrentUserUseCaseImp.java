package com.memora.core.usecase.imp;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.GetCurrentUserParam;
import com.memora.core.usecase.GetCurrentUserUseCase;
import com.memora.dataprovider.database.mapper.UserDatabaseMapper;
import com.memora.dataprovider.database.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class GetCurrentUserUseCaseImp implements GetCurrentUserUseCase {

	private final UserRepository userRepository;

	public GetCurrentUserUseCaseImp(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public User execute(GetCurrentUserParam param) {
		String email = param.email().trim().toLowerCase();
		return userRepository.findByEmail(email)
			.map(UserDatabaseMapper::toDomain)
			.orElseThrow(() -> new SecurityException("Authenticated user not found"));
	}
}
