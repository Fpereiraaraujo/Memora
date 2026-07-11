alter table payment_orders
	add column if not exists original_amount_cents integer,
	add column if not exists discount_amount_cents integer,
	add column if not exists final_amount_cents integer,
	add column if not exists discount_percent integer,
	add column if not exists coupon_id uuid references coupons(id),
	add column if not exists coupon_code varchar(80),
	add column if not exists influencer_id uuid references influencers(id),
	add column if not exists commission_percent integer,
	add column if not exists commission_amount_cents integer;

update payment_orders
set
	original_amount_cents = coalesce(original_amount_cents, amount_cents),
	discount_amount_cents = coalesce(discount_amount_cents, 0),
	final_amount_cents = coalesce(final_amount_cents, amount_cents)
where original_amount_cents is null
	or discount_amount_cents is null
	or final_amount_cents is null;

alter table payment_orders
	alter column original_amount_cents set not null,
	alter column discount_amount_cents set not null,
	alter column final_amount_cents set not null;

create index if not exists idx_payment_orders_coupon_id
	on payment_orders(coupon_id);

create index if not exists idx_payment_orders_influencer_id
	on payment_orders(influencer_id);
