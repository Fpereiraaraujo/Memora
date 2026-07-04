package com.memora.core.usecase;

import com.memora.core.domain.model.User;

public interface AuthenticateHostUseCase {

	User execute(Command command);

	record Command(
		String email,
		String rawPassword
	) {
	}
}
