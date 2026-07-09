package com.memora.dataprovider.database.entity;

import com.memora.core.domain.model.EventPlanCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "plans")
public class PlanJpaEntity {

	@Id
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 40)
	private EventPlanCode code;

	@Column(nullable = false, length = 120)
	private String name;

	@Column(name = "price_cents", nullable = false)
	private int priceCents;

	@Column(name = "photo_limit", nullable = false)
	private int photoLimit;

	@Column(name = "storage_months", nullable = false)
	private int storageMonths;

	@Column(nullable = false)
	private boolean active;

	@Column(name = "checkout_url")
	private String checkoutUrl;
}
