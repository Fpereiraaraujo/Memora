package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.CouponValidationStatus;
import com.memora.dataprovider.database.entity.CouponJpaEntity;
import com.memora.dataprovider.database.repository.CouponRepository;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CouponValidationServiceTest {

	private static final Instant FIXED_NOW = Instant.parse("2026-07-11T12:00:00Z");

	@Mock
	private CouponRepository couponRepository;

	private CouponValidationService couponValidationService;

	@BeforeEach
	void setUp() {
		couponValidationService = new CouponValidationService(
			couponRepository,
			Clock.fixed(FIXED_NOW, ZoneOffset.UTC)
		);
	}

	@Test
	void validateByCodeReturnsValidForActiveCoupon() {
		when(couponRepository.findByCode("MEMORA10"))
			.thenReturn(Optional.of(couponEntity("MEMORA10", CouponStatus.ACTIVE, null)));

		var result = couponValidationService.validateByCode("memora10");

		assertThat(result.getNormalizedCode()).isEqualTo("MEMORA10");
		assertThat(result.getStatus()).isEqualTo(CouponValidationStatus.VALID);
		assertThat(result.isValid()).isTrue();
		assertThat(result.getCoupon()).isNotNull();
	}

	@Test
	void validateByCodeReturnsExpiredWhenCouponHasPastExpirationDate() {
		when(couponRepository.findByCode("MEMORA10"))
			.thenReturn(Optional.of(couponEntity("MEMORA10", CouponStatus.ACTIVE, LocalDateTime.of(2026, 7, 10, 23, 59))));

		var result = couponValidationService.validateByCode("MEMORA10");

		assertThat(result.getStatus()).isEqualTo(CouponValidationStatus.EXPIRED);
		assertThat(result.getCoupon()).isNull();
	}

	@Test
	void validateByCodeReturnsInactiveForInactiveCoupon() {
		when(couponRepository.findByCode("MEMORA10"))
			.thenReturn(Optional.of(couponEntity("MEMORA10", CouponStatus.INACTIVE, null)));

		var result = couponValidationService.validateByCode("MEMORA10");

		assertThat(result.getStatus()).isEqualTo(CouponValidationStatus.INACTIVE);
	}

	@Test
	void validateByCodeReturnsNotFoundWhenCouponDoesNotExist() {
		when(couponRepository.findByCode("MISSING10")).thenReturn(Optional.empty());

		var result = couponValidationService.validateByCode("missing10");

		assertThat(result.getNormalizedCode()).isEqualTo("MISSING10");
		assertThat(result.getStatus()).isEqualTo(CouponValidationStatus.NOT_FOUND);
	}

	@Test
	void validateByCodeNormalizesToUppercaseAndTrim() {
		when(couponRepository.findByCode("NOIVA10"))
			.thenReturn(Optional.of(couponEntity("NOIVA10", CouponStatus.ACTIVE, null)));

		var result = couponValidationService.validateByCode("  noiva10  ");

		assertThat(result.getNormalizedCode()).isEqualTo("NOIVA10");
		assertThat(result.getCoupon()).isNotNull();
		assertThat(result.getCoupon().getCode()).isEqualTo("NOIVA10");
	}

	private CouponJpaEntity couponEntity(String code, CouponStatus status, LocalDateTime expiresAt) {
		LocalDateTime now = LocalDateTime.ofInstant(FIXED_NOW, ZoneOffset.UTC);
		return CouponJpaEntity.builder()
			.id(UUID.randomUUID())
			.code(code)
			.discountPercent(10)
			.commissionPercent(20)
			.status(status)
			.expiresAt(expiresAt)
			.currentUses(0)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
