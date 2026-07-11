package com.memora.dataprovider.database.mapper;

import com.memora.core.domain.model.Influencer;
import com.memora.dataprovider.database.entity.InfluencerJpaEntity;

public final class InfluencerDatabaseMapper {

	private InfluencerDatabaseMapper() {
	}

	public static Influencer toDomain(InfluencerJpaEntity entity) {
		return Influencer.builder()
			.id(entity.getId())
			.name(entity.getName())
			.instagramHandle(entity.getInstagramHandle())
			.referralCode(entity.getReferralCode())
			.email(entity.getEmail())
			.pixKey(entity.getPixKey())
			.status(entity.getStatus())
			.createdAt(entity.getCreatedAt())
			.updatedAt(entity.getUpdatedAt())
			.build();
	}

	public static InfluencerJpaEntity toEntity(Influencer influencer) {
		return InfluencerJpaEntity.builder()
			.id(influencer.getId())
			.name(influencer.getName())
			.instagramHandle(influencer.getInstagramHandle())
			.referralCode(influencer.getReferralCode())
			.email(influencer.getEmail())
			.pixKey(influencer.getPixKey())
			.status(influencer.getStatus())
			.createdAt(influencer.getCreatedAt())
			.updatedAt(influencer.getUpdatedAt())
			.build();
	}
}
