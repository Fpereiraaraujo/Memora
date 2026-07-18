package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.startsWith;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.EventDecorationStyle;
import com.memora.core.domain.model.EventDecorativeImagePosition;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventThemeTemplateCode;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.param.RemoveEventPublicPageDecorativeImageParam;
import com.memora.core.domain.param.UploadEventPublicPageDecorativeImageParam;
import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EventPublicPageDecorativeImageUseCaseTest {

	private static final UUID EVENT_ID = UUID.randomUUID();
	private static final UUID OWNER_ID = UUID.randomUUID();
	private static final byte[] PNG_CONTENT = {
		(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x01
	};

	@Mock private EventRepository eventRepository;
	@Mock private EventCustomizationRepository customizationRepository;
	@Mock private FileStorageService fileStorageService;

	private UploadEventPublicPageDecorativeImageUseCaseImp uploadUseCase;
	private RemoveEventPublicPageDecorativeImageUseCaseImp removeUseCase;

	@BeforeEach
	void setUp() {
		uploadUseCase = new UploadEventPublicPageDecorativeImageUseCaseImp(
			eventRepository,
			customizationRepository,
			fileStorageService
		);
		removeUseCase = new RemoveEventPublicPageDecorativeImageUseCaseImp(
			eventRepository,
			customizationRepository,
			fileStorageService
		);
	}

	@Test
	void uploadsValidatedImageAndRemovesPreviousObjectAfterPersisting() {
		var current = customization("events/leonardo/public-page/decorative/old.webp");
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(current));
		when(customizationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var result = uploadUseCase.execute(new UploadEventPublicPageDecorativeImageParam(
			OWNER_ID,
			EVENT_ID,
			"tema.png",
			"image/png",
			PNG_CONTENT
		));

		assertThat(result.getDecorativeImageKey())
			.startsWith("events/leonardo-2-anos/public-page/decorative/")
			.endsWith(".png");
		assertThat(result.getDecorativeImagePosition())
			.isEqualTo(EventDecorativeImagePosition.HERO_BOTTOM);

		var ordered = inOrder(fileStorageService, customizationRepository);
		ordered.verify(fileStorageService).store(
			startsWith("events/leonardo-2-anos/public-page/decorative/"),
			any(),
			org.mockito.ArgumentMatchers.eq("image/png")
		);
		ordered.verify(customizationRepository).save(any());
		ordered.verify(fileStorageService).delete("events/leonardo/public-page/decorative/old.webp");
	}

	@Test
	void rejectsJpegBeforeWritingStorage() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		byte[] jpeg = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x01 };

		assertThatThrownBy(() -> uploadUseCase.execute(new UploadEventPublicPageDecorativeImageParam(
			OWNER_ID,
			EVENT_ID,
			"tema.jpg",
			"image/jpeg",
			jpeg
		))).isInstanceOf(IllegalArgumentException.class);

		verify(fileStorageService, never()).store(any(), any(), any());
		verify(customizationRepository, never()).save(any());
	}

	@Test
	void blocksUploadToAnotherOwnersEvent() {
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> uploadUseCase.execute(new UploadEventPublicPageDecorativeImageParam(
			OWNER_ID,
			EVENT_ID,
			"tema.png",
			"image/png",
			PNG_CONTENT
		))).isInstanceOf(java.util.NoSuchElementException.class);

		verify(fileStorageService, never()).store(any(), any(), any());
	}

	@Test
	void removesReferenceBeforeCleaningStoredObject() {
		String objectKey = "events/leonardo/public-page/decorative/theme.webp";
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID)).thenReturn(Optional.of(event()));
		when(customizationRepository.findByEventId(EVENT_ID))
			.thenReturn(Optional.of(customization(objectKey)));
		when(customizationRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

		var result = removeUseCase.execute(
			new RemoveEventPublicPageDecorativeImageParam(OWNER_ID, EVENT_ID)
		);

		assertThat(result.getDecorativeImageKey()).isNull();
		var ordered = inOrder(customizationRepository, fileStorageService);
		ordered.verify(customizationRepository).save(any());
		ordered.verify(fileStorageService).delete(objectKey);
	}

	private EventCustomizationJpaEntity customization(String decorativeImageKey) {
		return EventCustomizationJpaEntity.builder()
			.id(UUID.randomUUID())
			.eventId(EVENT_ID)
			.templateCode(EventThemeTemplateCode.KIDS_SKY.name())
			.primaryColor("#6AAEE8")
			.secondaryColor("#D9EFFF")
			.accentColor("#FFD66B")
			.decorationStyle(EventDecorationStyle.CLOUDS_STARS.name())
			.decorativeImageKey(decorativeImageKey)
			.decorativeImagePosition(EventDecorativeImagePosition.HERO_BOTTOM.name())
			.publicGalleryEnabled(true)
			.updatedAt(LocalDateTime.now())
			.build();
	}

	private EventJpaEntity event() {
		LocalDateTime now = LocalDateTime.now();
		return EventJpaEntity.builder()
			.id(EVENT_ID)
			.ownerId(OWNER_ID)
			.type(EventType.BIRTHDAY)
			.title("Leonardo 2 anos")
			.slug("leonardo-2-anos")
			.eventDate(LocalDate.now().plusDays(10))
			.location("Espaço Azul")
			.status(EventStatus.ACTIVE)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
