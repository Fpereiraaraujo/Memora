package com.memora.core.domain.model;

public enum EventDecorativeImagePosition {
	HERO_RIGHT,
	HERO_BOTTOM,
	PAGE_TOP_RIGHT,
	PAGE_BOTTOM_LEFT;

	public static EventDecorativeImagePosition fromStored(String value) {
		if (value == null || value.isBlank()) {
			return HERO_RIGHT;
		}

		try {
			return valueOf(value.trim().toUpperCase());
		} catch (IllegalArgumentException exception) {
			return HERO_RIGHT;
		}
	}
}
