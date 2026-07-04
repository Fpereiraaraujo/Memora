package com.memora.core.usecase;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.AuthenticateHostParam;

public interface AuthenticateHostUseCase {

	User execute(AuthenticateHostParam param);
}
