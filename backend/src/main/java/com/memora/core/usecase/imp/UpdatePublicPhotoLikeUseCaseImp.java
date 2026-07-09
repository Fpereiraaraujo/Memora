package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UpdatePublicPhotoLikeParam;
import com.memora.core.usecase.UpdatePublicPhotoLikeUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class UpdatePublicPhotoLikeUseCaseImp implements UpdatePublicPhotoLikeUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public UpdatePublicPhotoLikeUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public Photo execute(UpdatePublicPhotoLikeParam param) {
		var event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (!PublicEventAccessSupport.canOpenPublicFlow(event)) {
			throw new NoSuchElementException("Event not found");
		}

		var photo = photoRepository.findByIdAndEventId(param.photoId(), event.getId())
			.orElseThrow(() -> new NoSuchElementException("Photo not found"));

		if (photo.getStatus() != PhotoStatus.AVAILABLE || photo.getObjectKey() == null || photo.getObjectKey().isBlank()) {
			throw new IllegalArgumentException("Photo is not available for likes");
		}

		int currentLikes = Math.max(photo.getLikesCount(), 0);
		int nextLikes = param.liked() ? currentLikes + 1 : Math.max(currentLikes - 1, 0);

		photo.setLikesCount(nextLikes);
		photo.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));

		return PhotoDatabaseMapper.toDomain(photoRepository.save(photo));
	}
}
