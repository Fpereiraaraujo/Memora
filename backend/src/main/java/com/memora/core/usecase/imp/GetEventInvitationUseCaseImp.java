package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventInvitation;
import com.memora.core.domain.param.GetEventInvitationParam;
import com.memora.core.usecase.GetEventInvitationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventInvitationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventInvitationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventInvitationUseCaseImp implements GetEventInvitationUseCase {
	private final EventRepository eventRepository;
	private final EventInvitationRepository invitationRepository;

	public GetEventInvitationUseCaseImp(EventRepository eventRepository, EventInvitationRepository invitationRepository) {
		this.eventRepository = eventRepository;
		this.invitationRepository = invitationRepository;
	}

	@Override
	public EventInvitation execute(GetEventInvitationParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));
		return invitationRepository.findByEventId(param.eventId())
			.map(EventInvitationDatabaseMapper::toDomain)
			.orElseGet(() -> EventInvitationSupport.createDefault(param.eventId()));
	}
}
