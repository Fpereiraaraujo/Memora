# Memora Agent Guide

This file is the source of truth for how we structure the Memora backend.
If code and this guide diverge, update the guide together with the code.

## Product Context

Memora is a web platform for collaborative photo capture at events, starting with weddings.
The MVP focuses on:

- host account registration and authentication
- event creation and management
- public event page via slug/QR code
- anonymous guest photo upload
- private host gallery

Guests do not need an account to upload images.

## Current Stack

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- Lombok
- Swagger / OpenAPI
- H2 for tests
- Docker Compose for local PostgreSQL

## Local Architecture

The backend follows a layered clean architecture style with semantic package names.

### Root Packages

- `com.memora.core`
- `com.memora.entrypoint`
- `com.memora.dataprovider`
- `com.memora.config`
- `com.memora.shared`

### Core Layer

`core` holds the business center of the application.

- `core.domain.model`
  - domain entities and value objects
  - examples: `User`, `Event`, `EventStatus`, `EventType`, `PhotoStatus`, `UserRole`
- `core.domain.port`
  - inbound and outbound ports used by use cases
  - examples: `UserRepositoryPort`, `EventRepositoryPort`, `SlugGeneratorPort`, `StorageGatewayPort`
- `core.usecase`
  - use case interfaces
  - examples: `RegisterHostUseCase`, `CreateEventUseCase`
- `core.service`
  - use case implementations
  - one public entry method per use case implementation

### EntryPoint Layer

`entrypoint` exposes the application to the outside world.

- `entrypoint.api.controller.definition`
  - API contracts only
  - endpoint paths, HTTP bindings, request/response signatures, OpenAPI metadata, and validation annotations
  - no records or implementation logic here
- `entrypoint.api.controller`
  - concrete REST controllers
  - orchestrate use cases
- `entrypoint.api.dto`
  - request and response DTOs for HTTP transport
- `entrypoint.api.mapper`
  - API mappers if needed for transport conversion
- `entrypoint.api.exception`
  - API exception handling

### DataProvider Layer

`dataprovider` contains persistence and external integrations.

- `dataprovider.database.entity`
  - JPA entities
- `dataprovider.database.repository`
  - Spring Data repositories
- `dataprovider.database.gateway`
  - adapters that implement core gateway/port interfaces
- `dataprovider.database.mapper`
  - mapping between domain objects and persistence entities

### Config Layer

`config` contains Spring configuration, security, OpenAPI, encoders, and other application beans.

### Shared Layer

`shared` contains simple reusable utilities that do not belong to a business rule.

## Responsibility Rules

- `core` must stay framework-agnostic.
- `entrypoint` handles HTTP, validation, documentation, and transport concerns.
- `dataprovider` handles persistence and external services.
- `config` wires beans and framework configuration.
- `shared` contains pure helpers only.

## Naming Patterns

Use semantic package and class names consistently.

- Domain objects:
  - `User`, `Event`, `Photo`
- Use cases:
  - `RegisterHostUseCase`, `CreateEventUseCase`
- Use case implementations:
  - `RegisterHostService`, `CreateEventService`
- Gateways:
  - `UserGateway`, `StorageGateway`
- Mappers:
  - `UserApiMapper`, `EventApiMapper`
  - persistence mappers should stay in `dataprovider.database.mapper`
- Controllers:
  - `UserControllerApi` for the contract
  - `AuthController` or `EventController` for the implementation
- DTOs:
  - `UserRegisterRequestDto`, `UserRegisterResponseDto`
- JPA entities:
  - `UserEntity`, `EventJpaEntity`

## Controller API Contract Pattern

`*ControllerApi` interfaces are only for:

- endpoint definitions
- method signatures
- OpenAPI / Swagger metadata
- HTTP bindings such as `@RequestBody`, `@RequestHeader`, query params, path params
- validation annotations

They must not contain:

- records used as transport models
- business logic
- persistence logic

Request and response DTOs must live in `entrypoint.api.dto`.

## ArchUnit Rules That Break CI

The following rules are enforced as hard CI blockers.

### 1. Core dependency boundaries

- `core` cannot depend on `entrypoint`, `dataprovider`, or `infra`.
- `entrypoint/api`, `entrypoint/messaging`, `entrypoint/worker`, and `dataprovider` may depend on `core`.

### 2. Infra access restrictions

- `infra` must not be accessed by other layers.
- `core` can only be accessed by `entrypoint/api`, `entrypoint/messaging`, `entrypoint/worker`, `dataprovider`, and `config`.

### 3. Use case structure

- A use case may have at most one public method.
- A use case must not call another use case.

### 4. Service naming rule

- Classes with `Service` in the name must not reference use cases.

### 5. Domain purity

- `domain` must not reference use cases or exceptions.

### 6. Semantic package placement

- `*Domain`, `*UseCase`, `*Exception`, `*Gateway`, and `*Mapper` must live in the expected semantic packages.

### 7. Gateway contract rule

- `*Gateway` must be an interface under `..gateway..`

### 8. General code hygiene

- field injection is prohibited
- `System.out` and `System.err` are prohibited
- generic `throws Exception` is prohibited
- logger fields must be `private static final`

### 9. No unused classes

- Any new class must be referenced, annotated, or configured so ArchUnit does not mark it as unused.

## Implementation Preferences

- Prefer constructor injection.
- Prefer one use case per user story.
- Prefer thin controllers and thin adapters.
- Keep transport DTOs out of the core.
- Keep mappings explicit and local to the boundary layer.
- Avoid overengineering before the MVP validates the main flow.

## Local Development

- PostgreSQL runs locally through Docker Compose.
- The backend currently uses port `5433` for PostgreSQL in the local compose setup.
- Test configuration uses H2.

## Working Rule

When adding or changing code:

1. check the current package boundaries first
2. place classes in the semantic package that matches the role
3. keep controller contracts and DTOs separate
4. verify the change against the ArchUnit rules above

