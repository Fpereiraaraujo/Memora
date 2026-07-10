package com.memora.entrypoint.api.dto;

import com.memora.core.domain.model.GuestRsvpStatus;
import java.time.LocalDateTime;

public record PublicRsvpResponseDto(GuestRsvpStatus status, int plusOnes, LocalDateTime respondedAt) { }
