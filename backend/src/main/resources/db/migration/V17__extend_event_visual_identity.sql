alter table event_customization
    add column if not exists secondary_color varchar(7);

alter table event_customization
    add column if not exists accent_color varchar(7);

alter table event_customization
    add column if not exists decoration_style varchar(40);
