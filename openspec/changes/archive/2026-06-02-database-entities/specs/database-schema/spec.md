## ADDED Requirements

### Requirement: Convenções base das entidades
O sistema SHALL definir entidades TypeORM em `src/database/entities/` usando uma classe base com `id`, `created_at` e `updated_at`, e SHALL usar uma classe base com `deleted_at` para entidades que exigem soft delete.

#### Scenario: Colunas comuns são mapeadas
- **WHEN** qualquer entidade principal for carregada pelo TypeORM
- **THEN** ela MUST expor `id` como UUID gerado por `@PrimaryGeneratedColumn('uuid')`
- **THEN** ela MUST mapear `createdAt` para `created_at` e `updatedAt` para `updated_at`

#### Scenario: Soft delete usa decorator nativo
- **WHEN** uma entidade com exclusão lógica for declarada
- **THEN** ela MUST mapear `deletedAt` para `deleted_at` usando `@DeleteDateColumn`

#### Scenario: Nomes de banco seguem snake_case
- **WHEN** uma propriedade TypeScript tiver nome em camelCase
- **THEN** a coluna persistida correspondente MUST ser declarada com nome `snake_case`

### Requirement: Entidade de usuários
O sistema SHALL mapear a entidade `User` para a tabela `users` com identidade Google, dados de perfil, papéis, pontuação, streak, nível, status ativo e relacionamentos com os demais registros do usuário.

#### Scenario: Campos de identidade e perfil são persistidos
- **WHEN** um usuário for persistido
- **THEN** a tabela `users` MUST armazenar `google_id`, `name`, `email`, `avatar_url`, `is_active` e timestamps
- **THEN** `google_id` e `email` MUST ser únicos

#### Scenario: Papéis e nível usam enums
- **WHEN** os campos `roles` e `level` forem mapeados
- **THEN** `roles` MUST ser um array de enum com valor padrão `member`
- **THEN** `level` MUST ser um enum com valor padrão `Bronze`

#### Scenario: Dados de gamificação do usuário são armazenados
- **WHEN** o progresso de um usuário for persistido
- **THEN** `points_balance`, `current_streak` e `longest_streak` MUST existir com padrão zero

### Requirement: Entidades de autenticação e convites
O sistema SHALL mapear `RefreshToken` e `Invite` para persistir sessões renováveis e convites de acesso vinculados a usuários.

#### Scenario: Refresh token pertence a usuário
- **WHEN** um refresh token for persistido
- **THEN** a tabela `refresh_tokens` MUST armazenar `user_id`, `token_hash`, `expires_at` e `revoked_at`
- **THEN** `user_id` MUST se relacionar com `users.id`

#### Scenario: Convite registra criador e uso
- **WHEN** um convite for persistido
- **THEN** a tabela `invites` MUST armazenar `token`, `created_by`, `used_by`, `expires_at` e `used_at`
- **THEN** `created_by` MUST se relacionar com o usuário criador
- **THEN** `used_by` MUST permitir nulo e se relacionar com o usuário que utilizou o convite

### Requirement: Entidades de categorias e tags
O sistema SHALL mapear `Category` e `Tag` para classificação reutilizável de templates de tarefas.

#### Scenario: Categoria pode classificar templates
- **WHEN** uma categoria for persistida
- **THEN** a tabela `categories` MUST armazenar `name`, `icon` e `color`
- **THEN** a entidade MUST expor relacionamento com os templates associados

#### Scenario: Tag pode ser associada a templates
- **WHEN** uma tag for persistida
- **THEN** a tabela `tags` MUST armazenar `name` e `color`
- **THEN** `name` MUST ser único

### Requirement: Entidade de templates de tarefas
O sistema SHALL mapear `TaskTemplate` para a tabela `task_templates` com dados descritivos, categoria opcional, responsável, dificuldade, pontos, recorrência, prazo, pausa e relacionamentos.

#### Scenario: Template armazena definição da tarefa
- **WHEN** um template de tarefa for persistido
- **THEN** `task_templates` MUST armazenar `title`, `description`, `cover_image_url`, `category_id`, `assigned_to`, `difficulty`, `base_points`, `points_override`, `deadline_type`, `deadline_value`, `penalty_points`, `is_paused` e `paused_until`

#### Scenario: Recorrência usa enum e JSONB
- **WHEN** os dados de recorrência forem persistidos
- **THEN** `recurrence_type` MUST ser mapeado como enum com valor padrão `none`
- **THEN** `recurrence_config` MUST ser mapeado como `jsonb` e permitir nulo

#### Scenario: Template se relaciona com categoria, usuário, tags e instâncias
- **WHEN** os relacionamentos do template forem carregados
- **THEN** `category_id` MUST permitir nulo e se relacionar com `categories.id`
- **THEN** `assigned_to` MUST se relacionar com `users.id`
- **THEN** a entidade MUST expor as tags associadas e as instâncias geradas

