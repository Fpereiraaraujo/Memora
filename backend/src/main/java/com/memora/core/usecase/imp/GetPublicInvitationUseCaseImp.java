package com.memora.core.usecase.imp;

import com.memora.core.domain.model.PublicInvitation;
import com.memora.core.domain.model.UserStatus;
import com.memora.core.domain.param.GetPublicInvitationParam;
import com.memora.core.usecase.GetPublicInvitationUseCase;
import com.memora.dataprovider.database.mapper.EventDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventGuestDatabaseMapper;
import com.memora.dataprovider.database.mapper.EventInvitationDatabaseMapper;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventInvitationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class GetPublicInvitationUseCaseImp implements GetPublicInvitationUseCase {
    private final EventGuestRepository guestRepository;
    private final EventInvitationRepository invitationRepository;
    private final EventRepository eventRepository;
    private final EventCustomizationRepository customizationRepository;
    private final UserRepository userRepository;

    public GetPublicInvitationUseCaseImp(EventGuestRepository guestRepository, EventInvitationRepository invitationRepository, EventRepository eventRepository, EventCustomizationRepository customizationRepository, UserRepository userRepository) {
        this.guestRepository = guestRepository;
        this.invitationRepository = invitationRepository;
        this.eventRepository = eventRepository;
        this.customizationRepository = customizationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PublicInvitation execute(GetPublicInvitationParam param) {
        var guest = guestRepository.findByInvitationToken(param.invitationToken()).map(EventGuestDatabaseMapper::toDomain).orElseThrow(this::notFound);
        var invitation = invitationRepository.findByEventId(guest.getEventId()).map(EventInvitationDatabaseMapper::toDomain).filter(value -> value.getPublishedAt() != null).orElseThrow(this::notFound);
        var event = eventRepository.findById(guest.getEventId()).map(EventDatabaseMapper::toDomain).orElseThrow(this::notFound);
        boolean ownerActive = userRepository.findById(event.getOwnerId()).map(user -> user.getStatus() == UserStatus.ACTIVE).orElse(false);
        if (!ownerActive) throw notFound();

        var customization = customizationRepository.findByEventId(event.getId()).orElse(null);
        String welcomeMessage = customization == null || customization.getWelcomeMessage() == null || customization.getWelcomeMessage().isBlank()
            ? "Estamos muito felizes em celebrar este momento com voce."
            : customization.getWelcomeMessage();
        String coverImageKey = customization == null ? null : customization.getCoverImageKey();

        return PublicInvitation.builder()
            .eventTitle(event.getTitle())
            .eventDate(event.getEventDate())
            .location(event.getLocation())
            .welcomeMessage(welcomeMessage)
            .coverImageKey(coverImageKey)
            .theme(invitation.getTheme())
            .rsvpEnabled(invitation.isRsvpEnabled())
            .rsvpDeadline(invitation.getRsvpDeadline())
            .ceremonyTime(invitation.getCeremonyTime())
            .receptionTime(invitation.getReceptionTime())
            .dressCode(invitation.getDressCode())
            .registryUrl(invitation.getRegistryUrl())
            .guest(guest)
            .build();
    }

    private NoSuchElementException notFound() {
        return new NoSuchElementException("Convite nao encontrado.");
    }
}
