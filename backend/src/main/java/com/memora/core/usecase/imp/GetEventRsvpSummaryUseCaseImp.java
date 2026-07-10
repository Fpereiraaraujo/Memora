package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventRsvpSummary;
import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.core.domain.param.GetEventRsvpSummaryParam;
import com.memora.core.usecase.GetEventRsvpSummaryUseCase;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetEventRsvpSummaryUseCaseImp implements GetEventRsvpSummaryUseCase {
    private final EventRepository eventRepository;
    private final EventGuestRepository guestRepository;

    public GetEventRsvpSummaryUseCaseImp(EventRepository eventRepository, EventGuestRepository guestRepository) {
        this.eventRepository = eventRepository;
        this.guestRepository = guestRepository;
    }

    @Override
    public EventRsvpSummary execute(GetEventRsvpSummaryParam param) {
        eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
            .orElseThrow(() -> new NoSuchElementException("Event not found."));

        var summary = guestRepository.summarizeByEventId(
            param.eventId(),
            GuestRsvpStatus.PENDING,
            GuestRsvpStatus.CONFIRMED,
            GuestRsvpStatus.DECLINED
        );

        return EventRsvpSummary.builder()
            .totalGuests(summary.totalGuests())
            .pendingGuests(summary.pendingGuests())
            .confirmedGuests(summary.confirmedGuests())
            .declinedGuests(summary.declinedGuests())
            .confirmedPeople(summary.confirmedPeople())
            .build();
    }
}
