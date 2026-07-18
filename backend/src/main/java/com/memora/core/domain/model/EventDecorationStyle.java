package com.memora.core.domain.model;

public enum EventDecorationStyle {
	HEARTS,
	CLOUDS_STARS,
	FLORAL,
	CONFETTI;

	public static EventDecorationStyle fromStored(String value, EventDecorationStyle fallback) {
		if (value == null || value.isBlank()) {
			return fallback;
		}

		try {
			return valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException exception) {
			return fallback;
		}
	}
}
