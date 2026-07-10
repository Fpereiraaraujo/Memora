package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventInvitation;
import com.memora.core.domain.param.UpdateEventInvitationParam;
import com.memora.core.usecase.UpdateEventInvitationUseCase;
import com.memora.dataprovider.database.mapper.EventInvitationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventInvitationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.shared.EventDatePolicy;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateEventInvitationUseCaseImp implements UpdateEventInvitationUseCase {
    private final EventRepository eventRepository;
    private final EventInvitationRepository invitationRepository;

    public UpdateEventInvitationUseCaseImp(EventRepository eventRepository, EventInvitationRepository invitationRepository) {
        this.eventRepository = eventRepository;
        this.invitationRepository = invitationRepository;
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = "publicEvents", allEntries = true)
    public EventInvitation execute(UpdateEventInvitationParam param) {
        eventRepository.findByIdAndOwnerId(param.eventId(), param.ownerId())
            .orElseThrow(() -> new NoSuchElementException("Evento nao encontrado."));
        validate(param);

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        EventInvitation current = invitationRepository.findByEventId(param.eventId())
            .map(EventInvitationDatabaseMapper::toDomain)
            .orElseGet(() -> EventInvitationSupport.createDefault(param.eventId()));
        EventInvitation updated = current.toBuilder()
            .theme(param.theme().trim().toUpperCase())
            .rsvpEnabled(param.rsvpEnabled())
            .rsvpDeadline(param.rsvpDeadline())
            .ceremonyTime(param.ceremonyTime())
            .receptionTime(param.receptionTime())
            .dressCode(normalize(param.dressCode()))
            .registryUrl(normalize(param.registryUrl()))
            .publishedAt(param.published() ? (current.getPublishedAt() == null ? now : current.getPublishedAt()) : null)
            .updatedAt(now)
            .build();
        return EventInvitationDatabaseMapper.toDomain(invitationRepository.save(EventInvitationDatabaseMapper.toEntity(updated)));
    }

    private void validate(UpdateEventInvitationParam param) {
        if (param.theme() == null || !param.theme().matches("ROMANCE|GARDEN|MODERN")) {
            throw new IllegalArgumentException("Tema de convite invalido.");
        }
        if (param.rsvpDeadline() != null && param.rsvpDeadline().isBefore(EventDatePolicy.today())) {
            throw new IllegalArgumentException("O prazo de RSVP nao pode estar no passado.");
        }
        if (param.registryUrl() != null && !param.registryUrl().isBlank()) {
            try {
                URI uri = URI.create(param.registryUrl());
                if (uri.getScheme() == null || !(uri.getScheme().equals("https") || uri.getScheme().equals("http"))) {
                    throw new IllegalArgumentException();
                }
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException("Informe uma URL de presentes valida.");
            }
        }
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
