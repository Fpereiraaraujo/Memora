package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.AdditionalMatchers.aryEq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.PhotoJpaEntity;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UploadGuestPhotoUseCaseTest {

	private static final UUID EVENT_ID = UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1");
	private static final UUID OWNER_ID = UUID.fromString("0c7da9d0-c6f1-4692-b6d4-2f2fdf762879");

	@Mock private EventRepository eventRepository;
	@Mock private PhotoRepository photoRepository;
	@Mock private FileStorageService fileStorageService;

	private UploadGuestPhotoUseCaseImp useCase;

	@BeforeEach
	void setUp() {
		useCase = new UploadGuestPhotoUseCaseImp(
			eventRepository,
			photoRepository,
			fileStorageService,
			new UploadProperties(20 * 1024 * 1024, List.of("image/jpeg", "image/png", "image/webp"), 60, 60, 5)
		);
	}

	@Test
	void allowsDraftEventToReceivePhotosUntilFreeLimit() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT, null, null)));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(4L);
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(photoParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.AVAILABLE);
		assertThat(photo.getObjectKey()).startsWith("events/isadora-fernando/photos/");
		verify(fileStorageService).store(any(String.class), aryEq(new byte[] { 1, 2, 3 }), eq("image/jpeg"));
	}

	@Test
	void blocksPhotoUploadWhenFreeLimitIsReached() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT, null, null)));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(5L);

		assertThatThrownBy(() -> useCase.execute(photoParam()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Limite de fotos atingido");

		verify(fileStorageService, never()).store(any(), any(), any());
		verify(photoRepository, never()).save(any());
	}

	@Test
	void allowsPaidEventToUsePlanPhotoLimit() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(499L);
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(photoParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.AVAILABLE);
		verify(fileStorageService).store(any(String.class), aryEq(new byte[] { 1, 2, 3 }), eq("image/jpeg"));
	}

	@Test
	void allowsMessageOnlyEvenWhenPhotoLimitIsReached() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT, null, null)));
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(messageOnlyParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.RECEIVED);
		assertThat(photo.getObjectKey()).isNull();
		assertThat(photo.getGuestMessage()).isEqualTo("Felicidades!");
		verify(photoRepository, never()).countByEventIdAndObjectKeyIsNotNull(any());
		verify(fileStorageService, never()).store(any(), any(), any());
	}

	private UploadGuestPhotoParam photoParam() {
		return new UploadGuestPhotoParam(
			"isadora-fernando",
			"Fernando",
			"Felicidades!",
			"foto.jpg",
			"image/jpeg",
			3,
			new byte[] { 1, 2, 3 },
			UUID.randomUUID()
		);
	}

	private UploadGuestPhotoParam messageOnlyParam() {
		return new UploadGuestPhotoParam(
			"isadora-fernando",
			"Fernando",
			"Felicidades!",
			null,
			null,
			0,
			null,
			UUID.randomUUID()
		);
	}

	private EventJpaEntity eventEntity(EventStatus status, EventPlanCode planCode, Integer photoLimit) {
		LocalDateTime now = LocalDateTime.now();
		return EventJpaEntity.builder()
			.id(EVENT_ID)
			.ownerId(OWNER_ID)
			.type(EventType.WEDDING)
			.title("Isadora & Fernando")
			.slug("isadora-fernando")
			.eventDate(LocalDate.of(2026, 10, 8))
			.location("Campo Largo")
			.status(status)
			.planCode(planCode)
			.photoLimit(photoLimit)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
