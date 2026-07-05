package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicEventPhotosParam;
import com.memora.core.usecase.ListPublicEventPhotosUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ListPublicEventPhotosUseCaseImp implements ListPublicEventPhotosUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public ListPublicEventPhotosUseCaseImp(EventRepository eventRepository, PhotoRepository photoRepository) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public List<Photo> execute(ListPublicEventPhotosParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (event.getStatus() != EventStatus.ACTIVE) {
			throw new NoSuchElementException("Event not found");
		}

		return photoRepository.findAllByEventIdAndStatusOrderByCreatedAtDesc(event.getId(), PhotoStatus.AVAILABLE)
			.stream()
			.map(PhotoDatabaseMapper::toDomain)
			.toList();
	}
}
