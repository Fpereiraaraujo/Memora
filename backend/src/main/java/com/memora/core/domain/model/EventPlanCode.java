package com.memora.core.domain.model;

public enum EventPlanCode {
	ESSENTIAL(5990, 150, 3, "Plano Essencial"),
	EVENT(9990, 500, 6, "Plano Evento"),
	PREMIUM(14990, 1500, 12, "Plano Premium");

	private final int amountCents;
	private final int photoLimit;
	private final int storageMonths;
	private final String displayName;

	EventPlanCode(int amountCents, int photoLimit, int storageMonths, String displayName) {
		this.amountCents = amountCents;
		this.photoLimit = photoLimit;
		this.storageMonths = storageMonths;
		this.displayName = displayName;
	}

	public int getAmountCents() {
		return amountCents;
	}

	public int getPhotoLimit() {
		return photoLimit;
	}

	public int getStorageMonths() {
		return storageMonths;
	}

	public String getDisplayName() {
		return displayName;
	}
}
