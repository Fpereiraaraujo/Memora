package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Plan;
import com.memora.dataprovider.database.entity.PlanJpaEntity;

public final class PlanDatabaseMapper {

	private PlanDatabaseMapper() {
	}

	public static Plan toDomain(PlanJpaEntity entity) {
		return Plan.builder()
			.code(entity.getCode())
			.name(entity.getName())
			.priceCents(entity.getPriceCents())
			.photoLimit(entity.getPhotoLimit())
			.storageMonths(entity.getStorageMonths())
			.active(entity.isActive())
			.checkoutUrl(entity.getCheckoutUrl())
			.build();
	}
}
