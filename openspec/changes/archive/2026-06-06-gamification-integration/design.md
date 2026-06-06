## Context

O `GamificationModule` foi construído como uma engine isolada — expõe `calculateStreakBonus`, `calculateLevel`, `checkAndUpdateLevel`, `incrementStreak` e `resetStreak` — mas nenhum módulo consome esses serviços ainda. O ponto de integração central é o fluxo de conclusão de tarefas pelo membro (`PATCH /tasks/:id/complete`), que deve orquestrar: cálculo de pontos com bônus de streak, criação de `point_transaction`, atualização de saldo, incremento condicional de streak e verificação de level-up.

Esta change também entrega os endpoints de tarefas (Fase 10 do ROADMAP), que são pré-requisito para que a gamificação seja exercitada em runtime.

## Goals / Non-Goals

**Goals:**
- Implementar `TasksModule` (membro) com os 4 endpoints da Fase 10.
- Implementar `AdminTaskInstancesModule` com os 4 endpoints admin de gerenciamento de ocorrências.
- Integrar `GamificationService` dentro do `TasksModule.complete()`:
  - Calcular `effective_points = instance.override_* ?? template.base_points` (com `points_override` prevalecendo).
  - Aplicar `points_earned = floor(effective_points × calculateStreakBonus(user.currentStreak))`.
  - Criar `point_transaction` de tipo `task_completion`, atualizar `points_balance`.
  - Checar se todas as tarefas do dia do usuário estão `done` → chamar `incrementStreak` + `checkAndUpdateLevel`.

**Non-Goals:**
- Não implementar os jobs cron de geração de instâncias, overdue e penalidades (Fase 12).
- Não implementar notificações push (Fase 17) — o `TODO` do `checkAndUpdateLevel` permanece.
- Não implementar `AdminTasksModule` (templates) — já é escopo da Fase 9, não desta change.

## Decisions

- **Transação atômica no `complete()`**: Toda a operação (atualizar instância, criar `point_transaction`, atualizar `points_balance`) deve ocorrer dentro de uma única transação TypeORM via `DataSource.transaction()`. Isso evita inconsistências caso o banco falhe a meio caminho.

- **`effective_points` resolve override em camadas**: A entity `TaskInstance` já possui colunas `override_*`, mas **não** possui `override_points`. A coluna de controle de pontos fica no template (`points_override`). Portanto: `effective_points = instance.pointsOverride ?? template.pointsOverride ?? template.basePoints`. *Nota: `instance` não tem `pointsOverride` atualmente — veremos se é necessário adicionar ou usar apenas o template.*

- **Condição de incremento de streak**: O streak é incrementado quando **todas** as `task_instances` do membro para `scheduled_date = hoje` têm `status = done` após a conclusão atual. Instâncias `skipped` não bloqueiam o streak (são ignoradas — apenas `pending` e `in_progress` bloqueiam).

- **`AdminTaskInstancesModule` como sub-módulo de `admin/tasks/`**: Segue a convenção já usada por outros módulos admin (`admin/redemptions/`, `admin/rewards/`).

- **`TasksModule` importa `GamificationModule`**: Sem dependência circular, pois `GamificationModule` não conhece `TasksModule`.

## Risks / Trade-offs

- **[Risk] Race condition no streak**: Se dois requests de conclusão chegam simultaneamente para o último usuário do dia, ambos podem checar "todas as tarefas concluídas" antes de qualquer um persistir. → **Mitigation**: A transação garante atomicidade para os dados da instância e pontos; o streak pode sofrer double-increment em cenário extremo. Aceito no MVP — mitigável no futuro com row-lock no usuário.

- **[Risk] `TaskInstance` não tem `override_points`**: O campo `pointsOverride` existe apenas no `TaskTemplate`. Caso seja necessário um override por ocorrência (ex: admin quer dar pontos extras numa instância específica), a entity precisaria de nova coluna. → **Mitigation**: Por ora, `effective_points` lê apenas `template.pointsOverride ?? template.basePoints`. Adicionar `override_points` à entity `TaskInstance` está fora de escopo desta change.

## Open Questions

- Instâncias com `status = skipped` devem ser contadas na checagem de "todas concluídas"? **Decisão tomada**: não — apenas `done` conta como concluída; `pending` e `in_progress` bloqueiam o streak.
