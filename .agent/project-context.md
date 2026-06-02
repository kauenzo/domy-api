# domy-api — Contexto do projeto (digest)

> Resumo compacto das fontes de verdade. Atualizar aqui se `back-speck.md` ou `stack-speck.md` mudarem.
> Arquivos completos: `../back-speck.md`, `../stack-speck.md`

---

## Stack

| Item | Decisão |
|---|---|
| Runtime | Node.js 22 LTS |
| Framework | NestJS 10 · TypeScript 5 strict |
| Banco | PostgreSQL 16 · TypeORM · snake_case · UUID PKs · soft delete via `deleted_at` |
| Auth | OAuth Google · JWT (access 15min + refresh 30d armazenado em `refresh_tokens`) |
| Jobs | `@nestjs/schedule` (cron nativo) |
| Validação | `class-validator` + `class-transformer` (DTOs) |
| Pacotes | npm |

---

## Convenções de código

- **Módulos**: um diretório por módulo em `src/modules/` com `service`, `controller`, `module` e `dto/`
- **Entities**: em `src/database/entities/`, uma por tabela, snake_case nas colunas (`@Column({ name: 'snake_case' })`)
- **PKs**: sempre `@PrimaryGeneratedColumn('uuid')`
- **Soft delete**: `@DeleteDateColumn()` onde aplicável
- **Enums**: TypeScript enum para campos `status`, `type`, `difficulty`, `recurrence_type`, `level`
- **Guards**: `JwtAuthGuard`, `RolesGuard`, `AdminGuard` em `src/common/guards/`
- **Decorators**: `@Roles()`, `@CurrentUser()` em `src/common/decorators/`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`)

---

## Estrutura de pastas

```
src/
├── app.module.ts
├── config/           # database.config.ts · jwt.config.ts
├── common/           # guards · decorators · interceptors · pipes
├── database/
│   ├── entities/     # uma entity por tabela
│   └── migrations/
├── modules/
│   ├── auth/         # fluxo membro (Google OAuth + JWT)
│   ├── admin/
│   │   ├── auth/     # fluxo admin (valida role admin)
│   │   ├── tasks/    # templates + instâncias
│   │   ├── categories/
│   │   ├── tags/
│   │   ├── rewards/
│   │   ├── redemptions/
│   │   ├── invites/
│   │   └── dashboard/
│   ├── tasks/        # visualização + execução (membro)
│   ├── rewards/      # vitrine + resgate (membro)
│   ├── points/       # saldo + histórico (membro)
│   ├── notifications/
│   ├── users/        # perfil (membro)
│   └── gamification/ # streak · níveis · bônus
└── jobs/             # generate-instances · process-overdue · resume-paused-tasks
```

---

## Modelo de dados (tabelas e campos-chave)

| Tabela | Campos principais |
|---|---|
| `users` | id, google_id, name, email, avatar_url, roles[], points_balance, current_streak, longest_streak, level, is_active, deleted_at |
| `refresh_tokens` | id, user_id, token_hash, expires_at, revoked_at |
| `invites` | id, token (uuid), created_by, used_by, expires_at (+48h), used_at |
| `categories` | id, name, icon, color, deleted_at |
| `tags` | id, name, color, deleted_at |
| `task_templates` | id, title, description, cover_image_url, category_id, assigned_to, difficulty (easy/medium/hard/epic), base_points, points_override, recurrence_type, recurrence_config (jsonb), deadline_type, deadline_value, penalty_points, is_paused, paused_until, deleted_at |
| `task_template_tags` | template_id, tag_id |
| `task_instances` | id, template_id, assigned_to, scheduled_date, deadline_at, status (pending/in_progress/done/overdue/skipped), points_earned, points_penalty, completed_at, override_*, is_exception, deleted_at |
| `point_transactions` | id, user_id, amount, type (task_completion/streak_bonus/penalty/redemption_debit/redemption_refund/manual_adjustment), reference_id, description |
| `rewards` | id, title, description, cover_image_url, points_cost, stock_limit, stock_used, cooldown_days, is_active, deleted_at |
| `redemptions` | id, user_id, reward_id, points_cost, status (pending/approved/rejected), reviewed_by, reviewed_at, rejection_reason |
| `notifications` | id, user_id, type (redemption_approved/rejected/task_overdue/streak_milestone/level_up/general), title, body, reference_id, is_read |

---

## Regras de negócio essenciais

**Pontos:**
- `base_points = difficulty_multiplier × 10` (easy=1, medium=2, hard=3, epic=5)
- `points_override` substitui o cálculo se preenchido
- `points_earned = floor(effective_points × streak_multiplier)`
- Saldo nunca vai abaixo de 0

**Streak:**
- +1 quando usuário conclui TODAS as tarefas do dia
- Cron 00:05 zera streak se houver tarefas não concluídas no dia anterior
- Multiplicadores: 3–6d=+10%, 7–13d=+25%, 14–29d=+50%, 30+d=+100%

**Níveis:** Bronze (0–499), Prata (500–1999), Ouro (2000–4999), Diamante (5000+)
Calculado sobre pontos totais ganhos (sum de `point_transactions` positivas).

**Resgates:** pontos debitados ao solicitar; reembolsados ao rejeitar.
Validações: saldo suficiente, recompensa ativa, estoque disponível, cooldown.

**Jobs cron:**
- `00:01` — gera instâncias do dia seguinte
- `00:05` — marca overdue, aplica penalidades, atualiza streak
- `00:10` — retoma templates com `paused_until` vencido

**Geração de instâncias:** ao criar template, gera os próximos 7 dias imediatamente.
Editar uma ocorrência → marca `is_exception=true` e preenche `override_*`.
