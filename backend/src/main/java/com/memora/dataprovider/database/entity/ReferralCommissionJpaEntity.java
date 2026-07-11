package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.ReferralCommissionStatus;
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
@Table(name = "referral_commissions")
public class ReferralCommissionJpaEntity {

	@Id
	private UUID id;

	@Column(name = "influencer_id", nullable = false)
	private UUID influencerId;

	@Column(name = "coupon_id", nullable = false)
	private UUID couponId;

	@Column(name = "payment_order_id", nullable = false, unique = true)
	private UUID paymentOrderId;

	@Column(name = "event_id", nullable = false)
	private UUID eventId;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Column(name = "gross_amount_cents", nullable = false)
	private int grossAmountCents;

	@Column(name = "discount_amount_cents", nullable = false)
	private int discountAmountCents;

	@Column(name = "net_amount_cents", nullable = false)
	private int netAmountCents;

	@Column(name = "commission_percent", nullable = false)
	private int commissionPercent;

	@Column(name = "commission_amount_cents", nullable = false)
	private int commissionAmountCents;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ReferralCommissionStatus status;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Column(name = "paid_at")
	private LocalDateTime paidAt;
}
