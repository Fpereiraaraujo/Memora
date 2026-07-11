package com.memora.core.service;

import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.core.domain.model.InfluencerStatus;
import com.memora.dataprovider.database.entity.InfluencerJpaEntity;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.InfluencerRepository;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class ReferralCouponResolverService {

	private final InfluencerRepository influencerRepository;
	private final CouponRepository couponRepository;
	private final CouponValidationService couponValidationService;

	public ReferralCouponResolverService(
		InfluencerRepository influencerRepository,
		CouponRepository couponRepository,
		CouponValidationService couponValidationService
	) {
		this.influencerRepository = influencerRepository;
		this.couponRepository = couponRepository;
		this.couponValidationService = couponValidationService;
	}

	public ResolvedCouponInput resolve(String couponCode, String referralCode) {
		String normalizedCouponCode = normalize(couponCode);
		if (normalizedCouponCode != null) {
			return new ResolvedCouponInput(normalizedCouponCode, false, normalize(referralCode));
		}

		String normalizedReferralCode = normalize(referralCode);
		if (normalizedReferralCode == null) {
			return new ResolvedCouponInput(null, false, null);
		}

		return influencerRepository.findByReferralCode(normalizedReferralCode)
			.filter(influencer -> influencer.getStatus() == InfluencerStatus.ACTIVE)
			.map(this::resolveInfluencerCoupon)
			.orElse(new ResolvedCouponInput(null, false, normalizedReferralCode));
	}

	private ResolvedCouponInput resolveInfluencerCoupon(InfluencerJpaEntity influencer) {
		return couponRepository.findAllByInfluencerIdOrderByCreatedAtAsc(influencer.getId())
			.stream()
			.map(coupon -> couponValidationService.validateByCode(coupon.getCode()))
			.filter(result -> result.getStatus() == CouponValidationStatus.VALID && result.getCoupon() != null)
			.findFirst()
			.map(result -> new ResolvedCouponInput(result.getNormalizedCode(), true, influencer.getReferralCode()))
			.orElse(new ResolvedCouponInput(null, false, influencer.getReferralCode()));
	}

	private String normalize(String value) {
		if (value == null) {
			return null;
		}

		String normalized = value.trim().toUpperCase(Locale.ROOT);
		return normalized.isBlank() ? null : normalized;
	}

	public record ResolvedCouponInput(
		String couponCode,
		boolean fromReferral,
		String referralCode
	) {
	}
}
