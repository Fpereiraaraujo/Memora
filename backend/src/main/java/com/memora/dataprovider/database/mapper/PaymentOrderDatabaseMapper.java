package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.PaymentOrder;
import com.memora.dataprovider.database.entity.PaymentOrderJpaEntity;

public final class PaymentOrderDatabaseMapper {

	private PaymentOrderDatabaseMapper() {
	}

	public static PaymentOrderJpaEntity toEntity(PaymentOrder paymentOrder) {
		return PaymentOrderJpaEntity.builder()
			.id(paymentOrder.getId())
			.eventId(paymentOrder.getEventId())
			.userId(paymentOrder.getUserId())
			.planCode(paymentOrder.getPlanCode())
			.provider(paymentOrder.getProvider())
			.status(paymentOrder.getStatus())
			.externalReference(paymentOrder.getExternalReference())
			.orderNsu(paymentOrder.getOrderNsu())
			.checkoutUrl(paymentOrder.getCheckoutUrl())
			.providerPaymentId(paymentOrder.getProviderPaymentId())
			.providerTransactionNsu(paymentOrder.getProviderTransactionNsu())
			.providerInvoiceSlug(paymentOrder.getProviderInvoiceSlug())
			.receiptUrl(paymentOrder.getReceiptUrl())
			.amountCents(paymentOrder.getAmountCents())
			.paidAmountCents(paymentOrder.getPaidAmountCents())
			.paidAt(paymentOrder.getPaidAt())
			.createdAt(paymentOrder.getCreatedAt())
			.updatedAt(paymentOrder.getUpdatedAt())
			.build();
	}

	public static PaymentOrder toDomain(PaymentOrderJpaEntity entity) {
		return PaymentOrder.builder()
			.id(entity.getId())
			.eventId(entity.getEventId())
			.userId(entity.getUserId())
			.planCode(entity.getPlanCode())
			.provider(entity.getProvider())
			.status(entity.getStatus())
			.externalReference(entity.getExternalReference())
			.orderNsu(entity.getOrderNsu())
			.checkoutUrl(entity.getCheckoutUrl())
			.providerPaymentId(entity.getProviderPaymentId())
			.providerTransactionNsu(entity.getProviderTransactionNsu())
			.providerInvoiceSlug(entity.getProviderInvoiceSlug())
			.receiptUrl(entity.getReceiptUrl())
			.amountCents(entity.getAmountCents())
			.paidAmountCents(entity.getPaidAmountCents())
			.paidAt(entity.getPaidAt())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}
}
