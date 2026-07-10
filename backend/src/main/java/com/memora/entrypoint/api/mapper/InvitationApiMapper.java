package com.memora.entrypoint.api.mapper;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.model.EventInvitation;
import com.memora.core.domain.model.EventRsvpSummary;
import com.memora.core.domain.model.PublicInvitation;
import com.memora.entrypoint.api.dto.EventGuestResponseDto;
import com.memora.entrypoint.api.dto.EventInvitationResponseDto;
import com.memora.entrypoint.api.dto.EventRsvpSummaryResponseDto;
import com.memora.entrypoint.api.dto.PublicInvitationResponseDto;
import com.memora.entrypoint.api.dto.PublicRsvpResponseDto;

public final class InvitationApiMapper {
	private InvitationApiMapper() { }
	public static EventInvitationResponseDto toResponse(EventInvitation value) { return new EventInvitationResponseDto(value.getTheme(), value.isRsvpEnabled(), value.getRsvpDeadline(), value.getCeremonyTime(), value.getReceptionTime(), value.getDressCode(), value.getRegistryUrl(), value.getPublishedAt(), value.getUpdatedAt()); }
	public static EventGuestResponseDto toResponse(EventGuest value) { return new EventGuestResponseDto(value.getId(), value.getInvitationToken(), value.getName(), value.getPhone(), value.getEmail(), value.getGuestGroup(), value.getMaxPlusOnes(), value.getRsvpStatus(), value.getPlusOnes(), value.getCompanionName(), value.getMealChoice(), value.getDietaryRestrictions(), value.getGuestMessage(), value.getRespondedAt(), value.getCreatedAt()); }
	public static EventRsvpSummaryResponseDto toResponse(EventRsvpSummary value) { return new EventRsvpSummaryResponseDto(value.getTotalGuests(), value.getPendingGuests(), value.getConfirmedGuests(), value.getDeclinedGuests(), value.getConfirmedPeople()); }
	public static PublicInvitationResponseDto toPublicResponse(PublicInvitation value) { EventGuest guest = value.getGuest(); return new PublicInvitationResponseDto(value.getEventTitle(), value.getEventDate(), value.getLocation(), value.getWelcomeMessage(), null, value.getTheme(), value.getRsvpDeadline(), value.getCeremonyTime(), value.getReceptionTime(), value.getDressCode(), value.getRegistryUrl(), value.isRsvpEnabled(), guest.getName(), guest.getMaxPlusOnes(), guest.getRsvpStatus(), guest.getPlusOnes(), guest.getCompanionName(), guest.getMealChoice(), guest.getDietaryRestrictions(), guest.getGuestMessage()); }
	public static PublicRsvpResponseDto toRsvpResponse(EventGuest value) { return new PublicRsvpResponseDto(value.getRsvpStatus(), value.getPlusOnes(), value.getRespondedAt()); }
}
