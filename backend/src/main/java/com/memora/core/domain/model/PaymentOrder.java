package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class PaymentOrder {
	UUID id;
	UUID eventId;
	UUID userId;
	EventPlanCode planCode;
	PaymentProvider provider;
	PaymentOrderStatus status;
	String orderNsu;
	String checkoutUrl;
	String providerTransactionNsu;
	String providerInvoiceSlug;
	String receiptUrl;
	int amountCents;
	Integer paidAmountCents;
	LocalDateTime paidAt;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
