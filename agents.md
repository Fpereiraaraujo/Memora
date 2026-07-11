# Memora Agent Guide

Este documento e a fonte de verdade para trabalhar no projeto Memora.
Ele precisa refletir o codigo real do repositorio, nao uma arquitetura idealizada.

Se o codigo mudar de forma estrutural, atualize este arquivo no mesmo trabalho.

## 1. Visao do produto

Memora e uma plataforma para eventos, hoje focada principalmente em casamentos.

O sistema atualmente cobre:

- cadastro e autenticacao de anfitrioes
- painel administrativo interno
- criacao e gerenciamento de um evento principal por conta
- pagina publica do evento por slug
- QR Code e link de upload para convidados
- upload publico de fotos e recados
- galeria privada do anfitriao
- curtidas publicas em fotos
- personalizacao da pagina publica
- convite digital individual com RSVP
- checkout e ativacao de plano via InfinitePay
- armazenamento de arquivos em S3 ou disco local

## 2. Estrutura do repositorio

Raiz do workspace:

- `backend`
- `frontend`

Arquivos relevantes na raiz:

- `agents.md`
- `README.md`
- `.gitignore`

## 3. Stack atual

### Backend

- Java 21
- Spring Boot 3.5.x
- Spring Web
- Spring Security
- Spring Validation
- Spring Data JPA
- Spring Cache + Caffeine
- PostgreSQL
- Flyway
- JWT
- Springdoc OpenAPI / Swagger
- ZXing para QR Code
- AWS SDK S3
- H2 para testes

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## 4. Estrutura atual do backend

Pacotes raiz do backend:

- `com.memora.config`
- `com.memora.core`
- `com.memora.dataprovider`
- `com.memora.entrypoint`
- `com.memora.shared`

### 4.1 `config`

Contem configuracoes de infraestrutura e framework.

Exemplos reais:

- `SecurityConfig`
- `OpenApiConfig`
- `JwtTokenService`
- `AppProperties`
- `CorsProperties`
- `StorageProperties`
- `InfinitePayProperties`

Regra:

- qualquer bean de infraestrutura, seguranca, propriedades tipadas ou wiring Spring deve ficar aqui

### 4.2 `core`

`core` continua sendo o centro das regras da aplicacao, mas hoje ele esta em um estado hibrido.

Subpacotes reais:

- `core.domain.model`
- `core.domain.param`
- `core.gateway`
- `core.usecase`
- `core.usecase.imp`
- `core.service`

#### `core.domain.model`

Modelos de dominio e enums.

Exemplos:

- `Event`
- `EventCheckoutPreview`
- `Photo`
- `User`
- `Plan`
- `CheckoutPricing`
- `ResolvedEventCheckout`
- `Coupon`
- `Influencer`
- `PaymentOrder`
- `PublicInvitation`
- `EventPublicPageCustomization`
- `EventPlanCode`
- `EventStatus`
- `PhotoStatus`
- `UserRole`

#### `core.domain.param`

Parametros de entrada dos casos de uso.

Padrao atual:

- cada use case recebe um `Param` proprio
- o controller monta o param na borda
- o use case trabalha com dominio, nao com DTO HTTP

Exemplos:

- `CreateEventParam`
- `PreviewEventCheckoutParam`
- `UploadGuestPhotoParam`
- `SubmitGuestRsvpParam`
- `CreateEventCheckoutParam`
- `UpdateEventPublicPageCustomizationParam`

#### `core.usecase`

Interfaces de caso de uso.

Padrao obrigatorio:

- uma interface por caso de uso
- um metodo publico por interface
- assinatura padrao:

```java
public interface NomeUseCase {
    NomeDomain execute(NomeParam param);
}
```

Excecao aceitavel:

- quando o retorno natural nao e um dominio unico, pode retornar `void`, `PageResult<T>` ou outro modelo de dominio

#### `core.usecase.imp`

Implementacoes dos casos de uso.

Padrao atual do projeto:

- classes `*UseCaseImp`
- anotadas com `@Service`
- implementam exatamente uma interface de `core.usecase`
- expoem um unico metodo publico `execute`

Exemplos:

- `CreateEventUseCaseImp`
- `PreviewEventCheckoutUseCaseImp`
- `UploadGuestPhotoUseCaseImp`
- `GetPublicInvitationUseCaseImp`
- `HandleInfinitePayWebhookUseCaseImp`

#### `core.service`

Nao use este pacote para colocar novos controllers, DTOs ou repositories.

Hoje esse pacote guarda servicos de apoio e regras transversais de negocio.

Exemplos reais:

- `EventPlanService`
- `EventFeatureAccessService`
- `CheckoutPricingService`
- `EventCheckoutPricingResolverService`
- `CouponValidationService`
- `AdminManagementService`

