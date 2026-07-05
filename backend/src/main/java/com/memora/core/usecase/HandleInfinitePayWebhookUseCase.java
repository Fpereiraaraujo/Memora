package com.memora.core.usecase;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.param.HandleInfinitePayWebhookParam;

public interface HandleInfinitePayWebhookUseCase {

	PaymentOrder execute(HandleInfinitePayWebhookParam param);
}
