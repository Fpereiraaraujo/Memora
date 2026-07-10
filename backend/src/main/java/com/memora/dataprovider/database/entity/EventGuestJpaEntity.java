package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.GuestRsvpStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
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
@Table(name = "event_guests")
public class EventGuestJpaEntity {
	@Id private UUID id;
	@Column(name = "event_id", nullable = false) private UUID eventId;
	@Column(name = "invitation_token", nullable = false, unique = true) private String invitationToken;
	@Column(nullable = false) private String name;
	private String phone;
	private String email;
	@Column(name = "guest_group") private String guestGroup;
	@Column(name = "max_plus_ones", nullable = false) private int maxPlusOnes;
	@Enumerated(EnumType.STRING) @Column(name = "rsvp_status", nullable = false) private GuestRsvpStatus rsvpStatus;
	@Column(name = "plus_ones", nullable = false) private int plusOnes;
	@Column(name = "companion_name") private String companionName;
	@Column(name = "meal_choice") private String mealChoice;
	@Column(name = "dietary_restrictions") private String dietaryRestrictions;
	@Column(name = "guest_message") private String guestMessage;
	@Column(name = "responded_at") private LocalDateTime respondedAt;
	@Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
	@Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
