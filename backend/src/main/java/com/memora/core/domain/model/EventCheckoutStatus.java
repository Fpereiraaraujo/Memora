package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class EventCheckoutStatus {
	UUID paymentOrderId;
	PaymentOrderStatus status;
	EventPlanCode planCode;
	EventStatus eventStatus;
	LocalDateTime paidAt;
	String checkoutUrl;
}
