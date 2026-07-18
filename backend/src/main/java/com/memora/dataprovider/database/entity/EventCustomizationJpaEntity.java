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
@Table(name = "event_customization")
public class EventCustomizationJpaEntity {

	@Id
	private UUID id;

	@Column(name = "event_id", nullable = false, unique = true)
	private UUID eventId;

	@Column(name = "welcome_message")
	private String welcomeMessage;

	@Column(name = "primary_color")
	private String primaryColor;

	@Column(name = "secondary_color", length = 7)
	private String secondaryColor;

	@Column(name = "accent_color", length = 7)
	private String accentColor;

	@Column(name = "cover_image_key")
	private String coverImageKey;

	@Column(name = "theme")
	private String templateCode;

	@Column(name = "decoration_style", length = 40)
	private String decorationStyle;

	@Column(name = "highlight_image_keys")
	private String highlightImageKeys;

	@Column(name = "decorative_image_key", length = 1024)
	private String decorativeImageKey;

	@Column(name = "decorative_image_position", length = 40)
	private String decorativeImagePosition;

	@Builder.Default
	@Column(name = "public_gallery_enabled", nullable = false)
	private boolean publicGalleryEnabled = true;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
