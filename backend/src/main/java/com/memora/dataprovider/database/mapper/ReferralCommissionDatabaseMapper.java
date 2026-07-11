package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.ReferralCommission;
import com.memora.dataprovider.database.entity.ReferralCommissionJpaEntity;

public final class ReferralCommissionDatabaseMapper {

	private ReferralCommissionDatabaseMapper() {
	}

	public static ReferralCommission toDomain(ReferralCommissionJpaEntity entity) {
		return ReferralCommission.builder()
			.id(entity.getId())
			.influencerId(entity.getInfluencerId())
			.couponId(entity.getCouponId())
			.paymentOrderId(entity.getPaymentOrderId())
			.eventId(entity.getEventId())
			.userId(entity.getUserId())
			.grossAmountCents(entity.getGrossAmountCents())
			.discountAmountCents(entity.getDiscountAmountCents())
			.netAmountCents(entity.getNetAmountCents())
			.commissionPercent(entity.getCommissionPercent())
			.commissionAmountCents(entity.getCommissionAmountCents())
			.status(entity.getStatus())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.paidAt(entity.getPaidAt())
			.build();
	}

	public static ReferralCommissionJpaEntity toEntity(ReferralCommission commission) {
		return ReferralCommissionJpaEntity.builder()
			.id(commission.getId())
			.influencerId(commission.getInfluencerId())
			.couponId(commission.getCouponId())
			.paymentOrderId(commission.getPaymentOrderId())
			.eventId(commission.getEventId())
			.userId(commission.getUserId())
			.grossAmountCents(commission.getGrossAmountCents())
			.discountAmountCents(commission.getDiscountAmountCents())
			.netAmountCents(commission.getNetAmountCents())
			.commissionPercent(commission.getCommissionPercent())
			.commissionAmountCents(commission.getCommissionAmountCents())
			.status(commission.getStatus())
			.createdAt(commission.getCreatedAt())
			.updatedAt(commission.getUpdatedAt())
			.paidAt(commission.getPaidAt())
			.build();
	}
}
