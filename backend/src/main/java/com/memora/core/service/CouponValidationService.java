package com.memora.core.service;

import com.memora.core.domain.model.Coupon;
import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.CouponValidationResult;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.dataprovider.database.mapper.CouponDatabaseMapper;
import com.memora.dataprovider.database.repository.CouponRepository;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CouponValidationService {

	private final CouponRepository couponRepository;
	private final Clock clock;

	@Autowired
	public CouponValidationService(CouponRepository couponRepository) {
		this(couponRepository, Clock.systemUTC());
	}

	CouponValidationService(CouponRepository couponRepository, Clock clock) {
		this.couponRepository = couponRepository;
		this.clock = clock;
	}

	public CouponValidationResult validateByCode(String couponCode) {
		String normalizedCode = normalizeCode(couponCode);
		if (normalizedCode == null) {
			return CouponValidationResult.builder()
				.normalizedCode(null)
				.status(CouponValidationStatus.NOT_FOUND)
				.build();
		}

		return couponRepository.findByCode(normalizedCode)
			.map(CouponDatabaseMapper::toDomain)
			.map(coupon -> buildResult(normalizedCode, coupon))
			.orElseGet(() -> CouponValidationResult.builder()
				.normalizedCode(normalizedCode)
				.status(CouponValidationStatus.NOT_FOUND)
				.build());
	}

	private CouponValidationResult buildResult(String normalizedCode, Coupon coupon) {
		LocalDateTime now = LocalDateTime.now(clock);
		CouponValidationStatus status = determineStatus(coupon, now);

		return CouponValidationResult.builder()
			.normalizedCode(normalizedCode)
			.status(status)
			.coupon(status == CouponValidationStatus.VALID ? coupon : null)
			.build();
	}

	private CouponValidationStatus determineStatus(Coupon coupon, LocalDateTime now) {
		if (coupon.getStatus() == CouponStatus.INACTIVE) {
			return CouponValidationStatus.INACTIVE;
		}

		if (coupon.getStatus() == CouponStatus.EXPIRED
			|| (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(now))) {
			return CouponValidationStatus.EXPIRED;
		}

		if (coupon.getStartsAt() != null && coupon.getStartsAt().isAfter(now)) {
			return CouponValidationStatus.INACTIVE;
		}

		if (coupon.getMaxUses() != null && coupon.getCurrentUses() >= coupon.getMaxUses()) {
			return CouponValidationStatus.MAX_USES_REACHED;
		}

		return CouponValidationStatus.VALID;
	}

	private String normalizeCode(String couponCode) {
		if (couponCode == null) {
			return null;
		}

		String normalizedCode = couponCode.trim().toUpperCase(Locale.ROOT);
		return normalizedCode.isBlank() ? null : normalizedCode;
	}
}
