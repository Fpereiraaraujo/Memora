alter table event_customization
    add column if not exists decorative_image_key varchar(1024);

alter table event_customization
    add column if not exists decorative_image_position varchar(40);
