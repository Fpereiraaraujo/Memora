package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.UpdatePhotoFavoriteParam;
import com.memora.core.usecase.UpdatePhotoFavoriteUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class UpdatePhotoFavoriteUseCaseImp implements UpdatePhotoFavoriteUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public UpdatePhotoFavoriteUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public Photo execute(UpdatePhotoFavoriteParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		Photo photo = photoRepository.findByIdAndEventId(param.photoId(), param.eventId())
			.map(PhotoDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Photo not found"));

		Photo updated = photo.toBuilder()
			.favorite(param.favorite())
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();

		return PhotoDatabaseMapper.toDomain(photoRepository.save(PhotoDatabaseMapper.toEntity(updated)));
	}
}
