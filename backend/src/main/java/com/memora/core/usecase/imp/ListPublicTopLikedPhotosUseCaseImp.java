package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicTopLikedPhotosParam;
import com.memora.core.service.PublicGalleryAccessService;
import com.memora.core.usecase.ListPublicTopLikedPhotosUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ListPublicTopLikedPhotosUseCaseImp implements ListPublicTopLikedPhotosUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final PublicGalleryAccessService publicGalleryAccessService;

	public ListPublicTopLikedPhotosUseCaseImp(
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
	public List<Photo> execute(ListPublicTopLikedPhotosParam param) {
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

		return photoRepository.findTop10ByEventIdAndStatusAndObjectKeyIsNotNullOrderByLikesCountDescCreatedAtDesc(
				event.getId(),
				PhotoStatus.AVAILABLE
			)
			.stream()
			.map(PhotoDatabaseMapper::toDomain)
			.toList();
	}
}
