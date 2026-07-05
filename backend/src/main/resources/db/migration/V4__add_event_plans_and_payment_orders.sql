alter table events
	add column if not exists plan_code varchar(40),
	add column if not exists photo_limit integer,
	add column if not exists paid_at timestamp;

create table if not exists payment_orders (
	id uuid primary key,
	event_id uuid not null references events(id),
	user_id uuid not null references users(id),
	plan_code varchar(40) not null,
	provider varchar(40) not null,
	status varchar(40) not null,
	order_nsu varchar(120) not null unique,
	checkout_url varchar(500),
	provider_transaction_nsu varchar(120),
	provider_invoice_slug varchar(160),
	receipt_url varchar(500),
	amount_cents integer not null,
	paid_amount_cents integer,
	paid_at timestamp,
	created_at timestamp not null,
	updated_at timestamp not null
);

create index if not exists idx_payment_orders_event_id_created_at on payment_orders(event_id, created_at desc);
create index if not exists idx_payment_orders_order_nsu on payment_orders(order_nsu);
