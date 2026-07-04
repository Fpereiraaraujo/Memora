package com.memora.core.usecase;

import com.memora.core.domain.model.User;

public interface GetCurrentUserUseCase {

	User execute(Command command);

	record Command(
		String email
	) {
	}
}
