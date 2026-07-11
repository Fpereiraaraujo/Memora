package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Coupon;
import com.memora.dataprovider.database.entity.CouponJpaEntity;

public final class CouponDatabaseMapper {

	private CouponDatabaseMapper() {
	}

	public static Coupon toDomain(CouponJpaEntity entity) {
		return Coupon.builder()
			.id(entity.getId())
			.code(entity.getCode())
			.influencerId(entity.getInfluencerId())
			.discountPercent(entity.getDiscountPercent())
			.commissionPercent(entity.getCommissionPercent())
			.status(entity.getStatus())
			.startsAt(entity.getStartsAt())
			.expiresAt(entity.getExpiresAt())
			.maxUses(entity.getMaxUses())
			.currentUses(entity.getCurrentUses())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}

	public static CouponJpaEntity toEntity(Coupon coupon) {
		return CouponJpaEntity.builder()
			.id(coupon.getId())
			.code(coupon.getCode())
			.influencerId(coupon.getInfluencerId())
			.discountPercent(coupon.getDiscountPercent())
			.commissionPercent(coupon.getCommissionPercent())
			.status(coupon.getStatus())
			.startsAt(coupon.getStartsAt())
			.expiresAt(coupon.getExpiresAt())
			.maxUses(coupon.getMaxUses())
			.currentUses(coupon.getCurrentUses())
			.createdAt(coupon.getCreatedAt())
			.updatedAt(coupon.getUpdatedAt())
			.build();
	}
}
