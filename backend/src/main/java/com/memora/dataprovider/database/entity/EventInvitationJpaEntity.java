package com.memora.dataprovider.database.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "event_invitations")
public class EventInvitationJpaEntity {
	@Id private UUID id;
	@Column(name = "event_id", nullable = false, unique = true) private UUID eventId;
	@Column(nullable = false) private String theme;
	@Column(name = "rsvp_enabled", nullable = false) private boolean rsvpEnabled;
	@Column(name = "rsvp_deadline") private LocalDate rsvpDeadline;
	@Column(name = "ceremony_time") private LocalTime ceremonyTime;
	@Column(name = "reception_time") private LocalTime receptionTime;
	@Column(name = "dress_code") private String dressCode;
	@Column(name = "registry_url") private String registryUrl;
	@Column(name = "published_at") private LocalDateTime publishedAt;
	@Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
