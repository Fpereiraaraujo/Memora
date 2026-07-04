# Memora

Projeto inicial do Memora, uma plataforma web para eventos com upload colaborativo de fotos via QR Code.

## Estrutura

- `backend`: API em Java 21 e Spring Boot 3, organizada com clean architecture.
- `frontend`: aplicação web em React + TypeScript, que será iniciada depois.

## Contexto do MVP

O documento do projeto definiu o Memora como uma solução para casamentos e eventos em que:

- o anfitrião cria um evento;
- um QR Code exclusivo é gerado;
- convidados enviam fotos sem login e sem app;
- o anfitrião vê a galeria privada e gerencia as fotos.

## Backend

A base inicial do backend já considera:

- Java 21
- Spring Boot 3
- Lombok
- JPA
- Flyway
- PostgreSQL
- Swagger/OpenAPI
- organização em `domain`, `application`, `entrypoint`, `dataprovider`, `infra`, `config` e `shared`

