## Why

Implementação inicial da camada de dados (Entities) do domy-api, o backend do app doméstico gamificado. Sendo a primeira etapa do roadmap (Fase 1), ela estabelece a fundação de persistência necessária para que todos os outros módulos (Autenticação, Tarefas, Gamificação, Recompensas, etc.) possam ser construídos. Sem isso, não há onde armazenar e relacionar os dados do sistema.

## What Changes

- Criação de todas as entities principais do banco de dados via TypeORM.
- Configuração de mapeamentos de colunas usando convenção `snake_case`.
- Uso de `UUID` como chave primária em todas as tabelas.
- Implementação de `soft delete` usando a anotação `@DeleteDateColumn()` nas entidades em que se aplica (ex: users, categories, tags, templates, etc.).
- Definição de Enums no TypeScript para campos padronizados (status, tipo, dificuldade, nível).
- Relacionamentos estabelecidos entre as tabelas (users e tasks, templates e instâncias, users e points, etc.).

## Capabilities

### New Capabilities

- `database-schema`: Definição de todas as tabelas e relacionamentos centrais do sistema (usuários, tarefas, pontos, recompensas e notificações) utilizando TypeORM.

### Modified Capabilities

- Nenhuma.

## Impact

- **Banco de Dados / TypeORM**: Impacto direto na criação da estrutura de tabelas.
- **Módulos do Sistema**: Habilitará o desenvolvimento de todos os outros módulos mapeados no ROADMAP.
