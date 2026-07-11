package com.memora.core.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;

@Value
@Builder(toBuilder = true)
public class Influencer {
	UUID id;
	String name;
	String instagramHandle;
	String referralCode;
	String email;
	String pixKey;
	InfluencerStatus status;
	LocalDateTime createdAt;
	LocalDateTime updatedAt;
}
