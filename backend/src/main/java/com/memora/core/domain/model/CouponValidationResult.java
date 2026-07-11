package com.memora.core.domain.model;

import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class CouponValidationResult {
	String normalizedCode;
	CouponValidationStatus status;
	Coupon coupon;

	public boolean isValid() {
		return status == CouponValidationStatus.VALID;
	}
}
