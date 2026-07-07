alter table event_customization
    add column if not exists highlight_image_keys text,
    add column if not exists updated_at timestamp;

alter table photos
    alter column original_filename drop not null,
    alter column object_key drop not null,
    alter column content_type drop not null,
    alter column size_bytes drop not null;
