package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UpdatePhotoStatusParam;
import com.memora.core.usecase.UpdatePhotoStatusUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class UpdatePhotoStatusUseCaseImp implements UpdatePhotoStatusUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public UpdatePhotoStatusUseCaseImp(EventRepository eventRepository, PhotoRepository photoRepository) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public Photo execute(UpdatePhotoStatusParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		Photo photo = photoRepository.findByIdAndEventId(param.photoId(), param.eventId())
			.map(PhotoDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Photo not found"));

		validateStatus(param.status());

		Photo updated = photo.toBuilder()
			.status(param.status())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		return PhotoDatabaseMapper.toDomain(photoRepository.save(PhotoDatabaseMapper.toEntity(updated)));
	}

	private void validateStatus(PhotoStatus status) {
		if (status == null) {
			throw new IllegalArgumentException("Photo status is required");
		}

		if (status == PhotoStatus.UPLOAD_REQUESTED || status == PhotoStatus.RECEIVED) {
			throw new IllegalArgumentException("Photo status transition is not allowed");
		}
	}
}
