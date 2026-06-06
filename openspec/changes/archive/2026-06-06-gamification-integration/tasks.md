## 1. TasksModule (membro) — Setup

- [x] 1.1 Criar estrutura de pastas `src/modules/tasks/` e `src/modules/tasks/dto/`
- [x] 1.2 Criar DTOs de resposta: `TaskInstanceResponseDto` (com campos da instância + template + categoria)

## 2. TasksModule (membro) — Service

- [x] 2.1 Criar `tasks.service.ts` e injetar repositórios de `TaskInstance`, `TaskTemplate`, `User`, `PointTransaction` e `GamificationService`
- [x] 2.2 Implementar `findByDate(userId, date)` — retorna instâncias do membro para a data informada (default: hoje)
- [x] 2.3 Implementar `findOne(userId, instanceId)` — retorna instância verificando `assignedToId === userId`, 403 caso contrário
- [x] 2.4 Implementar `start(userId, instanceId)` — transição `pending → in_progress`, valida ownership
- [x] 2.5 Implementar `complete(userId, instanceId)` usando `DataSource.transaction()`:
  - Validar ownership e que `status != done`
  - Calcular `effective_points = template.pointsOverride ?? template.basePoints`
  - Calcular `points_earned = floor(effective_points × gamificationService.calculateStreakBonus(user.currentStreak))`
  - Atualizar instância: `status = done`, `completed_at = now`, `points_earned`
  - Criar `point_transaction` com `type = task_completion`
  - Incrementar `user.points_balance`
  - Verificar se todas as tarefas não-skipped do dia estão `done` → chamar `gamificationService.incrementStreak` e `gamificationService.checkAndUpdateLevel`

## 3. TasksModule (membro) — Controller e Module

- [x] 3.1 Criar `tasks.controller.ts` com as rotas: `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id/start`, `PATCH /tasks/:id/complete`; protegidas por `JwtAuthGuard`
- [x] 3.2 Criar `tasks.module.ts` importando `TypeOrmModule`, `GamificationModule`; exportar `TasksService`
- [x] 3.3 Registrar `TasksModule` no `AppModule`

## 4. AdminTaskInstancesModule — Service

- [x] 4.1 Criar `src/modules/admin/tasks/` e `admin-task-instances.service.ts`
- [x] 4.2 Implementar `list(filters)` — lista paginada de instâncias com filtros `date`, `status`, `userId`
- [x] 4.3 Implementar `findOne(id)` — detalhe com relações de template e usuário
- [x] 4.4 Implementar `update(id, dto)` — edita campos `override_*` e seta `is_exception = true`
- [x] 4.5 Implementar `softDelete(id)` — soft delete da instância

## 5. AdminTaskInstancesModule — Controller, DTOs e Module

- [x] 5.1 Criar DTO `UpdateTaskInstanceDto` (campos `overrideTitle?`, `overrideDescription?`, `overrideDeadlineAt?`)
- [x] 5.2 Criar `admin-task-instances.controller.ts` com rotas: `GET /admin/task-instances`, `GET /admin/task-instances/:id`, `PATCH /admin/task-instances/:id`, `DELETE /admin/task-instances/:id`; protegidas por `JwtAuthGuard` + `RolesGuard` (admin)
- [x] 5.3 Criar `admin-task-instances.module.ts` e registrá-lo no `AppModule`
