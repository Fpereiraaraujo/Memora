package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Photo {
	UUID id;
	UUID eventId;
	String originalFilename;
	String objectKey;
	String contentType;
	Long sizeBytes;
	PhotoStatus status;
	boolean favorite;
	int likesCount;
	String guestName;
	String guestMessage;
	UUID uploadGroupId;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
