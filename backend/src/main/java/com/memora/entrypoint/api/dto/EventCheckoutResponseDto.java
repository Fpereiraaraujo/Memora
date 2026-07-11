package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.PaymentOrderStatus;
import java.util.UUID;

public record EventCheckoutResponseDto(
	UUID paymentOrderId,
	EventPlanCode planCode,
	PaymentOrderStatus status,
	int originalAmountCents,
	int discountAmountCents,
	int finalAmountCents,
	String couponCode,
	Integer discountPercent,
	String message,
	String checkoutUrl
) {
}
