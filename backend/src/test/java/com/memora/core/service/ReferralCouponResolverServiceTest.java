package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.Coupon;
import com.memora.core.domain.model.CouponValidationResult;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.core.domain.model.InfluencerStatus;
import com.memora.dataprovider.database.entity.CouponJpaEntity;
import com.memora.dataprovider.database.entity.InfluencerJpaEntity;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.InfluencerRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReferralCouponResolverServiceTest {

	@Mock private InfluencerRepository influencerRepository;
	@Mock private CouponRepository couponRepository;
	@Mock private CouponValidationService couponValidationService;

	@Test
	void resolveKeepsManualCouponPriorityOverReferral() {
		ReferralCouponResolverService service = new ReferralCouponResolverService(influencerRepository, couponRepository, couponValidationService);

		var result = service.resolve(" noiva10 ", "thay");

		assertThat(result.couponCode()).isEqualTo("NOIVA10");
		assertThat(result.fromReferral()).isFalse();
		assertThat(result.referralCode()).isEqualTo("THAY");
	}

	@Test
	void resolveReturnsValidCouponFromReferralWhenManualCouponIsMissing() {
		ReferralCouponResolverService service = new ReferralCouponResolverService(influencerRepository, couponRepository, couponValidationService);
		UUID influencerId = UUID.randomUUID();
		InfluencerJpaEntity influencer = InfluencerJpaEntity.builder()
			.id(influencerId)
			.name("Thayna")
			.instagramHandle("thayna")
			.referralCode("THAY")
			.status(InfluencerStatus.ACTIVE)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();
		CouponJpaEntity coupon = CouponJpaEntity.builder()
			.id(UUID.randomUUID())
			.code("THAY10")
			.influencerId(influencerId)
			.discountPercent(10)
			.currentUses(0)
			.createdAt(LocalDateTime.now())
			.updatedAt(LocalDateTime.now())
			.build();

		when(influencerRepository.findByReferralCode("THAY")).thenReturn(Optional.of(influencer));
		when(couponRepository.findAllByInfluencerIdOrderByCreatedAtAsc(influencerId)).thenReturn(List.of(coupon));
		when(couponValidationService.validateByCode("THAY10")).thenReturn(CouponValidationResult.builder()
			.normalizedCode("THAY10")
			.status(CouponValidationStatus.VALID)
			.coupon(Coupon.builder().id(coupon.getId()).code("THAY10").influencerId(influencerId).discountPercent(10).currentUses(0).build())
			.build());

		var result = service.resolve(null, "thay");

		assertThat(result.couponCode()).isEqualTo("THAY10");
		assertThat(result.fromReferral()).isTrue();
		assertThat(result.referralCode()).isEqualTo("THAY");
	}
}
