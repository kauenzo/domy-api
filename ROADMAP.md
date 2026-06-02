# 🗺️ Roadmap — domy-api

> Sequência de construção do backend NestJS para o app doméstico gamificado.
> Cada etapa é um `openspec change` independente, pronto para `/opsx:propose` + `/opsx:apply`.
> Stack: NestJS 10 · TypeScript strict · TypeORM · PostgreSQL 16 · OAuth Google · JWT

---

## Status geral

| Fase | Nome                          | Status      |
| ---- | ----------------------------- | ----------- |
| 0    | Setup & Infraestrutura        | ✅ Concluído |
| 1    | Banco de dados — Entities     | 🔲 Pendente |
| 2    | Banco de dados — Migrations   | 🔲 Pendente |
| 3    | Configuração & Módulos base   | 🔲 Pendente |
| 4    | Autenticação — Membro         | 🔲 Pendente |
| 5    | Autenticação — Admin          | 🔲 Pendente |
| 6    | Módulo de Convites            | 🔲 Pendente |
| 7    | Módulo de Usuários (admin)    | 🔲 Pendente |
| 8    | Módulo de Categorias & Tags   | 🔲 Pendente |
| 9    | Módulo de Tarefas (admin)     | 🔲 Pendente |
| 10   | Módulo de Tarefas (membro)    | 🔲 Pendente |
| 11   | Gamificação                   | 🔲 Pendente |
| 12   | Jobs Cron                     | 🔲 Pendente |
| 13   | Módulo de Recompensas (admin) | 🔲 Pendente |
| 14   | Módulo de Recompensas (membro)| 🔲 Pendente |
| 15   | Módulo de Resgates            | 🔲 Pendente |
| 16   | Módulo de Pontos              | 🔲 Pendente |
| 17   | Módulo de Notificações        | 🔲 Pendente |
| 18   | Dashboard (admin)             | 🔲 Pendente |
| 19   | Módulo de Perfil (membro)     | 🔲 Pendente |
| 20   | OpenAPI Spec & Swagger        | 🔲 Pendente |
| 21   | Docker & Deploy               | 🔲 Pendente |

---

## Fase 0 — Setup & Infraestrutura

> Fundação do projeto. Tudo que vem depois depende disso.

**Change name:** `setup-infrastructure`

### O que fazer

- [ ] Instalar dependências principais:
  - `@nestjs/config` — variáveis de ambiente
  - `@nestjs/typeorm` + `typeorm` + `pg` — banco de dados
  - `@nestjs/passport` + `passport` + `passport-google-oauth20` — OAuth
  - `@nestjs/jwt` + `passport-jwt` — JWT
  - `@nestjs/schedule` — cron jobs
  - `@nestjs/swagger` — documentação (dev)
  - `class-validator` + `class-transformer` — validação de DTOs
  - `bcrypt` — hash de refresh tokens
  - `uuid` — geração de IDs
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Criar `src/config/database.config.ts` (DataSource TypeORM)
- [ ] Criar `src/config/jwt.config.ts`
- [ ] Configurar `ConfigModule` global em `app.module.ts`
- [ ] Configurar `ValidationPipe` global em `main.ts`
- [ ] Criar `docker-compose.yml` com serviço PostgreSQL
- [ ] Adicionar scripts de migration ao `package.json`
- [ ] Estruturar pastas `src/common/`, `src/database/`, `src/modules/`, `src/jobs/`

### Resultado esperado
API rodando em `localhost:3001` com banco conectado via Docker.

---

## Fase 1 — Banco de dados: Entities

> Modelagem completa do banco. Base para todas as features.

**Change name:** `database-entities`

### O que fazer

Criar uma entity TypeORM por tabela em `src/database/entities/`:

