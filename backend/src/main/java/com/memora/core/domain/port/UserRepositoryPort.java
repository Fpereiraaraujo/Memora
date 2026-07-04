package com.memora.core.domain.port;

import com.memora.core.domain.model.User;
import java.util.Optional;

public interface UserRepositoryPort {
	User save(User user);
	boolean existsByEmail(String email);
	Optional<User> findByEmail(String email);
}

