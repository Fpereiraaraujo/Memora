package com.memora.dataprovider.database.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "event_qr_art_customizations")
public class EventQrArtCustomizationJpaEntity {
	@Id
	private UUID id;

	@Column(name = "event_id", nullable = false, unique = true)
	private UUID eventId;

	@Column(nullable = false, length = 80)
	private String title;

	@Column(length = 100)
	private String subtitle;

	@Column(name = "call_to_action", nullable = false, length = 120)
	private String callToAction;

	@Column(length = 180)
	private String message;

	@Column(name = "theme_name", length = 80)
	private String themeName;

	@Column(name = "primary_color", nullable = false, length = 7)
	private String primaryColor;

	@Column(name = "secondary_color", nullable = false, length = 7)
	private String secondaryColor;

	@Column(name = "accent_color", nullable = false, length = 7)
	private String accentColor;

	@Column(name = "visual_style", nullable = false, length = 30)
	private String visualStyle;

	@Column(name = "template_code", nullable = false, length = 40)
	private String templateCode;

	@Column(nullable = false, length = 30)
	private String format;

	@Column(name = "show_memora_branding", nullable = false)
	private boolean showMemoraBranding;

	@Column(name = "show_event_date", nullable = false)
	private boolean showEventDate;

	@Column(name = "show_event_location", nullable = false)
	private boolean showEventLocation;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