### Requirement: Entidade de associação entre templates e tags
O sistema SHALL mapear a tabela `task_template_tags` como associação entre `task_templates` e `tags`.

#### Scenario: Associação usa chave composta
- **WHEN** uma associação de tag a template for persistida
- **THEN** `task_template_tags` MUST usar `template_id` e `tag_id` como colunas primárias
- **THEN** `template_id` MUST se relacionar com `task_templates.id`
- **THEN** `tag_id` MUST se relacionar com `tags.id`

### Requirement: Entidade de instâncias de tarefas
O sistema SHALL mapear `TaskInstance` para a tabela `task_instances` com agendamento, prazo, status, pontuação, conclusão e overrides de exceção.

#### Scenario: Instância armazena execução da tarefa
- **WHEN** uma instância de tarefa for persistida
- **THEN** `task_instances` MUST armazenar `template_id`, `assigned_to`, `scheduled_date`, `deadline_at`, `status`, `points_earned`, `points_penalty`, `completed_at`, `override_title`, `override_description`, `override_deadline_at` e `is_exception`

#### Scenario: Status da instância é restrito por enum
- **WHEN** o status de uma instância for persistido
- **THEN** `status` MUST aceitar apenas valores do enum de status da tarefa
- **THEN** o valor padrão MUST ser `pending`

#### Scenario: Instância se relaciona com template e responsável
- **WHEN** os relacionamentos da instância forem carregados
- **THEN** `template_id` MUST se relacionar com `task_templates.id`
- **THEN** `assigned_to` MUST se relacionar com `users.id`

### Requirement: Entidade de transações de pontos
O sistema SHALL mapear `PointTransaction` para a tabela `point_transactions` como histórico imutável de créditos e débitos de pontos por usuário.

#### Scenario: Transação registra movimento de pontos
- **WHEN** uma transação de pontos for persistida
- **THEN** `point_transactions` MUST armazenar `user_id`, `amount`, `type`, `reference_id` e `description`
- **THEN** `user_id` MUST se relacionar com `users.id`

#### Scenario: Tipo de transação é restrito por enum
- **WHEN** o tipo de transação for persistido
- **THEN** `type` MUST aceitar apenas os tipos de movimento de pontos definidos pelo sistema

### Requirement: Entidades de recompensas e resgates
O sistema SHALL mapear `Reward` e `Redemption` para persistir recompensas disponíveis e solicitações de resgate revisáveis.

#### Scenario: Recompensa armazena custo e disponibilidade
- **WHEN** uma recompensa for persistida
- **THEN** `rewards` MUST armazenar `title`, `description`, `cover_image_url`, `points_cost`, `stock_limit`, `stock_used`, `cooldown_days` e `is_active`
- **THEN** `stock_used` MUST iniciar em zero
- **THEN** `is_active` MUST iniciar como verdadeiro

#### Scenario: Resgate registra usuário, recompensa e revisão
- **WHEN** um resgate for persistido
- **THEN** `redemptions` MUST armazenar `user_id`, `reward_id`, `points_cost`, `status`, `reviewed_by`, `reviewed_at` e `rejection_reason`
- **THEN** `user_id` MUST se relacionar com `users.id`
- **THEN** `reward_id` MUST se relacionar com `rewards.id`
- **THEN** `reviewed_by` MUST permitir nulo e se relacionar com `users.id`

#### Scenario: Status de resgate é restrito por enum
- **WHEN** o status de um resgate for persistido
- **THEN** `status` MUST aceitar apenas `pending`, `approved` ou `rejected`
- **THEN** o valor padrão MUST ser `pending`

### Requirement: Entidade de notificações
O sistema SHALL mapear `Notification` para a tabela `notifications` com destinatário, tipo, conteúdo, referência opcional e estado de leitura.

#### Scenario: Notificação registra mensagem do usuário
- **WHEN** uma notificação for persistida
- **THEN** `notifications` MUST armazenar `user_id`, `type`, `title`, `body`, `reference_id` e `is_read`
- **THEN** `user_id` MUST se relacionar com `users.id`
- **THEN** `is_read` MUST iniciar como falso

#### Scenario: Tipo de notificação é restrito por enum
- **WHEN** o tipo de notificação for persistido
- **THEN** `type` MUST aceitar apenas os tipos de notificação definidos pelo sistema

### Requirement: Exportação central das entidades
O sistema SHALL fornecer um índice em `src/database/entities/index.ts` para exportar as entidades e enums criados nesta change.

#### Scenario: Módulos importam entidades pelo índice
- **WHEN** outro módulo precisar registrar ou importar entidades
- **THEN** ele MUST conseguir importá-las a partir de `src/database/entities`
