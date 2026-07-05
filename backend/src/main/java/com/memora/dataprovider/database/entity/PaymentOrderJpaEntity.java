package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.core.domain.model.PaymentOrderStatus;
import com.memora.core.domain.model.PaymentProvider;
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
@Table(name = "payment_orders")
public class PaymentOrderJpaEntity {

	@Id
	private UUID id;

	@Column(name = "event_id", nullable = false)
	private UUID eventId;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "plan_code", nullable = false)
	private EventPlanCode planCode;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentProvider provider;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentOrderStatus status;

	@Column(name = "order_nsu", nullable = false, unique = true)
	private String orderNsu;

	@Column(name = "checkout_url")
	private String checkoutUrl;

	@Column(name = "provider_transaction_nsu")
	private String providerTransactionNsu;

	@Column(name = "provider_invoice_slug")
	private String providerInvoiceSlug;

	@Column(name = "receipt_url")
	private String receiptUrl;

	@Column(name = "amount_cents", nullable = false)
	private int amountCents;

	@Column(name = "paid_amount_cents")
	private Integer paidAmountCents;

	@Column(name = "paid_at")
	private LocalDateTime paidAt;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