Importante:

- `core.service` nao segue o mesmo papel de `core.usecase.imp`
- evite mover casos de uso para esse pacote
- quando a regra e um fluxo acionado por endpoint ou job, prefira `core.usecase`
- quando a regra e um helper de negocio reutilizavel entre casos de uso, `core.service` pode fazer sentido

#### `core.gateway`

Hoje existe apenas o contrato `PaymentGateway`.

Regra daqui para frente:

- novos contratos de integracao externa, quando realmente precisarem nascer como abstracao de dominio, devem morar em `core.gateway`
- nao recrie o antigo padrao `port` neste projeto

### 4.3 `dataprovider`

Contem persistencia e integracoes externas concretas.

Subpacotes reais:

- `dataprovider.database.entity`
- `dataprovider.database.repository`
- `dataprovider.database.mapper`
- `dataprovider.database.gateway`
- `dataprovider.infinitepay`
- `dataprovider.storage`

#### `dataprovider.database.entity`

Entidades JPA.

Exemplos:

- `EventJpaEntity`
- `PhotoJpaEntity`
- `UserEntity`
- `CouponJpaEntity`
- `InfluencerJpaEntity`
- `PlanJpaEntity`
- `PaymentOrderJpaEntity`
- `EventInvitationJpaEntity`
- `EventGuestJpaEntity`
- `AdminAuditLogEntity`

#### `dataprovider.database.repository`

Repositorios Spring Data e projections.

Exemplos:

- `EventRepository`
- `PhotoRepository`
- `UserRepository`
- `CouponRepository`
- `InfluencerRepository`
- `PlanRepository`
- `PaymentOrderRepository`
- `EventGuestRepository`
- `EventInvitationRepository`

#### `dataprovider.database.mapper`

Mapeamento entre entidade e dominio.

Exemplos:

- `EventDatabaseMapper`
- `PhotoDatabaseMapper`
- `PlanDatabaseMapper`
- `CouponDatabaseMapper`
- `InfluencerDatabaseMapper`
- `UserDatabaseMapper`

#### `dataprovider.database.gateway`

Gateways concretos orientados a consulta especializada.

Exemplo atual:

- `AdminQueryGateway`
- `AdminQueryGatewayImpl`

Use este pacote quando:

- a consulta e muito especifica
- ha agregacoes pesadas
- o retorno e orientado a tela administrativa ou relatorio

#### `dataprovider.infinitepay`

Integracao com provedor de pagamento.

Exemplos:

- `InfinitePayCheckoutClient`
- `InfinitePayPaymentGateway`

#### `dataprovider.storage`

Armazenamento de arquivos.

Exemplos:

- `FileStorageService`
- `LocalFileStorageService`
- `S3FileStorageService`

Observacao importante:

- hoje `FileStorageService` esta em `dataprovider.storage`, nao em `core.gateway`
- preserve este padrao existente nos fluxos atuais, a menos que a tarefa seja explicitamente uma refatoracao arquitetural

### 4.4 `entrypoint`

Camada HTTP.

Subpacotes reais:

- `entrypoint.api.auth`
- `entrypoint.api.controller`
- `entrypoint.api.controller.definition`
- `entrypoint.api.dto`
- `entrypoint.api.exception`
- `entrypoint.api.filter`
- `entrypoint.api.mapper`

#### `entrypoint.api.controller.definition`

Interfaces de contrato HTTP.

Responsabilidades:

- rotas
- anotacoes OpenAPI
- assinatura dos metodos
- bindings HTTP
- validacao de entrada no nivel de DTO

Nao colocar:

- logica de negocio
- implementacao
- acesso a repository

#### `entrypoint.api.controller`

Implementacoes REST concretas.

Exemplos:

- `AuthController`
- `EventController`
- `PublicEventController`
- `PaymentController`
- `AdminController`
- `HealthController`
- `DevPaymentController`

Responsabilidades:

- receber DTO
- montar `Param`
- chamar um unico caso de uso por acao principal
- devolver DTO de resposta

#### `entrypoint.api.dto`

DTOs de request e response.

Exemplos:

- `EventCreateRequestDto`
- `PublicGuestUploadRequestDto`
- `PublicInvitationResponseDto`
- `AdminDashboardResponseDto`
- `UserLoginResponseDto`

#### `entrypoint.api.mapper`

Mapeadores entre dominio e transporte HTTP.

Exemplos:

- `EventApiMapper`
- `PhotoApiMapper`
- `UserApiMapper`
- `PublicInvitationApiMapper`
- `EventPublicPageCustomizationApiMapper`

### 4.5 `shared`

Utilitarios e componentes transversais simples.

Exemplos reais:

