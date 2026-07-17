package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicEventPhotosPageParam;
import com.memora.core.service.PublicGalleryAccessService;
import com.memora.core.usecase.ListPublicEventPhotosPageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.NoSuchElementException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ListPublicEventPhotosPageUseCaseImp implements ListPublicEventPhotosPageUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;
	private final UserRepository userRepository;
	private final PublicGalleryAccessService publicGalleryAccessService;

	public ListPublicEventPhotosPageUseCaseImp(
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
	public PageResult<Photo> execute(ListPublicEventPhotosPageParam param) {
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

		var pageResult = photoRepository.findAllByEventIdAndStatusAndObjectKeyIsNotNullOrderByCreatedAtDesc(
			event.getId(),
			PhotoStatus.AVAILABLE,
			PageRequest.of(param.page(), param.size())
		);

		return new PageResult<>(
			pageResult.getContent().stream().map(PhotoDatabaseMapper::toDomain).toList(),
			pageResult.getNumber(),
			pageResult.getSize(),
			pageResult.getTotalElements(),
			pageResult.getTotalPages(),
			pageResult.isLast()
		);
	}
}
