create table event_invitations (
    id uuid primary key,
    event_id uuid not null unique references events(id),
    theme varchar(40) not null default 'ROMANCE',
    rsvp_enabled boolean not null default true,
    rsvp_deadline date null,
    ceremony_time time null,
    reception_time time null,
    dress_code varchar(255) null,
    registry_url varchar(500) null,
    published_at timestamp null,
    updated_at timestamp not null
);

create table event_guests (
    id uuid primary key,
    event_id uuid not null references events(id),
    invitation_token varchar(64) not null unique,
    name varchar(160) not null,
    phone varchar(40) null,
    email varchar(255) null,
    guest_group varchar(80) null,
    max_plus_ones integer not null default 0,
    rsvp_status varchar(30) not null default 'PENDING',
    plus_ones integer not null default 0,
    companion_name varchar(160) null,
    meal_choice varchar(120) null,
    dietary_restrictions varchar(500) null,
    guest_message varchar(500) null,
    responded_at timestamp null,
    created_at timestamp not null,
    updated_at timestamp not null
);

create index idx_event_guests_event_id on event_guests(event_id);
create index idx_event_guests_event_status on event_guests(event_id, rsvp_status);
create index idx_event_guests_token on event_guests(invitation_token);
create index idx_event_invitations_published on event_invitations(published_at);
