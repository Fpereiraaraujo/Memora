package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicTopLikedPhotosParam;
import com.memora.core.usecase.ListPublicTopLikedPhotosUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ListPublicTopLikedPhotosUseCaseImp implements ListPublicTopLikedPhotosUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public ListPublicTopLikedPhotosUseCaseImp(
		EventRepository eventRepository,
		PhotoRepository photoRepository
	) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public List<Photo> execute(ListPublicTopLikedPhotosParam param) {
		var event = eventRepository.findBySlug(param.slug())
			.map(com.memora.dataprovider.database.mapper.EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (!PublicEventAccessSupport.canOpenPublicFlow(event)) {
			throw new NoSuchElementException("Event not found");
		}

		return photoRepository.findTop10ByEventIdAndStatusAndObjectKeyIsNotNullOrderByLikesCountDescCreatedAtDesc(
				event.getId(),
				PhotoStatus.AVAILABLE
			)
			.stream()
			.map(PhotoDatabaseMapper::toDomain)
			.toList();
	}
}
