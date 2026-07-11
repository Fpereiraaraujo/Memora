package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.CouponStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Locale;
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
@Table(name = "coupons")
public class CouponJpaEntity {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true, length = 80)
	private String code;

	@Column(name = "influencer_id")
	private UUID influencerId;

	@Column(name = "discount_percent", nullable = false)
	private int discountPercent;

	@Column(name = "commission_percent")
	private Integer commissionPercent;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private CouponStatus status;

	@Column(name = "starts_at")
	private LocalDateTime startsAt;

	@Column(name = "expires_at")
	private LocalDateTime expiresAt;

	@Column(name = "max_uses")
	private Integer maxUses;

	@Column(name = "current_uses", nullable = false)
	private int currentUses;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@PrePersist
	@PreUpdate
	void normalizeCode() {
		if (code != null) {
			code = code.trim().toUpperCase(Locale.ROOT);
		}
	}
}
