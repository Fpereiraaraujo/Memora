package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PublicGalleryAccessServiceTest {

	@Mock
	private EventCustomizationRepository eventCustomizationRepository;

	@Test
	void allowsGalleryWhenEventHasNoCustomizationYet() {
		UUID eventId = UUID.randomUUID();
		when(eventCustomizationRepository.findByEventId(eventId)).thenReturn(Optional.empty());

		assertThatCode(() -> service().requireEnabled(eventId)).doesNotThrowAnyException();
	}

	@Test
	void blocksGalleryWhenHostDisablesPublicVisibility() {
		UUID eventId = UUID.randomUUID();
		var customization = EventCustomizationJpaEntity.builder()
			.id(UUID.randomUUID())
			.eventId(eventId)
			.publicGalleryEnabled(false)
			.build();
		when(eventCustomizationRepository.findByEventId(eventId)).thenReturn(Optional.of(customization));

		assertThatThrownBy(() -> service().requireEnabled(eventId))
			.isInstanceOf(NoSuchElementException.class)
			.hasMessage("Public gallery not found");
	}

	private PublicGalleryAccessService service() {
		return new PublicGalleryAccessService(eventCustomizationRepository);
	}
}
