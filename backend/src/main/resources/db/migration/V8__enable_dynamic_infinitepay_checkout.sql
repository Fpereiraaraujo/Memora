update plans
set checkout_url = null
where code in ('ESSENTIAL', 'EVENT', 'PREMIUM');
