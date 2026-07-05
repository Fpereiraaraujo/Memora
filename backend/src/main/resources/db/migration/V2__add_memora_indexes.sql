create index if not exists idx_events_owner_id on events(owner_id);

create unique index if not exists idx_events_slug on events(slug);

create index if not exists idx_photos_event_id_created_at
on photos(event_id, created_at desc);

create index if not exists idx_photos_event_id_status_created_at
on photos(event_id, status, created_at desc);
