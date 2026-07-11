alter table influencers
	add column if not exists referral_code varchar(80);

update influencers
set referral_code = upper(substr(regexp_replace(coalesce(nullif(instagram_handle, ''), name), '[^A-Za-z0-9]', '', 'g'), 1, 24))
where referral_code is null
  and coalesce(nullif(instagram_handle, ''), nullif(name, '')) is not null;

create unique index if not exists idx_influencers_referral_code
	on influencers(referral_code)
	where referral_code is not null;
