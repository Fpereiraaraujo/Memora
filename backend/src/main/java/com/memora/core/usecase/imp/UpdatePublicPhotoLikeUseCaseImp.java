package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.UpdatePublicPhotoLikeParam;
import com.memora.core.service.PublicGalleryAccessService;
import com.memora.core.usecase.UpdatePublicPhotoLikeUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class UpdatePublicPhotoLikeUseCaseImp implements UpdatePublicPhotoLikeUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final PublicGalleryAccessService publicGalleryAccessService;

	public UpdatePublicPhotoLikeUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository,
		UserRepository userRepository,
		PublicGalleryAccessService publicGalleryAccessService
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
		this.userRepository = userRepository;
		this.publicGalleryAccessService = publicGalleryAccessService;
	}

	@Override
	public Photo execute(UpdatePublicPhotoLikeParam param) {
		var event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		boolean ownerActive = userRepository.findById(event.getOwnerId())
			.map(user -> user.getStatus() == com.memora.core.domain.model.UserStatus.ACTIVE)
			.orElse(false);
		if (!PublicEventAccessSupport.canOpenPublicFlow(event, ownerActive)) {
			throw new NoSuchElementException("Event not found");
		}
		publicGalleryAccessService.requireEnabled(event.getId());

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
