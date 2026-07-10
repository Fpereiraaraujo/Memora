package com.memora.core.domain.model;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PublicInvitation {
	String eventTitle;
	LocalDate eventDate;
	String location;
	String welcomeMessage;
	String coverImageKey;
	String theme;
	LocalDate rsvpDeadline;
	LocalTime ceremonyTime;
	LocalTime receptionTime;
	String dressCode;
	String registryUrl;
	boolean rsvpEnabled;
	EventGuest guest;
}
