package com.memora.core.service;

import com.memora.core.domain.model.Event;
import org.springframework.stereotype.Component;

@Component
public class EventFeatureAccessService {

	private static final int FREE_MODE_PHOTO_LIMIT = 5;

	public int effectivePhotoLimit(Event event) {
		if (event != null && event.getPhotoLimit() != null && event.getPhotoLimit() > 0) {
			return event.getPhotoLimit();
		}

		return FREE_MODE_PHOTO_LIMIT;
	}
}
