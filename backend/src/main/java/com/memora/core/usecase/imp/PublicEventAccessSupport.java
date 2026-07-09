package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;

final class PublicEventAccessSupport {

	private PublicEventAccessSupport() {
	}

	static boolean canOpenPublicFlow(Event event) {
		return event.getStatus() == EventStatus.DRAFT || event.getStatus() == EventStatus.ACTIVE;
	}

	static boolean canOpenPublicFlow(Event event, boolean ownerActive) {
		return ownerActive && canOpenPublicFlow(event);
	}
}
