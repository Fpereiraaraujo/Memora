package com.memora.core.service;

import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PublicGalleryAccessService {

	private final EventCustomizationRepository eventCustomizationRepository;

	public PublicGalleryAccessService(EventCustomizationRepository eventCustomizationRepository) {
		this.eventCustomizationRepository = eventCustomizationRepository;
	}

	public void requireEnabled(UUID eventId) {
		boolean enabled = eventCustomizationRepository.findByEventId(eventId)
			.map(customization -> customization.isPublicGalleryEnabled())
			.orElse(true);

		if (!enabled) {
			throw new NoSuchElementException("Public gallery not found");
		}
	}
}
