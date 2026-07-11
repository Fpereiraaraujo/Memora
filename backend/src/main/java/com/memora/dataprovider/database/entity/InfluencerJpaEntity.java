package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.InfluencerStatus;
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
@Table(name = "influencers")
public class InfluencerJpaEntity {

	@Id
	private UUID id;

	@Column(nullable = false, length = 160)
	private String name;

	@Column(name = "instagram_handle", length = 120)
	private String instagramHandle;

	@Column(name = "referral_code", unique = true, length = 80)
	private String referralCode;

	@Column(length = 180)
	private String email;

	@Column(name = "pix_key", length = 180)
	private String pixKey;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private InfluencerStatus status;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
