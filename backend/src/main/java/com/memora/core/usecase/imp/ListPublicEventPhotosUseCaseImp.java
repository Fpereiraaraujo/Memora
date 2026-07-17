package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import com.memora.core.service.PublicGalleryAccessService;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ListPublicEventPhotosUseCaseImp implements ListPublicEventPhotosUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final PublicGalleryAccessService publicGalleryAccessService;

	public ListPublicEventPhotosUseCaseImp(
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
	public List<Photo> execute(ListPublicEventPhotosParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		boolean ownerActive = userRepository.findById(event.getOwnerId())
			.map(user -> user.getStatus() == com.memora.core.domain.model.UserStatus.ACTIVE)
			.orElse(false);
		if (!PublicEventAccessSupport.canOpenPublicFlow(event, ownerActive)) {
			throw new NoSuchElementException("Event not found");
		}
		publicGalleryAccessService.requireEnabled(event.getId());

		return photoRepository.findAllByEventIdAndStatusAndObjectKeyIsNotNullOrderByCreatedAtDesc(event.getId(), PhotoStatus.AVAILABLE)
			.stream()
			.map(PhotoDatabaseMapper::toDomain)
			.toList();
	}
}
