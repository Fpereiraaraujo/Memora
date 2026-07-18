package com.memora.core.domain.model;

public enum EventThemeTemplateCode {
	MEMORA_CLASSIC,
	KIDS_SKY,
	KIDS_BLUSH,
	FLORAL_ELEGANT,
	PARTY_BOLD;

	public static EventThemeTemplateCode fromStored(String value) {
		if (value == null || value.isBlank()) {
			return MEMORA_CLASSIC;
		}

		try {
			return valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException exception) {
			return MEMORA_CLASSIC;
		}
	}
}
