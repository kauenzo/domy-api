## Context

O projeto esta no bootstrap do backend NestJS. Ainda nao ha configuracao centralizada, conexao com banco ou estrutura base para autenticacao e jobs. A fase 0 define a fundacao para as fases seguintes do roadmap.

## Goals / Non-Goals

**Goals:**

- Centralizar configuracao via `@nestjs/config` com `.env`.
- Provisionar PostgreSQL via Docker e conectar via TypeORM.
- Definir base de JWT e validacao global de DTOs.
- Padronizar estrutura de pastas e scripts de migration.

**Non-Goals:**

- Implementar entidades, migrations ou endpoints funcionais.
- Definir regras de negocio de autenticacao ou gamificacao.
- Produzir OpenAPI completo.

## Decisions

- **ConfigModule global**: habilitar `@nestjs/config` global para reduzir boilerplate e permitir validacao de variaveis no bootstrap.
- **TypeORM DataSource exportavel**: criar `database.config.ts` para servir tanto o app quanto o CLI de migrations.
- **JWT config dedicado**: encapsular expiracao e segredo em `jwt.config.ts` para reuso futuro nos modulos de auth.
- **Docker Compose para Postgres**: reduzir friccao local e padronizar ambiente de desenvolvimento.
- **ValidationPipe global**: garantir DTOs consistentes desde o inicio, evitando regressao futura.

## Risks / Trade-offs

- **Variaveis de ambiente incompletas** -> Mitigacao: `.env.example` com todas as chaves obrigatorias.
- **Divergencia entre dev e prod** -> Mitigacao: manter parametros do banco alinhados com Railway e documentar no README.
- **Migrations inconsistentes** -> Mitigacao: adicionar scripts padronizados e validar em um banco limpo.
