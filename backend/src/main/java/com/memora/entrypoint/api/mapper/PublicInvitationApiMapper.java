package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.PublicInvitation;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.dto.PublicInvitationResponseDto;
import org.springframework.stereotype.Component;

@Component
public class PublicInvitationApiMapper {
    private final FileStorageService fileStorageService;

    public PublicInvitationApiMapper(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    public PublicInvitationResponseDto toResponse(PublicInvitation value) {
        EventGuest guest = value.getGuest();
        return new PublicInvitationResponseDto(
            value.getEventTitle(), value.getEventDate(), value.getLocation(), value.getWelcomeMessage(),
            resolveUrl(value.getCoverImageKey()), value.getTheme(), value.getRsvpDeadline(),
            value.getCeremonyTime(), value.getReceptionTime(), value.getDressCode(), value.getRegistryUrl(),
            value.isRsvpEnabled(), guest.getName(), guest.getMaxPlusOnes(), guest.getRsvpStatus(),
            guest.getPlusOnes(), guest.getCompanionName(), guest.getMealChoice(),
            guest.getDietaryRestrictions(), guest.getGuestMessage()
        );
    }

    private String resolveUrl(String objectKey) {
        return objectKey == null || objectKey.isBlank() ? null : fileStorageService.resolvePublicUrl(objectKey);
    }
}