- [ ] `user.entity.ts` — tabela `users` (id, google_id, name, email, avatar_url, roles[], points_balance, current_streak, longest_streak, level, is_active, deleted_at, timestamps)
- [ ] `refresh-token.entity.ts` — tabela `refresh_tokens`
- [ ] `invite.entity.ts` — tabela `invites`
- [ ] `category.entity.ts` — tabela `categories`
- [ ] `tag.entity.ts` — tabela `tags`
- [ ] `task-template.entity.ts` — tabela `task_templates` (inclui recurrence_config JSONB)
- [ ] `task-template-tag.entity.ts` — tabela `task_template_tags` (join table)
- [ ] `task-instance.entity.ts` — tabela `task_instances`
- [ ] `point-transaction.entity.ts` — tabela `point_transactions`
- [ ] `reward.entity.ts` — tabela `rewards`
- [ ] `redemption.entity.ts` — tabela `redemptions`
- [ ] `notification.entity.ts` — tabela `notifications`

### Convenções
- snake_case nas colunas (`@Column({ name: 'snake_case' })`)
- UUIDs como PK (`@PrimaryGeneratedColumn('uuid')`)
- Soft delete via `@DeleteDateColumn()` onde aplicável
- Enums TypeScript para os campos `status`, `type`, `difficulty`, `recurrence_type`, `level`

### Resultado esperado
Todas as entities criadas, tipadas e com relacionamentos corretos.

---

## Fase 2 — Banco de dados: Migrations

> Gera e aplica as migrations iniciais a partir das entities.

**Change name:** `database-migrations`

### O que fazer

- [ ] Configurar `src/config/database.config.ts` como DataSource exportável para o CLI
- [ ] Gerar migration inicial: `npm run migration:generate --name=initial-schema`
- [ ] Revisar e ajustar a migration gerada
- [ ] Rodar `npm run migration:run` e validar o schema no banco
- [ ] Confirmar nomenclatura snake_case em todas as tabelas e colunas

### Resultado esperado
Banco criado com todas as tabelas e relacionamentos corretos.

---

## Fase 3 — Configuração & Módulos base

> Guards, interceptors, decorators e pipes compartilhados.

**Change name:** `common-modules`

### O que fazer

- [ ] `src/common/guards/jwt-auth.guard.ts` — valida JWT em rotas protegidas
- [ ] `src/common/guards/roles.guard.ts` — valida roles via decorator
- [ ] `src/common/guards/admin.guard.ts` — shortcut para role `admin`
- [ ] `src/common/decorators/roles.decorator.ts` — `@Roles('admin')`
- [ ] `src/common/decorators/current-user.decorator.ts` — extrai usuário do request
- [ ] `src/common/interceptors/transform.interceptor.ts` — envelope de resposta padrão (opcional)
- [ ] `src/common/pipes/` — pipes adicionais se necessário
- [ ] Registrar `JwtModule` e `PassportModule` globalmente ou por módulo

### Resultado esperado
Guards e decorators prontos para uso em todos os módulos.

---

## Fase 4 — Autenticação: Membro

> Fluxo OAuth Google + JWT para membros.

**Change name:** `auth-member`

### Endpoints implementados
```
POST /auth/google                 → redireciona para OAuth Google
GET  /auth/google/callback        → processa callback, retorna JWT
POST /auth/refresh                → renova access token
POST /auth/logout                 → revoga refresh token
GET  /auth/me                     → dados do usuário autenticado
```

### O que fazer

- [ ] `src/modules/auth/strategies/google.strategy.ts` (passport-google-oauth20)
- [ ] `src/modules/auth/strategies/jwt.strategy.ts`
- [ ] `src/modules/auth/strategies/jwt-refresh.strategy.ts`
- [ ] `src/modules/auth/auth.service.ts`:
  - `validateOrCreateUser()` — cria usuário se não existir
  - `login()` — gera access token (15min) + refresh token (30d)
  - `refreshTokens()` — valida hash e gera novos tokens
  - `logout()` — revoga refresh token (marca `revoked_at`)
