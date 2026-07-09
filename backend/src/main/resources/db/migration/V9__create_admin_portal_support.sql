alter table users
	add column if not exists status varchar(40) not null default 'ACTIVE',
	add column if not exists deleted_at timestamp,
	add column if not exists last_login_at timestamp;

update users
set status = 'ACTIVE'
where status is null;

create table if not exists admin_audit_logs (
	id uuid primary key,
	admin_user_id uuid not null references users(id),
	action varchar(80) not null,
	target_type varchar(80) not null,
	target_id uuid,
	target_email varchar(180),
	reason text,
	metadata jsonb,
	ip_address varchar(120),
	user_agent text,
	created_at timestamp not null
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_users_created_at on users(created_at);
create index if not exists idx_users_status on users(status);
create index if not exists idx_events_status on events(status);
create index if not exists idx_payment_orders_created_at on payment_orders(created_at);
create index if not exists idx_admin_audit_logs_admin_user_id on admin_audit_logs(admin_user_id);
create index if not exists idx_admin_audit_logs_target_id on admin_audit_logs(target_id);
create index if not exists idx_admin_audit_logs_created_at on admin_audit_logs(created_at);
