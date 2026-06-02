## Why

A base de entities ja existe, mas o schema ainda precisa ser materializado no banco de forma reproduzivel. Esta fase garante que o backend consiga gerar e aplicar a migration inicial com seguranca, evitando dependencia de criacao manual de tabelas e reduzindo risco de divergencia entre ambiente local, testes e producao.

## What Changes

- Gerar a migration inicial a partir das entities atuais, criando o schema completo do projeto.
- Revisar a migration gerada para garantir nomes em `snake_case`, chaves `UUID` e relacionamentos corretos.
- Validar a execucao da migration em banco limpo usando o DataSource do TypeORM.
- Confirmar que o fluxo de migrations passa pelo CLI padronizado do projeto.
- Nenhum endpoint publico sera criado nesta fase.

## Capabilities

### New Capabilities
- `database-migrations`: inicializacao e execucao das migrations do schema a partir das entities existentes.

### Modified Capabilities
- Nenhuma.

## Impact

- `src/config/database.config.ts` precisa continuar exposto de forma compativel com o CLI de migrations.
- `src/database/migrations/` passa a conter a migration inicial do schema.
- `package.json` e os scripts de desenvolvimento sao usados para gerar, executar e reverter migrations.
- O banco PostgreSQL passa a ser provisionado pela migration, nao por criacao manual de tabelas.
- Nao ha impacto em rotas HTTP, DTOs ou modulos de dominio nesta fase.
