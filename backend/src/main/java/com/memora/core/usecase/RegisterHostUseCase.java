package com.memora.core.usecase;

import com.memora.core.domain.model.User;
import com.memora.core.domain.param.RegisterHostParam;

public interface RegisterHostUseCase {

	User execute(RegisterHostParam param);
}
