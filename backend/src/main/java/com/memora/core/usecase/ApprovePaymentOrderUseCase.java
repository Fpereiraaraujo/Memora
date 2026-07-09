package com.memora.core.usecase;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.core.domain.param.ApprovePaymentOrderParam;

public interface ApprovePaymentOrderUseCase {
	PaymentOrder execute(ApprovePaymentOrderParam param);
}
