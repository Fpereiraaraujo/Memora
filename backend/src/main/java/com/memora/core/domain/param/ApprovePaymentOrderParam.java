package com.memora.core.domain.param;

import java.util.UUID;

public record ApprovePaymentOrderParam(
	UUID paymentOrderId
) {
}
