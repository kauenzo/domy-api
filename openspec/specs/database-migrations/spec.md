# database-migrations Specification

## Purpose
TBD - created by archiving change database-migrations. Update Purpose after archive.
## Requirements
### Requirement: DataSource compativel com CLI de migrations
O sistema SHALL expor uma configuracao de TypeORM reutilizavel pelo CLI para gerar, executar e reverter migrations com a mesma base usada pela aplicacao.

#### Scenario: CLI usa a mesma configuracao da aplicacao
- **WHEN** um comando de migration e executado
- **THEN** o TypeORM MUST carregar o mesmo DataSource definido para a aplicacao

### Requirement: Migration inicial representa o schema atual
O sistema SHALL manter uma migration inicial versionada que materializa o schema atual definido pelas entities do projeto.

#### Scenario: Banco limpo recebe o schema completo
- **WHEN** a migration inicial e aplicada em um banco PostgreSQL vazio
- **THEN** todas as tabelas, relacionamentos, chaves e restricoes do schema atual MUST ser criadas com sucesso

#### Scenario: Nomes seguem a convencao do projeto
- **WHEN** a migration inicial cria colunas ou tabelas
- **THEN** os nomes persistidos MUST seguir a convencao `snake_case`

### Requirement: Fluxo de aplicacao e reversao de migrations
O sistema SHALL permitir aplicar e reverter migrations iniciais de forma previsivel usando os scripts padronizados do projeto.

#### Scenario: Migration pode ser aplicada
- **WHEN** o desenvolvedor executa o fluxo padronizado de aplicacao de migrations
- **THEN** o schema do banco MUST ser atualizado sem depender de criacao manual de tabelas

#### Scenario: Migration pode ser revertida
- **WHEN** o desenvolvedor executa o fluxo padronizado de reversao de migrations
- **THEN** a ultima migration aplicada MUST ser desfeita

### Requirement: Migration inicial e validada em banco limpo
O sistema SHALL permitir validar o bootstrap do schema em um banco PostgreSQL novo sem erros de dependencias ocultas.

#### Scenario: Bootstrap do schema conclui sem falhas
- **WHEN** a migration inicial e executada em um ambiente novo
- **THEN** o processo MUST concluir sem erro de schema ausente ou dependencia quebrada

