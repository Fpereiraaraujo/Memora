package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListEventPhotosPageParam;
import com.memora.core.domain.param.ListEventPhotosParam;
import com.memora.dataprovider.database.entity.EventJpaEntity;
import com.memora.dataprovider.database.entity.PhotoJpaEntity;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class ListEventPhotosUseCaseTest {

	private static final UUID EVENT_ID = UUID.randomUUID();
	private static final UUID OWNER_ID = UUID.randomUUID();
	private static final UUID PHOTO_ID = UUID.randomUUID();

	@Mock private EventRepository eventRepository;
	@Mock private PhotoRepository photoRepository;

	private ListEventPhotosUseCaseImp listUseCase;
	private ListEventPhotosPageUseCaseImp listPageUseCase;

	@BeforeEach
	void setUp() {
		listUseCase = new ListEventPhotosUseCaseImp(eventRepository, photoRepository);
		listPageUseCase = new ListEventPhotosPageUseCaseImp(eventRepository, photoRepository);
		when(eventRepository.findByIdAndOwnerId(EVENT_ID, OWNER_ID))
			.thenReturn(Optional.of(EventJpaEntity.builder().id(EVENT_ID).ownerId(OWNER_ID).build()));
	}

	@Test
	void excludesRemovedPhotosFromHostGallery() {
		when(photoRepository.findAllByEventIdAndStatusNotOrderByCreatedAtDesc(EVENT_ID, PhotoStatus.REMOVED))
			.thenReturn(List.of(photoEntity()));

		var photos = listUseCase.execute(new ListEventPhotosParam(OWNER_ID, EVENT_ID));

		assertThat(photos).extracting(photo -> photo.getId()).containsExactly(PHOTO_ID);
		verify(photoRepository)
			.findAllByEventIdAndStatusNotOrderByCreatedAtDesc(EVENT_ID, PhotoStatus.REMOVED);
	}

	@Test
	void excludesRemovedPhotosFromPagedHostGallery() {
		var pageable = PageRequest.of(0, 12);
		when(photoRepository.findAllByEventIdAndStatusNotOrderByCreatedAtDesc(
			EVENT_ID,
			PhotoStatus.REMOVED,
			pageable
		)).thenReturn(new PageImpl<>(List.of(photoEntity()), pageable, 1));

		var page = listPageUseCase.execute(new ListEventPhotosPageParam(OWNER_ID, EVENT_ID, 0, 12));

		assertThat(page.content()).extracting(photo -> photo.getId()).containsExactly(PHOTO_ID);
		assertThat(page.totalElements()).isEqualTo(1);
		verify(photoRepository).findAllByEventIdAndStatusNotOrderByCreatedAtDesc(
			EVENT_ID,
			PhotoStatus.REMOVED,
			pageable
		);
	}

	private PhotoJpaEntity photoEntity() {
		LocalDateTime now = LocalDateTime.now();
		return PhotoJpaEntity.builder()
			.id(PHOTO_ID)
			.eventId(EVENT_ID)
			.originalFilename("evento.jpg")
			.objectKey("events/evento/photos/evento.jpg")
			.contentType("image/jpeg")
			.sizeBytes(1024L)
			.status(PhotoStatus.AVAILABLE)
			.createdAt(now)
			.updatedAt(now)
			.build();
	}
}
