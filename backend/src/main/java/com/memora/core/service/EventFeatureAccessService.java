package com.memora.core.service;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventPlanCode;
import org.springframework.stereotype.Component;

@Component
public class EventFeatureAccessService {

	private static final int FREE_MODE_PHOTO_LIMIT = 5;

	public boolean allowsFavorites(Event event) {
		return hasAtLeastEventPlan(event);
	}

	public boolean allowsPrivateMessages(Event event) {
		return hasAtLeastEventPlan(event);
	}

	public boolean allowsPublicPageCustomization(Event event) {
		return event != null && event.getPlanCode() == EventPlanCode.PREMIUM;
	}

	public int effectivePhotoLimit(Event event) {
		if (event != null && event.getPhotoLimit() != null && event.getPhotoLimit() > 0) {
			return event.getPhotoLimit();
		}

		return FREE_MODE_PHOTO_LIMIT;
	}

	private boolean hasAtLeastEventPlan(Event event) {
		if (event == null || event.getPlanCode() == null) {
			return false;
		}

		return event.getPlanCode() == EventPlanCode.EVENT || event.getPlanCode() == EventPlanCode.PREMIUM;
	}
}
