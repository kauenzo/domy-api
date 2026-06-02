## ADDED Requirements

### Requirement: Configuracao de ambiente

O sistema SHALL carregar configuracao a partir de variaveis de ambiente e fornecer um `.env.example` documentado com todas as chaves obrigatorias para desenvolvimento local.

#### Scenario: Variaveis obrigatorias ausentes

- **WHEN** a aplicacao inicia sem variaveis de ambiente obrigatorias
- **THEN** ela MUST falhar rapidamente com uma mensagem clara sobre chaves ausentes

### Requirement: Conexao com banco via TypeORM

O sistema SHALL definir um DataSource do TypeORM que possa ser usado tanto pela aplicacao NestJS quanto pelo CLI do TypeORM para migrations.

#### Scenario: CLI usa o DataSource

- **WHEN** um comando de migration e executado
- **THEN** ele MUST usar a mesma configuracao de DataSource da aplicacao

### Requirement: Configuracao de JWT

O sistema SHALL centralizar as configuracoes de JWT (segredo e expiracao) em um modulo dedicado para reutilizacao pelos modulos de auth.

#### Scenario: Modulo de auth le a configuracao JWT

- **WHEN** um modulo JWT e inicializado
- **THEN** ele MUST ler segredo e expiracao da configuracao central

### Requirement: Validacao global de DTO

O sistema SHALL habilitar um ValidationPipe global para validar todos os DTOs de entrada.

#### Scenario: Payload de request invalido

- **WHEN** um body falha na validacao de DTO
- **THEN** a API MUST responder com um erro de validacao

### Requirement: Provisionamento local do banco

O sistema SHALL fornecer um setup de Docker Compose para PostgreSQL com porta local e nome de banco previsiveis.

#### Scenario: Inicializacao do banco local

- **WHEN** um desenvolvedor executa `docker-compose up`
- **THEN** o PostgreSQL MUST estar disponivel para a API usando as configuracoes documentadas

### Requirement: Scripts de migration

O sistema SHALL expor scripts npm para gerar, executar e reverter migrations.

#### Scenario: Gerar migration

- **WHEN** um desenvolvedor executa o script de gerar migration
- **THEN** um novo arquivo de migration MUST ser criado com base nas entidades atuais

### Requirement: Base de estrutura do projeto

O sistema SHALL incluir pastas base para `common`, `database`, `modules` e `jobs` dentro de `src/`.

#### Scenario: Criacao de novo modulo

- **WHEN** um desenvolvedor adiciona um novo modulo
- **THEN** o modulo MUST ter um local claro dentro de `src/modules`