- [ ] `src/modules/auth/auth.controller.ts`
- [ ] `src/modules/auth/auth.module.ts`
- [ ] DTOs: `RefreshTokenDto`, `AuthResponseDto`

### Fluxo de convite integrado
- Se `?invite=:token` presente no callback, validar e vincular o convite ao usuário criado

### Resultado esperado
Autenticação de membro funcionando com Google OAuth.

---

## Fase 5 — Autenticação: Admin

> Fluxo separado de OAuth para admins, com validação de role.

**Change name:** `auth-admin`

### Endpoints implementados
```
POST /admin/auth/google           → redireciona para OAuth Google (admin)
GET  /admin/auth/google/callback  → valida role admin, retorna JWT
POST /admin/auth/refresh
POST /admin/auth/logout
```

### O que fazer

- [ ] `src/modules/admin/auth/strategies/google-admin.strategy.ts` — callback diferente, valida `roles.includes('admin')`
- [ ] `src/modules/admin/auth/admin-auth.service.ts`
- [ ] `src/modules/admin/auth/admin-auth.controller.ts`
- [ ] `src/modules/admin/auth/admin-auth.module.ts`
- [ ] Rejeitar com `403` se usuário não tiver role `admin`

### Resultado esperado
Admins acessam via `/admin/auth/google` com validação de role.

---

## Fase 6 — Módulo de Convites

> Admin gera links de convite; novos membros se cadastram via link.

**Change name:** `invites-module`

### Endpoints implementados
```
POST   /admin/invites             → cria convite (retorna link com token)
GET    /admin/invites             → lista convites (com status)
DELETE /admin/invites/:id         → invalida convite
GET    /invites/:token            → valida token (público, usado pelo frontend)
```

### O que fazer

- [ ] `src/modules/admin/invites/invites.service.ts`:
  - `createInvite()` — gera UUID, define `expires_at = now + 48h`
  - `validateToken()` — verifica se existe, não expirou, não foi usado
  - `useInvite()` — marca `used_by` e `used_at` (chamado no callback do auth)
- [ ] `src/modules/admin/invites/invites.controller.ts`
- [ ] `src/modules/admin/invites/invites.module.ts`
- [ ] DTO: `CreateInviteResponseDto` (retorna o link completo)

### Resultado esperado
Admin pode convidar novos membros via link com prazo de 48h.

---

## Fase 7 — Módulo de Usuários (Admin)

> Admin gerencia membros: lista, edita, desativa, ajusta pontos manualmente.

**Change name:** `admin-users-module`

### Endpoints implementados
```
GET    /admin/users               → lista membros (paginado, filtros)
GET    /admin/users/:id           → detalhes do membro
PATCH  /admin/users/:id           → edita nome, roles, is_active
DELETE /admin/users/:id           → soft delete
PATCH  /admin/users/:id/points    → ajuste manual de pontos
```

### O que fazer

- [ ] `src/modules/admin/users/admin-users.service.ts`
- [ ] `src/modules/admin/users/admin-users.controller.ts`
- [ ] `src/modules/admin/users/admin-users.module.ts`
- [ ] DTOs: `UpdateUserDto`, `AdjustPointsDto`
- [ ] Ajuste de pontos cria `point_transaction` com `type = manual_adjustment`

### Resultado esperado
Admin tem controle total sobre os membros.

---

## Fase 8 — Módulo de Categorias & Tags

> CRUD de categorias e tags para organizar tarefas.

**Change name:** `categories-tags-module`

### Endpoints implementados
```
GET/POST/PATCH/DELETE /admin/categories
GET/POST/PATCH/DELETE /admin/tags
```

### O que fazer

- [ ] `src/modules/admin/categories/` — service, controller, module, DTOs
- [ ] `src/modules/admin/tags/` — service, controller, module, DTOs
- [ ] Soft delete em categorias e tags
- [ ] Validação: não deletar categoria com tarefas ativas vinculadas (ou apenas desvincular)

