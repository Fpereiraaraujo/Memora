package com.memora.core.usecase;

import com.memora.core.domain.model.User;

public interface RegisterHostUseCase {

	User execute(Command command);

	record Command(
		String name,
		String email,
		String rawPassword
	) {
	}
}

