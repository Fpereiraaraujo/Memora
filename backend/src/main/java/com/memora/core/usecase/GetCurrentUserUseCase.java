package com.memora.core.usecase;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.GetCurrentUserParam;

public interface GetCurrentUserUseCase {

	User execute(GetCurrentUserParam param);
}
