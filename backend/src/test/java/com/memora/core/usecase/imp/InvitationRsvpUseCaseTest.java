package com.memora.core.usecase.imp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.core.domain.param.SubmitGuestRsvpParam;
import com.memora.dataprovider.database.entity.EventGuestJpaEntity;
import com.memora.dataprovider.database.entity.EventInvitationJpaEntity;
import com.memora.dataprovider.database.repository.EventGuestRepository;
import com.memora.dataprovider.database.repository.EventInvitationRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class InvitationRsvpUseCaseTest {

    private static final UUID EVENT_ID = UUID.fromString("529205f4-3ed6-4cef-b5dc-b7d640aa4ab1");
    private static final String INVITATION_TOKEN = "unique-invitation-token";

    @Mock private EventGuestRepository guestRepository;
    @Mock private EventInvitationRepository invitationRepository;

    private SubmitGuestRsvpUseCaseImp useCase;

    @BeforeEach
    void setUp() {
        useCase = new SubmitGuestRsvpUseCaseImp(guestRepository, invitationRepository);
    }

    @Test
    void confirmsGuestWithAllowedCompanion() {
        when(guestRepository.findByInvitationToken(INVITATION_TOKEN)).thenReturn(Optional.of(guestEntity(1)));
        when(invitationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(publishedInvitation(null)));
        when(guestRepository.save(any(EventGuestJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var guest = useCase.execute(new SubmitGuestRsvpParam(
            INVITATION_TOKEN, true, 1, "Maria", "Vegetariana", null, "Estaremos lá!"
        ));

        assertThat(guest.getRsvpStatus()).isEqualTo(GuestRsvpStatus.CONFIRMED);
        assertThat(guest.getPlusOnes()).isEqualTo(1);
        assertThat(guest.getCompanionName()).isEqualTo("Maria");
        verify(guestRepository).save(any(EventGuestJpaEntity.class));
    }

    @Test
    void rejectsCompanionAboveTheIndividualLimit() {
        when(guestRepository.findByInvitationToken(INVITATION_TOKEN)).thenReturn(Optional.of(guestEntity(1)));
        when(invitationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(publishedInvitation(null)));

        assertThatThrownBy(() -> useCase.execute(new SubmitGuestRsvpParam(
            INVITATION_TOKEN, true, 2, "Maria", null, null, null
        )))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("acompanhantes");
    }

    @Test
    void rejectsRsvpAfterDeadline() {
        when(guestRepository.findByInvitationToken(INVITATION_TOKEN)).thenReturn(Optional.of(guestEntity(0)));
        when(invitationRepository.findByEventId(EVENT_ID)).thenReturn(Optional.of(publishedInvitation(LocalDate.now().minusDays(1))));

        assertThatThrownBy(() -> useCase.execute(new SubmitGuestRsvpParam(
            INVITATION_TOKEN, true, 0, null, null, null, null
        )))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("prazo");
    }

    private EventGuestJpaEntity guestEntity(int maxPlusOnes) {
        LocalDateTime now = LocalDateTime.now();
        return EventGuestJpaEntity.builder()
            .id(UUID.randomUUID())
            .eventId(EVENT_ID)
            .invitationToken(INVITATION_TOKEN)
            .name("Convidada Memora")
            .maxPlusOnes(maxPlusOnes)
            .rsvpStatus(GuestRsvpStatus.PENDING)
            .plusOnes(0)
            .createdAt(now)
            .updatedAt(now)
            .build();
    }

    private EventInvitationJpaEntity publishedInvitation(LocalDate deadline) {
        return EventInvitationJpaEntity.builder()
            .id(UUID.randomUUID())
            .eventId(EVENT_ID)
            .theme("ROMANCE")
            .rsvpEnabled(true)
            .rsvpDeadline(deadline)
            .publishedAt(LocalDateTime.now().minusDays(1))
            .updatedAt(LocalDateTime.now())
            .build();
    }
}
