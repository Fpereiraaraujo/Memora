package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.PaymentOrderStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record EventCheckoutStatusResponseDto(
	UUID paymentOrderId,
	PaymentOrderStatus status,
	EventPlanCode planCode,
	EventStatus eventStatus,
	LocalDateTime paidAt,
	String checkoutUrl
) {
}
