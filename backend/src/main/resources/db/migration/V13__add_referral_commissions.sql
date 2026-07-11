create table if not exists referral_commissions (
	id uuid primary key,
	influencer_id uuid not null references influencers(id),
	coupon_id uuid not null references coupons(id),
	payment_order_id uuid not null unique references payment_orders(id),
	event_id uuid not null references events(id),
	user_id uuid not null references users(id),
	gross_amount_cents integer not null,
	discount_amount_cents integer not null,
	net_amount_cents integer not null,
	commission_percent integer not null,
	commission_amount_cents integer not null,
	status varchar(20) not null,
	created_at timestamp not null,
	updated_at timestamp not null,
	paid_at timestamp,
	constraint chk_referral_commissions_status
		check (status in ('PENDING', 'APPROVED', 'PAYABLE', 'PAID', 'CANCELLED', 'REFUNDED'))
);

create index if not exists idx_referral_commissions_influencer_id
	on referral_commissions(influencer_id);

create index if not exists idx_referral_commissions_coupon_id
	on referral_commissions(coupon_id);

create index if not exists idx_referral_commissions_payment_order_id
	on referral_commissions(payment_order_id);