- `SlugGenerator`
- `InvitationTokenGenerator`
- `QrCodeGenerator`
- `EventQrCodeService`
- `EventDatePolicy`
- `ImageContentValidator`
- rate limiters publicos

Regra:

- use `shared` apenas para comportamento reutilizavel que nao pertence claramente a `entrypoint`, `dataprovider` ou a um caso de uso especifico

## 5. Realidade arquitetural atual do backend

Este ponto e importante: o projeto nao esta 100% em clean architecture pura.

Hoje existem dois estilos convivendo:

### Estilo ideal desejado

- controller -> use case -> gateway/servico -> mapper -> infraestrutura

### Estilo praticado em varios fluxos

- `core.usecase.imp` injeta diretamente repositories e mappers de `dataprovider`
- `core.usecase.imp` usa anotacoes Spring como `@Service`
- `core.service` possui servicos de negocio reutilizaveis e tambem um servico administrativo grande

Isso significa:

- nao documente o projeto como se ele usasse ports em todos os lugares
- nao invente uma terceira arquitetura dentro do mesmo modulo
- ao adicionar codigo novo, siga o estilo predominante do contexto em que voce esta mexendo

Regra pratica:

- se o fluxo ja usa repositories Spring Data diretamente no use case, mantenha o mesmo padrao naquele contexto
- se o fluxo ja usa um gateway de integracao, preserve o gateway
- so extraia uma camada nova quando houver um ganho claro e a tarefa permitir refatoracao estruturada

## 6. Regras obrigatorias para backend

### 6.1 Casos de uso

- todo fluxo principal novo deve nascer como interface em `core.usecase`
- a implementacao correspondente deve ficar em `core.usecase.imp`
- a implementacao deve ter um unico metodo publico
- um use case nao deve chamar outro use case

### 6.2 Controllers

- controller deve ser fino
- controller nao deve conter regra de negocio
- controller nao deve montar SQL, chamar repository diretamente ou validar regra de dominio
- controller transforma request DTO em `Param` e dominio em response DTO

### 6.3 Dominio

- `core.domain.model` nao deve conhecer DTO HTTP
- `core.domain.model` nao deve conhecer classes de controller
- prefira manter o dominio sem anotacoes de framework

### 6.4 Persistencia

- entidades JPA ficam em `dataprovider.database.entity`
- Spring Data repositories ficam em `dataprovider.database.repository`
- mapeadores entidade <-> dominio ficam em `dataprovider.database.mapper`

### 6.5 Integracoes externas

- clientes HTTP concretos ficam em `dataprovider`
- contratos realmente necessarios podem ficar em `core.gateway`
- implementacoes concretas ficam fora do `core`

### 6.6 QR Code e upload

- QR Code e parte critica do produto
- qualquer mudanca em QR Code, upload publico, likes, limite de fotos ou pagina publica precisa respeitar performance, cache e seguranca

### 6.7 Admin

- tudo que for administracao interna deve manter o isolamento por role `ADMIN`
- auditoria, concessao manual de plano, suspensao e exclusao precisam manter rastreabilidade
- registros financeiros aprovados nao devem ser apagados sem uma decisao explicita de negocio

## 7. Estrutura atual do frontend

O frontend segue um estilo feature-first com componentes compartilhados.

Pastas principais em `frontend/src`:

- `components`
- `features`
- `lib`
- `styles`
- `types`

### 7.1 `components`

Componentes compartilhados do app inteiro.

Subgrupos reais:

- `components/brand`
- `components/layout`
- `components/theme`
- `components/ui`

Exemplos:

- `MemoraLogo`
- `AppShell`
- `TopBrandHeader`
- `FloralStage`
- `Button`
- `Card`
- `Pagination`

### 7.2 `features`

Cada dominio de tela fica agrupado por funcionalidade.

Features atuais:

- `admin`
- `auth`
- `dashboard`
- `events`
- `home`
- `public`
- `shared`

Regra:

- codigo especifico de uma feature deve ficar dentro da propria feature
- so mova para `components` ou `lib` quando for realmente compartilhado

### 7.3 `lib`

Infraestrutura do frontend.

Exemplos:

- `api.ts`
- `env.ts`
- `storage.ts`
- `cn.ts`
- `public-assets.ts`

### 7.4 `types`

Tipos compartilhados por dominio.

Exemplos:

- `auth.ts`
- `event.ts`
- `photo.ts`
- `payment.ts`
- `invitation.ts`
- `customization.ts`

## 8. Regras obrigatorias para frontend

- sempre componentizar
- evitar duplicacao visual e logica repetida
- layout mobile-first
- tratar o app como produto prioritariamente acessado no celular
- usar `features/.../components` para componentes de escopo local
- usar `components/ui` apenas para primitives ou blocos realmente compartilhados
- chamadas HTTP centralizadas em `lib/api.ts`
- tipos de request/response centralizados em `types`
- nao espalhar literals de rota por todo lado se ja existir helper em `features/events/utils/event-routes.ts`
- manter coerencia visual com a identidade atual do produto: casamento, tons quentes, creme, dourado, rosa suave, tipografia editorial

