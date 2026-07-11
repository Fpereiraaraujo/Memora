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
	String externalReference;
	String orderNsu;
	String checkoutUrl;
	String providerPaymentId;
	String providerTransactionNsu;
	String providerInvoiceSlug;
	String receiptUrl;
	int amountCents;
	int originalAmountCents;
	int discountAmountCents;
	int finalAmountCents;
	Integer discountPercent;
	UUID couponId;
	String couponCode;
	UUID influencerId;
	Integer commissionPercent;
	Integer commissionAmountCents;
	Integer paidAmountCents;
	LocalDateTime paidAt;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