### Resultado esperado
Admin gerencia categorias e tags livremente.

---

## Fase 9 — Módulo de Tarefas: Templates (Admin)

> Admin cria e gerencia templates de tarefas com recorrência.

**Change name:** `admin-tasks-module`

### Endpoints implementados
```
GET    /admin/tasks               → lista templates (filtros: categoria, tag, membro, status)
POST   /admin/tasks               → cria template
GET    /admin/tasks/:id           → detalhes
PATCH  /admin/tasks/:id           → edita (esta e futuras)
DELETE /admin/tasks/:id           → soft delete (esta e futuras)
PATCH  /admin/tasks/:id/pause     → pausa/retoma recorrência
```

### O que fazer

- [ ] `src/modules/admin/tasks/admin-tasks.service.ts`:
  - `create()` — calcula `base_points` pela fórmula de dificuldade, gera instâncias dos próximos 7 dias
  - `update()` — atualiza template + recria instâncias futuras não concluídas
  - `softDelete()` — soft delete no template + instâncias futuras não concluídas
  - `togglePause()` — alterna `is_paused` / define `paused_until`
- [ ] `src/modules/admin/tasks/admin-tasks.controller.ts`
- [ ] `src/modules/admin/tasks/admin-tasks.module.ts`
- [ ] DTOs: `CreateTaskTemplateDto`, `UpdateTaskTemplateDto`, `PauseTaskDto`
- [ ] Validação de `recurrence_config` JSONB por `recurrence_type`

### Fórmula de pontos
```
easy=10, medium=20, hard=30, epic=50
base_points = points_override ?? difficulty_multiplier * 10
```

### Resultado esperado
Admin cria tarefas recorrentes com toda a configuração necessária.

---

## Fase 10 — Módulo de Tarefas: Instâncias (Admin + Membro)

> Visualização e execução de tarefas pelo membro; gerenciamento de ocorrências pelo admin.

**Change name:** `task-instances-module`

### Endpoints — Admin
```
GET    /admin/task-instances      → lista instâncias (filtros: data, status, membro)
GET    /admin/task-instances/:id  → detalhes
PATCH  /admin/task-instances/:id  → edita só esta ocorrência (override_*)
DELETE /admin/task-instances/:id  → soft delete só esta ocorrência
```

### Endpoints — Membro
```
GET    /tasks                     → tarefas do dia (filtro por ?date=YYYY-MM-DD)
GET    /tasks/:id                 → detalhes
PATCH  /tasks/:id/start           → status: pending → in_progress
PATCH  /tasks/:id/complete        → status: → done + calcula pontos + atualiza saldo
```

### O que fazer

- [ ] `src/modules/tasks/tasks.service.ts` — lógica de conclusão com cálculo de pontos + streak
- [ ] `src/modules/tasks/tasks.controller.ts`
- [ ] `src/modules/tasks/tasks.module.ts`
- [ ] `src/modules/admin/tasks/admin-task-instances.service.ts`
- [ ] Ao completar: calcular `points_earned = floor(effective_points × streak_multiplier)`, criar `point_transaction`, atualizar `points_balance`

### Resultado esperado
Membro consegue ver e completar tarefas do dia. Admin consegue editar ocorrências avulsas.

---

## Fase 11 — Gamificação

> Lógica central de streak, níveis e bônus de pontos.

**Change name:** `gamification-module`

### O que fazer

- [ ] `src/modules/gamification/gamification.service.ts`:
  - `calculateStreakBonus(streak: number): number` — retorna multiplicador (1.0, 1.1, 1.25, 1.5, 2.0)
  - `calculateLevel(totalPoints: number): Level` — Bronze/Prata/Ouro/Diamante
  - `checkAndUpdateLevel(userId: string)` — atualiza `users.level` se subiu de nível, cria notificação `level_up`
  - `incrementStreak(userId: string)` — chamado quando usuário conclui todas as tarefas do dia
  - `resetStreak(userId: string)` — chamado pelo cron noturno
