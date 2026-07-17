package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventQrArtCustomization;
import com.memora.core.domain.param.GetEventQrArtCustomizationParam;
import com.memora.core.usecase.GetEventQrArtCustomizationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventQrArtCustomizationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventQrArtCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventQrArtCustomizationUseCaseImp implements GetEventQrArtCustomizationUseCase {

	private final EventRepository eventRepository;
	private final EventQrArtCustomizationRepository customizationRepository;

	public GetEventQrArtCustomizationUseCaseImp(
		EventRepository eventRepository,
		EventQrArtCustomizationRepository customizationRepository
	) {
		this.eventRepository = eventRepository;
		this.customizationRepository = customizationRepository;
	}

	@Override
	public EventQrArtCustomization execute(GetEventQrArtCustomizationParam param) {
		var event = eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.map(EventDatabaseMapper::toDomain)
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));

		return customizationRepository.findByEventId(param.eventId())
			.map(entity -> EventQrArtCustomizationDatabaseMapper.toDomain(event, entity))
			.orElseGet(() -> EventQrArtCustomizationSupport.createDefault(event));
	}
}
