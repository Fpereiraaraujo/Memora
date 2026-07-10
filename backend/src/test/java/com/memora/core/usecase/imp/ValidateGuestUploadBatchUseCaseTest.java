package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.memora.config.UploadProperties;
import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.EventType;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.ValidateGuestUploadBatchParam;
import com.memora.core.service.EventFeatureAccessService;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
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
class ValidateGuestUploadBatchUseCaseTest {

	private static final UUID EVENT_ID = UUID.randomUUID();
	private static final UUID OWNER_ID = UUID.randomUUID();

	@Mock private EventRepository eventRepository;
	@Mock private PhotoRepository photoRepository;
	@Mock private UserRepository userRepository;

	private ValidateGuestUploadBatchUseCaseImp useCase;

	@BeforeEach
	void setUp() {
		useCase = new ValidateGuestUploadBatchUseCaseImp(
			eventRepository,
			photoRepository,
			userRepository,
			new EventFeatureAccessService(),
			new UploadProperties(20 * 1024 * 1024, List.of("image/jpeg", "image/png", "image/webp"), 10, 30, 5)
		);
	}

	@Test
	void acceptsBatchThatFitsRemainingPlanLimit() {
		mockEvent(EventStatus.ACTIVE, EventPlanCode.EVENT, 500);
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(497L);

		assertThatCode(() -> useCase.execute(new ValidateGuestUploadBatchParam("casamento", 3, 12_000_000)))
			.doesNotThrowAnyException();
	}

	@Test
	void rejectsBatchBeforeStorageWhenItExceedsRemainingLimit() {
		mockEvent(EventStatus.ACTIVE, EventPlanCode.EVENT, 500);
		when(photoRepository.countByEventIdAndObjectKeyIsNotNull(EVENT_ID)).thenReturn(498L);

		assertThatThrownBy(() -> useCase.execute(new ValidateGuestUploadBatchParam("casamento", 3, 12_000_000)))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("ultrapassa o limite");
	}

	@Test
	void rejectsDraftEventWithoutApprovedPlan() {
		mockEvent(EventStatus.DRAFT, null, null);

		assertThatThrownBy(() -> useCase.execute(new ValidateGuestUploadBatchParam("casamento", 1, 4_000_000)))
			.isInstanceOf(IllegalArgumentException.class)
			.hasMessageContaining("confirmação do plano");
	}

	private void mockEvent(EventStatus status, EventPlanCode planCode, Integer photoLimit) {
		LocalDateTime now = LocalDateTime.now();
		when(eventRepository.findBySlug("casamento")).thenReturn(Optional.of(EventJpaEntity.builder()
			.id(EVENT_ID)
			.ownerId(OWNER_ID)
			.type(EventType.WEDDING)
			.title("Casamento")
			.slug("casamento")
			.status(status)
			.planCode(planCode)
			.photoLimit(photoLimit)
			.createdAt(now)
			.updatedAt(now)
			.build()));
		when(userRepository.findById(OWNER_ID)).thenReturn(Optional.of(UserEntity.builder()
			.id(OWNER_ID)
			.name("Anfitrião")
			.email("host@memora.test")
			.passwordHash("hash")
			.role(UserRole.HOST)
			.status(UserStatus.ACTIVE)
			.createdAt(now)
			.updatedAt(now)
			.build()));
	}
}