- [ ] `src/modules/gamification/gamification.module.ts`
- [ ] Tabela de streak:
  - 3–6 dias → +10%, 7–13 → +25%, 14–29 → +50%, 30+ → +100%
- [ ] Tabela de níveis:
  - Bronze 0–499, Prata 500–1999, Ouro 2000–4999, Diamante 5000+
  - Calculado sobre **pontos totais ganhos** (apenas transações positivas)

### Resultado esperado
Serviço reutilizável de gamificação pronto para ser chamado por tasks e jobs.

---

## Fase 12 — Jobs Cron

> Automação noturna de instâncias, penalidades e retomada de tasks pausadas.

**Change name:** `cron-jobs`

### O que fazer

- [ ] `src/jobs/generate-instances.job.ts` (cron: `0 1 * * *` — 00:01):
  - Busca todos os templates ativos e não pausados
  - Gera instâncias para o dia seguinte respeitando `recurrence_type` e `recurrence_config`
  - Calcula `deadline_at` com base em `deadline_type` e `deadline_value`
- [ ] `src/jobs/process-overdue.job.ts` (cron: `5 1 * * *` — 00:05):
  - Busca instâncias `pending`/`in_progress` do dia anterior
  - Atualiza `status = overdue`
  - Aplica penalidade (`penalty_points`) como `point_transaction` (amount negativo, saldo não vai abaixo de 0)
  - Verifica se usuário completou todas as tarefas do dia anterior → se não, zera streak
- [ ] `src/jobs/resume-paused-tasks.job.ts` (cron: `10 1 * * *` — 00:10):
  - Busca templates com `paused_until <= now`
  - Define `paused_until = null` (retoma recorrência)
- [ ] `src/jobs/jobs.module.ts` com `@nestjs/schedule`

### Resultado esperado
Processamento automático noturno sem intervenção manual.

---

## Fase 13 — Módulo de Recompensas (Admin)

> Admin gerencia catálogo de recompensas.

**Change name:** `admin-rewards-module`

### Endpoints implementados
```
GET    /admin/rewards
POST   /admin/rewards
GET    /admin/rewards/:id
PATCH  /admin/rewards/:id
DELETE /admin/rewards/:id
```

### O que fazer

- [ ] `src/modules/admin/rewards/` — service, controller, module, DTOs
- [ ] DTOs: `CreateRewardDto`, `UpdateRewardDto`
- [ ] Soft delete em recompensas
- [ ] Campos: title, description, cover_image_url, points_cost, stock_limit, cooldown_days, is_active

### Resultado esperado
Admin controla o catálogo completo de recompensas.

---

## Fase 14 — Módulo de Recompensas (Membro)

> Membro vê a vitrine de recompensas disponíveis e solicita resgates.

**Change name:** `member-rewards-module`

### Endpoints implementados
```
GET    /rewards                   → vitrine (apenas ativas, com estoque disponível)
GET    /rewards/:id
POST   /rewards/:id/redeem        → solicita resgate
```

### O que fazer

- [ ] `src/modules/rewards/rewards.service.ts`
- [ ] `src/modules/rewards/rewards.controller.ts`
- [ ] `src/modules/rewards/rewards.module.ts`
- [ ] Validações no `redeem()`:
  - Saldo suficiente (`points_balance >= points_cost`)
  - Recompensa ativa (`is_active = true`)
  - Estoque disponível (`stock_used < stock_limit` ou `stock_limit = null`)
  - Cooldown: última `redemption` aprovada do mesmo `user_id + reward_id` respeita `cooldown_days`
- [ ] Ao criar `redemption`: status `pending` + debitar pontos imediatamente (`point_transaction type = redemption_debit`)

### Resultado esperado
Membro consegue solicitar resgates com todas as validações aplicadas.

---

