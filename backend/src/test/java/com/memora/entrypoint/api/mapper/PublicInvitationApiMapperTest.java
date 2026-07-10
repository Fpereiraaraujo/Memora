package com.memora.entrypoint.api.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.core.domain.model.PublicInvitation;
import com.memora.dataprovider.storage.FileStorageService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PublicInvitationApiMapperTest {

    @Mock private FileStorageService fileStorageService;

    @Test
    void resolvesTheConfiguredCoverImageToItsPublicUrl() {
        String objectKey = "events/isadora-fernando/public-page/cover.jpg";
        when(fileStorageService.resolvePublicUrl(objectKey)).thenReturn("https://cdn.memora.api.br/cover.jpg");

        var response = new PublicInvitationApiMapper(fileStorageService).toResponse(invitation(objectKey));

        assertThat(response.coverImageUrl()).isEqualTo("https://cdn.memora.api.br/cover.jpg");
        assertThat(response.guestName()).isEqualTo("Fernando");
    }

    private PublicInvitation invitation(String coverImageKey) {
        return PublicInvitation.builder()
            .eventTitle("Isadora & Fernando")
            .eventDate(LocalDate.of(2026, 10, 8))
            .location("Campo Largo")
            .welcomeMessage("Estamos felizes em celebrar este momento.")
            .coverImageKey(coverImageKey)
            .theme("ROMANCE")
            .rsvpEnabled(true)
            .guest(EventGuest.builder()
                .id(UUID.randomUUID())
                .eventId(UUID.randomUUID())
                .invitationToken("token")
                .name("Fernando")
                .maxPlusOnes(1)
                .rsvpStatus(GuestRsvpStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build())
            .build();
    }
}
