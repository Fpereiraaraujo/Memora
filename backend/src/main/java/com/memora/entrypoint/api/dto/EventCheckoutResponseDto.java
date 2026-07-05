package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.PaymentOrderStatus;
import java.util.UUID;

public record EventCheckoutResponseDto(
	UUID paymentOrderId,
	EventPlanCode planCode,
	PaymentOrderStatus status,
	int amountCents,
	String checkoutUrl
) {
}