## Fase 15 — Módulo de Resgates (Admin + Membro)

> Admin aprova/rejeita resgates; membro acompanha histórico.

**Change name:** `redemptions-module`

### Endpoints — Admin
```
GET    /admin/redemptions         → lista (filtros: status, usuário)
GET    /admin/redemptions/:id
PATCH  /admin/redemptions/:id/approve   → aprova + notifica membro
PATCH  /admin/redemptions/:id/reject    → rejeita + reembolsa + notifica membro
```

### Endpoints — Membro
```
GET    /redemptions               → histórico do membro
GET    /redemptions/:id
```

### O que fazer

- [ ] `src/modules/admin/redemptions/admin-redemptions.service.ts`:
  - `approve()` — status `approved`, incrementa `stock_used`, cria notificação `redemption_approved`
  - `reject()` — status `rejected`, reembolsa pontos (`point_transaction type = redemption_refund`), cria notificação `redemption_rejected`
- [ ] `src/modules/redemptions/redemptions.service.ts` — histórico do membro
- [ ] DTOs: `RejectRedemptionDto` (com `rejection_reason`)

### Resultado esperado
Fluxo completo de resgate: solicitação → aprovação/rejeição → notificação.

---

## Fase 16 — Módulo de Pontos (Membro)

> Membro consulta saldo, streak, nível e histórico de transações.

**Change name:** `points-module`

### Endpoints implementados
```
GET    /points                    → saldo atual + streak + nível
GET    /points/history            → histórico paginado de transações
```

### O que fazer

- [ ] `src/modules/points/points.service.ts`
- [ ] `src/modules/points/points.controller.ts`
- [ ] `src/modules/points/points.module.ts`
- [ ] DTO de resposta: `PointsSummaryDto` (balance, current_streak, longest_streak, level, total_earned)
- [ ] Paginação no histórico: `?page=1&limit=20`

### Resultado esperado
Membro tem visibilidade total sobre seus pontos e progresso.

---

## Fase 17 — Módulo de Notificações (Membro)

> Sistema interno de notificações para eventos de gamificação e resgates.

**Change name:** `notifications-module`

### Endpoints implementados
```
GET    /notifications             → lista (paginado, filtro: is_read)
PATCH  /notifications/:id/read    → marca como lida
PATCH  /notifications/read-all    → marca todas como lidas
GET    /notifications/unread-count → contador para badge no frontend
```

### O que fazer

- [ ] `src/modules/notifications/notifications.service.ts`:
  - `createNotification()` — usado internamente por outros módulos
  - `getUnreadCount()` — retorna número para badge
- [ ] `src/modules/notifications/notifications.controller.ts`
- [ ] `src/modules/notifications/notifications.module.ts`
- [ ] Tipos de notificação: `redemption_approved`, `redemption_rejected`, `task_overdue`, `streak_milestone`, `level_up`, `general`

### Resultado esperado
Membro recebe notificações contextuais sobre eventos do app.

---

## Fase 18 — Dashboard (Admin)

> Métricas e visão geral para o admin.

**Change name:** `admin-dashboard`

### Endpoints implementados
```
GET    /admin/dashboard           → métricas gerais
GET    /admin/dashboard/members/:id → métricas por membro
```

### O que fazer

- [ ] `src/modules/admin/dashboard/dashboard.service.ts`:
  - Total de tarefas do dia (pendentes, concluídas, overdue)
  - Total de resgates pendentes
  - Ranking de membros por pontos
  - Streak atual de cada membro
- [ ] Métricas por membro: pontos totais, streak, nível, tarefas concluídas no período, resgates
- [ ] `src/modules/admin/dashboard/dashboard.controller.ts`

### Resultado esperado
Admin tem visão consolidada do progresso da família/grupo.

---

## Fase 19 — Módulo de Perfil (Membro)

> Membro visualiza e edita seu próprio perfil.

**Change name:** `profile-module`