## 9. Rotas importantes atuais

### Frontend publico

- `/`
- `/login`
- `/register`
- `/e/:slug`
- `/e/:slug/upload`
- `/i/:token`

### Frontend autenticado

- `/app`
- `/app/events/:eventId`
- `/app/events/:eventId/checkout`
- `/app/events/:eventId/public-page`
- `/app/events/:eventId/invitation`
- `/app/events/:eventId/gallery`
- `/app/events/:eventId/qrcode`
- `/app/events/:eventId/favorites`
- `/app/events/:eventId/downloads`
- `/app/events/:eventId/messages`

### Frontend admin

- `/admin`
- `/admin/access-denied`

### Backend HTTP

Os contratos reais estao em:

- `entrypoint.api.controller.definition.EventControllerApi`
- `entrypoint.api.controller.definition.PublicEventControllerApi`
- `entrypoint.api.controller.definition.PaymentControllerApi`
- `entrypoint.api.controller.definition.AdminControllerApi`
- `entrypoint.api.controller.definition.UserControllerApi`

Nao replique manualmente uma lista de endpoints neste arquivo quando os contratos ja existem no codigo.

## 10. Testes atuais

Backend possui testes em:

- `backend/src/test/java/com/memora/core/usecase/imp`
- `backend/src/test/java/com/memora/entrypoint/api/controller`
- `backend/src/test/java/com/memora/entrypoint/api/mapper`
- `backend/src/test/java/com/memora/shared`

Fluxos ja cobertos de forma explicita:

- autenticacao
- eventos
- uploads
- RSVP
- pagamentos
- QR Code
- validacao de datas

Frontend atualmente nao possui uma suite de testes consolidada no repositorio.

## 11. Regras de naming

### Backend

- interface de caso de uso: `NomeUseCase`
- implementacao do caso de uso: `NomeUseCaseImp`
- parametro de entrada: `NomeParam`
- modelo de dominio: `Nome`
- DTO request: `NomeRequestDto`
- DTO response: `NomeResponseDto`
- mapper HTTP: `NomeApiMapper`
- mapper banco: `NomeDatabaseMapper`
- entidade JPA: `NomeJpaEntity` ou `UserEntity`

### Frontend

- paginas: `*-page.tsx`
- componentes locais: nome sem sufixo obrigatorio, dentro da feature certa
- hooks: `use-*` ou `use*`
- utilitarios: `*-utils` ou nomes semanticos por dominio

## 12. O que evitar

- nao recriar camada `port` neste projeto
- nao misturar DTO HTTP dentro do `core.domain`
- nao colocar regra de negocio no controller
- nao criar componentes gigantescos no frontend se a tela puder ser quebrada
- nao duplicar cliente HTTP fora de `lib/api.ts`
- nao inventar um novo design system paralelo
- nao tratar upload, convite, QR Code e checkout como detalhes secundarios; eles sao fluxos centrais do produto

## 13. Desvios conhecidos que o guia assume

Este documento assume explicitamente os seguintes desvios do ideal:

- `core.usecase.imp` hoje depende de classes do `dataprovider` em varios fluxos
- `core.service` contem servicos de apoio de negocio e um servico administrativo maior
- `FileStorageService` esta em `dataprovider.storage`
- o frontend ja e parte essencial do produto e precisa ser considerado nas decisoes arquiteturais

Nao tente "corrigir tudo" no meio de uma feature comum.
Se a tarefa nao for refatoracao arquitetural, preserve o padrao do trecho afetado e melhore localmente com cuidado.

## 14. Checklist de trabalho

Antes de implementar:

1. identifique em qual feature e em qual camada a mudanca realmente cai
2. confirme se ja existe um use case, mapper, helper ou componente que pode ser reaproveitado
3. siga o padrao ja praticado naquele contexto

Ao implementar backend:

1. crie ou reutilize interface em `core.usecase`
2. implemente em `core.usecase.imp`
3. mantenha DTO em `entrypoint.api.dto`
4. mantenha mapeamento explicito
5. respeite seguranca, limites e auditoria quando envolver dados publicos, admin ou pagamento

Ao implementar frontend:

1. componentize
2. mantenha mobile-first
3. centralize request em `lib/api.ts`
4. preserve a identidade visual do produto
5. elimine repeticao e texto redundante

Ao finalizar:

1. valide que o fluxo principal continua funcionando
2. atualize este arquivo se a estrutura mudou
3. prefira deixar o projeto mais coerente do que encontrou
