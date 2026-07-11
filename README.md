# Memora

Memora e uma plataforma para casamentos e eventos com pagina publica, QR Code para upload colaborativo, checkout por plano e operacao administrativa interna.

## Estrutura

- `backend`: API em Java 21, Spring Boot, JPA, Flyway, PostgreSQL, JWT e integracao com InfinitePay.
- `frontend`: aplicacao React + TypeScript + Vite + Tailwind.
- `agents.md`: guia operacional e arquitetural atualizado do projeto.

## Fluxos principais

- anfitriao cria e administra um evento
- convidados enviam fotos sem login por QR Code ou link publico
- anfitriao acompanha galeria, favoritos, downloads e recados
- checkout ativa planos pagos e libera recursos do evento
- admin interno gerencia clientes, pagamentos, auditoria e parcerias

## Cupons e influencers

O sistema atual possui suporte completo a cupons, afiliadas e comissoes:

- o backend e a fonte da verdade para preco, desconto e valor final
- checkout e preview aceitam `couponCode` opcional
- o valor enviado para a InfinitePay ja vai com desconto aplicado
- o webhook revalida pedido, plano, valor pago e rastreabilidade antes de liberar o evento
- cupons podem gerar comissao para influencers
- a comissao nasce em `APPROVED` e pode ser marcada como `PAID` pelo admin

### Prioridade entre cupom manual e referral link

- se o usuario informar um cupom manual no checkout, ele tem prioridade total
- se nao houver cupom manual, o sistema tenta usar o `referralCode` salvo pelo link `?ref=...`
- o referral fica salvo no frontend por 30 dias
- o frontend apenas exibe o que o backend recalcular e retornar

### Como criar uma influencer

No admin, em `Parcerias`, cadastre:

- nome
- instagram
- e-mail opcional
- chave PIX opcional
- status

Cada influencer recebe tambem um `referralCode` unico, usado em links como `https://memora-site.com.br?ref=THAY`.

### Como criar um cupom

No admin, em `Parcerias`, informe:

- codigo
- influencer opcional
- desconto percentual
- comissao percentual
- datas opcionais de inicio e expiracao
- limite de usos opcional
- status

O codigo e normalizado em uppercase no backend.

### Regra de comissao

- a comissao e calculada sobre o valor liquido efetivamente pago apos desconto
- o valor e armazenado em centavos
- pagamentos aprovados criam rastreabilidade em `payment_orders` e `referral_commissions`
- o admin pode marcar a comissao como paga, registrando `paid_at`

## Validacao e testes

O repositorio ja possui cobertura de backend para:

- autenticacao
- eventos
- uploads
- RSVP
- checkout e webhook
- cupons, referrals e comissoes
- QR Code
- validacao de datas