### Endpoints implementados
```
GET    /profile                   → dados do usuário + stats
PATCH  /profile                   → edita nome, avatar_url
```

### O que fazer

- [ ] `src/modules/users/users.service.ts` (reutilizável)
- [ ] `src/modules/users/users.controller.ts`
- [ ] `src/modules/users/users.module.ts`
- [ ] DTO: `UpdateProfileDto` (name, avatar_url)
- [ ] Stats no GET: points_balance, current_streak, longest_streak, level, total_tasks_completed

### Resultado esperado
Membro gerencia seu próprio perfil.

---

## Fase 20 — OpenAPI Spec & Swagger

> Documentação completa e spec OpenAPI como fonte de verdade.

**Change name:** `openapi-spec`

### O que fazer

- [ ] Anotar todos os controllers com decorators `@nestjs/swagger`:
  - `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`
- [ ] Configurar Swagger UI em `main.ts` (apenas quando `NODE_ENV !== 'production'`)
- [ ] Adicionar `@ApiProperty()` em todos os DTOs
- [ ] Exportar o `openapi.yaml` via script: `nest start --entryFile swagger-gen`
- [ ] Configurar `openspec/config.yaml` com context do projeto

### Resultado esperado
Swagger UI disponível em `/api/docs` em dev. YAML gerado para o frontend consumir.

---

## Fase 21 — Docker & Deploy

> Ambiente de desenvolvimento e configuração de produção.

**Change name:** `docker-deploy`

### O que fazer

- [ ] Revisar/finalizar `docker-compose.yml` (serviços: `db`, `api`)
- [ ] Criar/revisar `Dockerfile` (multi-stage: build + prod)
- [ ] Adicionar script `start:prod` com `migration:run` antes de iniciar
- [ ] Documentar variáveis de ambiente no `README.md`
- [ ] Configurar Railway: variáveis de ambiente, PostgreSQL gerenciado (Supabase)
- [ ] Testar deploy end-to-end

### Resultado esperado
API rodando em produção no Railway com banco no Supabase.

---

## Dependências entre fases

```
Fase 0 (Setup)
  └─► Fase 1 (Entities)
        └─► Fase 2 (Migrations)
              └─► Fase 3 (Common/Guards)
                    ├─► Fase 4 (Auth Membro)
                    │     └─► Fase 6 (Convites)
                    └─► Fase 5 (Auth Admin)
                          ├─► Fase 7 (Users Admin)
                          ├─► Fase 8 (Categorias & Tags)
                          ├─► Fase 9 (Tasks Templates Admin)
                          │     └─► Fase 10 (Task Instances)
                          │           └─► Fase 11 (Gamificação)
                          │                 └─► Fase 12 (Jobs Cron)
                          ├─► Fase 13 (Rewards Admin)
                          │     └─► Fase 14 (Rewards Membro)
                          │           └─► Fase 15 (Resgates)
                          ├─► Fase 16 (Pontos)
                          ├─► Fase 17 (Notificações) ◄─ (usado por: 11, 15)
                          ├─► Fase 18 (Dashboard)
                          └─► Fase 19 (Perfil)
Fase 20 (OpenAPI) ─── após todas as fases de feature
Fase 21 (Docker/Deploy) ─── ao final
```

---

## Como executar cada fase

1. **Propor a mudança:**
   ```
   /opsx:propose <change-name>
   ```
   O agente vai criar `proposal.md`, `design.md` e `tasks.md` em `openspec/changes/<change-name>/`.

2. **Revisar os artefatos** gerados e ajustar se necessário.

3. **Implementar:**
   ```
   /opsx:apply <change-name>
   ```

4. **Validar** rodando a API e conferindo o endpoint no Swagger.

5. **Marcar como done** e passar para a próxima fase.

---

> Criado em: 2026-06-01 | Stack: NestJS 11 · TypeScript 5 · TypeORM · PostgreSQL 16 · OAuth Google · JWT
