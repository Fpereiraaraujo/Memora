package com.memora.core.usecase;

import com.memora.core.domain.model.EventCheckoutStatus;
import com.memora.core.domain.param.GetEventCheckoutStatusParam;

public interface GetEventCheckoutStatusUseCase {
	EventCheckoutStatus execute(GetEventCheckoutStatusParam param);
}
