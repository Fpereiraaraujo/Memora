create table event_qr_art_customizations (
    id uuid primary key,
    event_id uuid not null unique references events(id) on delete cascade,
    title varchar(80) not null,
    subtitle varchar(100),
    call_to_action varchar(120) not null,
    message varchar(180),
    theme_name varchar(80),
    primary_color varchar(7) not null,
    secondary_color varchar(7) not null,
    accent_color varchar(7) not null,
    visual_style varchar(30) not null,
    template_code varchar(40) not null,
    format varchar(30) not null,
    show_memora_branding boolean not null default true,
    show_event_date boolean not null default false,
    show_event_location boolean not null default false,
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_event_qr_art_customizations_event_id
    on event_qr_art_customizations(event_id);
