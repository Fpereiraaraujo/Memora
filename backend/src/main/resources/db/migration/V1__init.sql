create table if not exists users (
    id uuid primary key,
    name varchar(120) not null,
    email varchar(180) not null unique,
    password_hash varchar(255) not null,
    role varchar(40) not null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table if not exists events (
    id uuid primary key,
    owner_id uuid not null references users(id),
    type varchar(40) not null,
    title varchar(160) not null,
    slug varchar(180) not null unique,
    event_date date,
    location varchar(180),
    status varchar(40) not null,
    storage_expires_at timestamp,
    created_at timestamp not null,
    updated_at timestamp not null
);

create table if not exists event_customization (
    id uuid primary key,
    event_id uuid not null unique references events(id),
    welcome_message varchar(500),
    primary_color varchar(20),
    cover_image_key varchar(255),
    theme varchar(60)
);

create table if not exists photos (
    id uuid primary key,
    event_id uuid not null references events(id),
    original_filename varchar(255) not null,
    object_key varchar(255) not null unique,
    content_type varchar(120) not null,
    size_bytes bigint not null,
    status varchar(40) not null,
    guest_name varchar(120),
    guest_message varchar(280),
    created_at timestamp not null,
    updated_at timestamp not null
);

