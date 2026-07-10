package com.memora.core.domain.param;

public record SubmitGuestRsvpParam(String invitationToken, boolean attending, int plusOnes, String companionName, String mealChoice, String dietaryRestrictions, String guestMessage) { }
