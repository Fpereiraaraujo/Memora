package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.core.domain.param.CreateEventGuestParam;
import com.memora.core.usecase.CreateEventGuestUseCase;
import com.memora.dataprovider.database.mapper.EventGuestDatabaseMapper;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.shared.InvitationTokenGenerator;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateEventGuestUseCaseImp implements CreateEventGuestUseCase {
	private final EventRepository eventRepository;
	private final EventGuestRepository guestRepository;
	private final InvitationTokenGenerator invitationTokenGenerator;

	public CreateEventGuestUseCaseImp(EventRepository eventRepository, EventGuestRepository guestRepository, InvitationTokenGenerator invitationTokenGenerator) {
		this.eventRepository = eventRepository;
		this.guestRepository = guestRepository;
		this.invitationTokenGenerator = invitationTokenGenerator;
	}

	@Override
	@Transactional
	public EventGuest execute(CreateEventGuestParam param) {
		eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
			.orElseThrow(() -> new NoSuchElementException("Evento não encontrado."));
		if (param.name() == null || param.name().isBlank()) throw new IllegalArgumentException("Informe o nome do convidado.");
		if (param.maxPlusOnes() < 0 || param.maxPlusOnes() > 10) throw new IllegalArgumentException("Informe entre 0 e 10 acompanhantes.");
		LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
		EventGuest guest = EventGuest.builder()
			.id(UUID.randomUUID()).eventId(param.eventId()).invitationToken(invitationTokenGenerator.generate())
			.name(param.name().trim()).phone(normalize(param.phone())).email(normalize(param.email())).guestGroup(normalize(param.guestGroup()))
			.maxPlusOnes(param.maxPlusOnes()).rsvpStatus(GuestRsvpStatus.PENDING).plusOnes(0).createdAt(now).updatedAt(now).build();
		return EventGuestDatabaseMapper.toDomain(guestRepository.save(EventGuestDatabaseMapper.toEntity(guest)));
	}

	private String normalize(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
