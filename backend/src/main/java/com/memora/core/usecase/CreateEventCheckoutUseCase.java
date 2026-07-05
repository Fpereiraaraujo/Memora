package com.memora.core.usecase;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.param.CreateEventCheckoutParam;

public interface CreateEventCheckoutUseCase {

	PaymentOrder execute(CreateEventCheckoutParam param);
}
