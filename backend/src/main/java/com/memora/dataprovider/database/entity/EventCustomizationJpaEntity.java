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

	@Column(name = "cover_image_key")
	private String coverImageKey;

	@Column(name = "theme")
	private String theme;

	@Column(name = "highlight_image_keys")
	private String highlightImageKeys;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;
}
