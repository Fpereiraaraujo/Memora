package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.PageResult;
import com.memora.core.domain.param.ListEventGuestsParam;
import com.memora.core.usecase.ListEventGuestsUseCase;
import com.memora.dataprovider.database.mapper.EventGuestDatabaseMapper;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ListEventGuestsUseCaseImp implements ListEventGuestsUseCase {
	private final EventRepository eventRepository;
	private final EventGuestRepository guestRepository;

	public ListEventGuestsUseCaseImp(EventRepository eventRepository, EventGuestRepository guestRepository) { this.eventRepository = eventRepository; this.guestRepository = guestRepository; }

	@Override
	public PageResult<EventGuest> execute(ListEventGuestsParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId()).orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));
		var page = guestRepository.findByEventIdOrderByCreatedAtDesc(param.eventId(), PageRequest.of(Math.max(0, param.page()), Math.min(Math.max(1, param.size()), 100)));
		return new PageResult<>(page.getContent().stream().map(EventGuestDatabaseMapper::toDomain).toList(), page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
	}
}
