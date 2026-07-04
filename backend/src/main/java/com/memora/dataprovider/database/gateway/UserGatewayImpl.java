package com.memora.dataprovider.database.gateway;

import com.memora.core.domain.model.User;
import com.memora.core.domain.port.UserRepositoryPort;
import com.memora.entrypoint.api.mapper.UserApiMapper;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserGatewayImpl implements UserRepositoryPort {

	private final UserRepository userRepository;

	public UserGatewayImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public User save(User user) {
		return UserApiMapper.toDomain(userRepository.save(UserApiMapper.toEntity(user)));
	}

	@Override
	public boolean existsByEmail(String email) {
		return userRepository.existsByEmail(email);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email).map(UserApiMapper::toDomain);
	}
}

