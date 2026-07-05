alter table photos
    add column if not exists is_favorite boolean not null default false;

create index if not exists idx_photos_event_id_is_favorite_created_at
on photos(event_id, is_favorite, created_at desc);
