package com.memora.core.usecase.imp;

import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.model.Photo;
import com.memora.core.domain.model.PhotoStatus;
import com.memora.core.domain.param.ListEventPhotosPageParam;
import com.memora.core.usecase.ListEventPhotosPageUseCase;
import com.memora.dataprovider.database.mapper.PhotoDatabaseMapper;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import java.util.NoSuchElementException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ListEventPhotosPageUseCaseImp implements ListEventPhotosPageUseCase {

	private final EventRepository eventRepository;
	private final PhotoRepository photoRepository;

	public ListEventPhotosPageUseCaseImp(EventRepository eventRepository, PhotoRepository photoRepository) {
		this.eventRepository = eventRepository;
		this.photoRepository = photoRepository;
	}

	@Override
	public PageResult<Photo> execute(ListEventPhotosPageParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.orElseThrow(() -> new NoSuchElementException("Event not found"));

		var pageResult = photoRepository.findAllByEventIdAndStatusNotOrderByCreatedAtDesc(
			param.eventId(),
			PhotoStatus.REMOVED,
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
