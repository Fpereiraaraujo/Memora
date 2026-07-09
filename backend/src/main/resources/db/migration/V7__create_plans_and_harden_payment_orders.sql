create table if not exists plans (
	code varchar(40) primary key,
	name varchar(120) not null,
	price_cents integer not null,
	photo_limit integer not null,
	storage_months integer not null,
	active boolean not null default true,
	checkout_url text
);

insert into plans (code, name, price_cents, photo_limit, storage_months, active, checkout_url)
values
	('ESSENTIAL', 'Essencial', 3990, 150, 3, true, 'https://checkout.infinitepay.io/fernando-de-9n6/ezcGIRFPvq'),
	('EVENT', 'Evento', 6990, 500, 6, true, 'https://checkout.infinitepay.io/fernando-de-9n6/DWXgi64sFT'),
	('PREMIUM', 'Premium', 9990, 1500, 12, true, 'https://checkout.infinitepay.io/fernando-de-9n6/qj5cPJEU9w')
on conflict (code) do update
set
	name = excluded.name,
	price_cents = excluded.price_cents,
	photo_limit = excluded.photo_limit,
	storage_months = excluded.storage_months,
	active = excluded.active,
	checkout_url = excluded.checkout_url;

alter table payment_orders
	add column if not exists external_reference varchar(160),
	add column if not exists provider_payment_id varchar(160);

update payment_orders
set external_reference = coalesce(external_reference, order_nsu)
where external_reference is null;

alter table payment_orders
	alter column external_reference set not null;

create unique index if not exists idx_payment_orders_external_reference
	on payment_orders(external_reference);

create index if not exists idx_payment_orders_event_id
	on payment_orders(event_id);

create index if not exists idx_payment_orders_user_id
	on payment_orders(user_id);

create index if not exists idx_payment_orders_status
	on payment_orders(status);

create unique index if not exists idx_events_slug_unique
	on events(slug);

create index if not exists idx_events_owner_id
	on events(owner_id);

create index if not exists idx_photos_event_id_created_at
	on photos(event_id, created_at desc);
