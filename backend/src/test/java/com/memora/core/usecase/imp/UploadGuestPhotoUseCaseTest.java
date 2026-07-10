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
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.UploadGuestPhotoParam;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.PhotoJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.core.service.EventFeatureAccessService;
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
	@Mock private UserRepository userRepository;
	@Mock private FileStorageService fileStorageService;

	private UploadGuestPhotoUseCaseImp useCase;

	@BeforeEach
	void setUp() {
		useCase = new UploadGuestPhotoUseCaseImp(
			eventRepository,
			photoRepository,
			userRepository,
			fileStorageService,
			new UploadProperties(20 * 1024 * 1024, List.of("image/jpeg", "image/png", "image/webp"), 60, 60, 5),
			new EventFeatureAccessService()
		);
	}

	@Test
	void allowsActivePaidEventToReceiveValidImage() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(4L);
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(photoParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.AVAILABLE);
		assertThat(photo.getObjectKey()).startsWith("events/isadora-fernando/photos/");
		verify(fileStorageService).store(any(String.class), aryEq(jpegBytes()), eq("image/jpeg"));
	}

	@Test
	void blocksPhotoUploadWhenPlanLimitIsReached() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(500L);

		assertThatThrownBy(() -> useCase.execute(photoParam()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Limite de fotos atingido");

		verify(fileStorageService, never()).store(any(), any(), any());
		verify(photoRepository, never()).save(any());
	}

	@Test
	void allowsPaidEventToUsePlanPhotoLimit() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(499L);
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(photoParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.AVAILABLE);
		verify(fileStorageService).store(any(String.class), aryEq(jpegBytes()), eq("image/jpeg"));
	}

	@Test
	void allowsMessageOnlyEvenWhenPhotoLimitIsReached() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));
		when(photoRepository.save(any(PhotoJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

		var photo = useCase.execute(messageOnlyParam());

		assertThat(photo.getStatus()).isEqualTo(PhotoStatus.RECEIVED);
		assertThat(photo.getObjectKey()).isNull();
		assertThat(photo.getGuestMessage()).isEqualTo("Felicidades!");
		verify(photoRepository, never()).countByEventIdAndObjectKeyIsNotNull(any());
		verify(fileStorageService, never()).store(any(), any(), any());
	}

	@Test
	void blocksUploadForDraftEventWithoutPlan() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.DRAFT, null, null)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));

		assertThatThrownBy(() -> useCase.execute(photoParam()))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("confirmação do plano");

		verify(fileStorageService, never()).store(any(), any(), any());
	}

	@Test
	void rejectsFileWhoseBytesDoNotMatchDeclaredImageType() {
		when(eventRepository.findBySlug("isadora-fernando")).thenReturn(Optional.of(eventEntity(EventStatus.ACTIVE, EventPlanCode.EVENT, 500)));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(ownerEntity()));

		UploadGuestPhotoParam invalidFile = new UploadGuestPhotoParam(
			"isadora-fernando", null, null, "foto.jpg", "image/jpeg", 4,
			new byte[] { 1, 2, 3, 4 }, UUID.randomUUID()
		);

		assertThatThrownBy(() -> useCase.execute(invalidFile))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("Formato de arquivo não suportado");
	}

	private UploadGuestPhotoParam photoParam() {
		return new UploadGuestPhotoParam(
			"isadora-fernando",
			"Fernando",
			"Felicidades!",
			"foto.jpg",
			"image/jpeg",
			jpegBytes().length,
			jpegBytes(),
			UUID.randomUUID()
		);
	}

	private byte[] jpegBytes() {
		return new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00 };
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

	private UserEntity ownerEntity() {
		LocalDateTime now = LocalDateTime.now();
		return UserEntity.builder()
			.id(OWNER_ID)
			.name("Fernando")
			.email("fernando@memora.com")
			.passwordHash("hash")
			.role(UserRole.HOST)
			.status(UserStatus.ACTIVE)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
