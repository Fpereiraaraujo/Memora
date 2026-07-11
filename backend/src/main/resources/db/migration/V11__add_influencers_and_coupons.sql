update plans
set price_cents = case code
	when 'ESSENTIAL' then 5990
	when 'EVENT' then 9990
	when 'PREMIUM' then 14990
	else price_cents
end
where code in ('ESSENTIAL', 'EVENT', 'PREMIUM');

create table if not exists influencers (
	id uuid primary key,
	name varchar(160) not null,
	instagram_handle varchar(120),
	email varchar(180),
	pix_key varchar(180),
	status varchar(20) not null,
	created_at timestamp not null,
	updated_at timestamp not null,
	constraint chk_influencers_status
		check (status in ('ACTIVE', 'INACTIVE'))
);

create table if not exists coupons (
	id uuid primary key,
	code varchar(80) not null,
	influencer_id uuid references influencers(id),
	discount_percent integer not null,
	commission_percent integer,
	status varchar(20) not null,
	starts_at timestamp,
	expires_at timestamp,
	max_uses integer,
	current_uses integer not null default 0,
	created_at timestamp not null,
	updated_at timestamp not null,
	constraint uq_coupons_code unique (code),
	constraint chk_coupons_discount_percent
		check (discount_percent > 0 and discount_percent <= 50),
	constraint chk_coupons_commission_percent
		check (commission_percent is null or (commission_percent >= 0 and commission_percent <= 50)),
	constraint chk_coupons_status
		check (status in ('ACTIVE', 'INACTIVE', 'EXPIRED')),
	constraint chk_coupons_usage_bounds
		check (current_uses >= 0 and (max_uses is null or max_uses >= 0))
);

create index if not exists idx_coupons_influencer_id
	on coupons(influencer_id);
