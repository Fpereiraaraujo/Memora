package com.memora.core.usecase.imp;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListPublicEventPhotosPageParam;
import com.memora.core.usecase.ListPublicEventPhotosPageUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.util.NoSuchElementException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ListPublicEventPhotosPageUseCaseImp implements ListPublicEventPhotosPageUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public ListPublicEventPhotosPageUseCaseImp(EventRepository eventRepository, PhotoRepository photoRepository) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public PageResult<Photo> execute(ListPublicEventPhotosPageParam param) {
		Event event = eventRepository.findBySlug(param.slug())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		if (event.getStatus() != EventStatus.ACTIVE) {
			throw new NoSuchElementException("Event not found");
		}

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
