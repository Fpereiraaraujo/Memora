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
			.originalAmountCents(paymentOrder.getOriginalAmountCents())
			.discountAmountCents(paymentOrder.getDiscountAmountCents())
			.finalAmountCents(paymentOrder.getFinalAmountCents())
			.discountPercent(paymentOrder.getDiscountPercent())
			.couponId(paymentOrder.getCouponId())
			.couponCode(paymentOrder.getCouponCode())
			.influencerId(paymentOrder.getInfluencerId())
			.commissionPercent(paymentOrder.getCommissionPercent())
			.commissionAmountCents(paymentOrder.getCommissionAmountCents())
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
			.originalAmountCents(entity.getOriginalAmountCents())
			.discountAmountCents(entity.getDiscountAmountCents())
			.finalAmountCents(entity.getFinalAmountCents())
			.discountPercent(entity.getDiscountPercent())
			.couponId(entity.getCouponId())
			.couponCode(entity.getCouponCode())
			.influencerId(entity.getInfluencerId())
			.commissionPercent(entity.getCommissionPercent())
			.commissionAmountCents(entity.getCommissionAmountCents())
			.paidAmountCents(entity.getPaidAmountCents())
			.paidAt(entity.getPaidAt())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}
}
