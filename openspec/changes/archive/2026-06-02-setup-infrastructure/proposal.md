## Why

O backend precisa de uma base de configuracao e infraestrutura para desbloquear todas as fases seguintes do roadmap. Sem isso, nao ha integracao com banco, autenticacao ou jobs.

## What Changes

- Adicionar configuracao centralizada por variaveis de ambiente.
- Configurar TypeORM e conexao com PostgreSQL via Docker.
- Preparar base de JWT para autenticacao.
- Habilitar validacao global de DTOs.
- Padronizar estrutura de pastas e scripts de migration.

## Capabilities

### New Capabilities

- `setup-infrastructure`: Fundacao de configuracao, banco, validacao e scripts base para o backend.

### Modified Capabilities

- (none)

## Impact

- Codigo afetado: `src/app.module.ts`, `src/main.ts`, novos arquivos em `src/config/`.
- Dependencias: NestJS config, TypeORM, Postgres driver, JWT, Passport, schedule, Swagger, class-validator, bcrypt, uuid.
- Infra: docker-compose com PostgreSQL; novos scripts de migration no `package.json`.
