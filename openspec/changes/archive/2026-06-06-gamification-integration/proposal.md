## Why

O `GamificationModule` foi implementado como uma engine isolada de cálculos, mas atualmente nenhum outro módulo o consome. O ponto de integração crítico — a conclusão de tarefas pelo membro — ainda não foi implementado (Fase 10 do ROADMAP, `task-instances-module`). Sem essa integração, pontos não são creditados, streaks não evoluem e o nível do usuário nunca muda.

## What Changes

- **Novo**: `TasksModule` (`src/modules/tasks/`) — endpoint de visualização e conclusão de tarefas pelo membro, com cálculo de pontos via `GamificationService`.
- **Novo**: `AdminTaskInstancesModule` — endpoints admin para gerenciar ocorrências avulsas (`/admin/task-instances`).
- **Modificado**: `TasksModule` ao completar uma tarefa (`PATCH /tasks/:id/complete`) deve:
  1. Aplicar `calculateStreakBonus` sobre `effective_points` para obter `points_earned = floor(effective_points × multiplier)`.
  2. Criar `point_transaction` do tipo `task_completion`.
  3. Atualizar `points_balance` do usuário.
  4. Verificar se o usuário concluiu **todas** as tarefas do dia → chamar `incrementStreak` e depois `checkAndUpdateLevel`.
- **Modificado**: `PointsModule` — atualmente não é exportado, logo nenhum outro módulo pode reutilizá-lo. Nenhuma modificação de spec necessária, apenas wiring.

## Capabilities

### New Capabilities
- `task-completion-flow`: Fluxo completo de conclusão de tarefas pelo membro: cálculo de pontos com bônus de streak, criação de `point_transaction`, atualização de saldo, incremento condicional de streak e verificação de level-up.
- `task-instances-crud`: CRUD de instâncias de tarefas — visualização pelo membro (`GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id/start`) e gerenciamento admin (`GET/PATCH/DELETE /admin/task-instances/:id`).

### Modified Capabilities
- `gamification-engine`: A condição de incremento de streak passa a ser definida como: **usuário concluiu todas as tarefas `scheduled_date = hoje` cujo `assigned_to = userId` e nenhuma ficou `pending` ou `in_progress`**. Esse critério precisa estar especificado no spec para que Jobs Cron (Fase 12) e o fluxo de conclusão usem a mesma lógica.

## Impact

- **Novos arquivos**:
  - `src/modules/tasks/tasks.service.ts`
  - `src/modules/tasks/tasks.controller.ts`
  - `src/modules/tasks/tasks.module.ts`
  - `src/modules/tasks/dto/` (DTOs de resposta)
  - `src/modules/admin/tasks/admin-task-instances.service.ts`
  - `src/modules/admin/tasks/admin-task-instances.controller.ts`
  - `src/modules/admin/tasks/admin-task-instances.module.ts`
- **Módulos que passam a importar `GamificationModule`**: `TasksModule`
- **AppModule**: registrar `TasksModule` e `AdminTaskInstancesModule`
- **Endpoints novos**:
  ```
  GET    /tasks                     → tarefas do membro (filtra por ?date=YYYY-MM-DD)
  GET    /tasks/:id                 → detalhe
  PATCH  /tasks/:id/start           → pending → in_progress
  PATCH  /tasks/:id/complete        → done + pontos + streak + level
  GET    /admin/task-instances      → lista instâncias (filtros: data, status, membro)
  GET    /admin/task-instances/:id  → detalhe
  PATCH  /admin/task-instances/:id  → edita ocorrência avulsa (override_*)
  DELETE /admin/task-instances/:id  → soft delete ocorrência
  ```
