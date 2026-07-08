package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.PhotoStatus;
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
@Table(name = "photos")
public class PhotoJpaEntity {

	@Id
	private UUID id;

	@Column(name = "event_id", nullable = false)
	private UUID eventId;

	@Column(name = "original_filename")
	private String originalFilename;

	@Column(name = "object_key", unique = true)
	private String objectKey;

	@Column(name = "content_type")
	private String contentType;

	@Column(name = "size_bytes")
	private Long sizeBytes;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PhotoStatus status;

	@Column(name = "is_favorite", nullable = false)
	private boolean favorite;

	@Column(name = "likes_count", nullable = false)
	private int likesCount;

	@Column(name = "guest_name")
	private String guestName;

	@Column(name = "guest_message")
	private String guestMessage;

	@Column(name = "upload_group_id")
	private UUID uploadGroupId;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
