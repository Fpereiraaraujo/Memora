package com.memora.entrypoint.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AdminAuditLogListItemDto(
	UUID id,
	LocalDateTime createdAt,
	UUID adminUserId,
	String adminEmail,
	String action,
	String targetType,
	UUID targetId,
	String targetEmail,
	String reason,
	String ipAddress
) {
}
