package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Photo;
import com.memora.core.domain.param.ListEventPhotosParam;
import com.memora.core.usecase.ListEventPhotosUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class ListEventPhotosUseCaseImp implements ListEventPhotosUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public ListEventPhotosUseCaseImp(EventRepository eventRepository, PhotoRepository photoRepository) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public List<Photo> execute(ListEventPhotosParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		return photoRepository.findAllByEventIdOrderByCreatedAtDesc(param.eventId())
			.stream()
			.map(PhotoDatabaseMapper::toDomain)
			.toList();
	}
}
