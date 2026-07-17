alter table event_customization
    add column if not exists public_gallery_enabled boolean not null default true;
