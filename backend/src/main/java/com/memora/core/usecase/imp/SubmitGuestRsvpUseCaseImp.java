package com.memora.core.usecase.imp;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.core.domain.param.SubmitGuestRsvpParam;
import com.memora.core.usecase.SubmitGuestRsvpUseCase;
import com.memora.dataprovider.database.mapper.EventGuestDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventInvitationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventInvitationRepository;
import com.memora.shared.EventDatePolicy;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SubmitGuestRsvpUseCaseImp implements SubmitGuestRsvpUseCase {
    private final EventGuestRepository guestRepository;
    private final EventInvitationRepository invitationRepository;

    public SubmitGuestRsvpUseCaseImp(EventGuestRepository guestRepository, EventInvitationRepository invitationRepository) {
        this.guestRepository = guestRepository;
        this.invitationRepository = invitationRepository;
    }

    @Override
    @Transactional
    public EventGuest execute(SubmitGuestRsvpParam param) {
        EventGuest guest = guestRepository.findByInvitationToken(param.invitationToken())
            .map(EventGuestDatabaseMapper::toDomain)
            .orElseThrow(() -> new NoSuchElementException("Convite nao encontrado."));
        var invitation = invitationRepository.findByEventId(guest.getEventId())
            .map(EventInvitationDatabaseMapper::toDomain)
            .filter(value -> value.getPublishedAt() != null && value.isRsvpEnabled())
            .orElseThrow(() -> new IllegalArgumentException("A confirmacao de presenca nao esta disponivel."));

        if (invitation.getRsvpDeadline() != null && EventDatePolicy.today().isAfter(invitation.getRsvpDeadline())) {
            throw new IllegalArgumentException("O prazo para confirmacao de presenca terminou.");
        }
        if (param.plusOnes() < 0 || param.plusOnes() > guest.getMaxPlusOnes()) {
            throw new IllegalArgumentException("A quantidade de acompanhantes nao e permitida neste convite.");
        }
        if (param.attending() && param.plusOnes() > 0 && (param.companionName() == null || param.companionName().isBlank())) {
            throw new IllegalArgumentException("Informe o nome do acompanhante.");
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        EventGuest updated = guest.toBuilder()
            .rsvpStatus(param.attending() ? GuestRsvpStatus.CONFIRMED : GuestRsvpStatus.DECLINED)
            .plusOnes(param.attending() ? param.plusOnes() : 0)
            .companionName(param.attending() ? normalize(param.companionName()) : null)
            .mealChoice(param.attending() ? normalize(param.mealChoice()) : null)
            .dietaryRestrictions(param.attending() ? normalize(param.dietaryRestrictions()) : null)
            .guestMessage(normalize(param.guestMessage()))
            .respondedAt(now)
            .updatedAt(now)
            .build();
        return EventGuestDatabaseMapper.toDomain(guestRepository.save(EventGuestDatabaseMapper.toEntity(updated)));
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
