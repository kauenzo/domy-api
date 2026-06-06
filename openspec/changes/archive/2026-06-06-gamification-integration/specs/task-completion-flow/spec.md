## ADDED Requirements

### Requirement: Visualização de tarefas do dia
O sistema MUST retornar todas as `task_instances` do membro autenticado para uma data específica. Se o parâmetro `?date` não for informado, usa a data atual (UTC-3).

#### Scenario: Listar tarefas do dia atual
- **WHEN** o membro faz `GET /tasks` sem parâmetro de data
- **THEN** o sistema retorna as instâncias do dia atual (`scheduled_date = today`) atribuídas ao membro

#### Scenario: Listar tarefas de data específica
- **WHEN** o membro faz `GET /tasks?date=2026-07-01`
- **THEN** o sistema retorna somente as instâncias com `scheduled_date = 2026-07-01` atribuídas ao membro

### Requirement: Transição de status para in_progress
O sistema MUST alterar o `status` de `pending` para `in_progress` quando o membro iniciar uma tarefa. A operação DEVE ser idempotente para status já em `in_progress`.

#### Scenario: Iniciar tarefa pendente
- **WHEN** o membro faz `PATCH /tasks/:id/start` em uma instância com `status = pending`
- **THEN** o sistema atualiza `status = in_progress` e retorna a instância atualizada

#### Scenario: Tentar iniciar tarefa de outro membro
- **WHEN** o membro faz `PATCH /tasks/:id/start` em uma instância atribuída a outro usuário
- **THEN** o sistema retorna `403 Forbidden`

### Requirement: Conclusão de tarefa com cálculo de pontos e bônus de streak
O sistema MUST completar uma tarefa calculando os pontos ganhos com o multiplicador de streak atual, registrar a transação de pontos, atualizar o saldo do usuário e, se todas as tarefas do dia estiverem concluídas, incrementar o streak.

#### Scenario: Concluir tarefa sem streak ativo
- **WHEN** o membro faz `PATCH /tasks/:id/complete` e seu `current_streak = 0`
- **THEN** o sistema atualiza `status = done`, define `completed_at = now`, registra `points_earned = floor(effective_points × 1.0)`, cria `point_transaction` com `type = task_completion`, atualiza `points_balance`

#### Scenario: Concluir tarefa com streak de 7 dias (bônus +25%)
- **WHEN** o membro faz `PATCH /tasks/:id/complete` e seu `current_streak = 7`
- **THEN** `points_earned = floor(effective_points × 1.25)` é registrado

#### Scenario: Concluir última tarefa do dia — streak é incrementado
- **WHEN** o membro completa a última tarefa `pending` ou `in_progress` do dia
- **THEN** o sistema chama `incrementStreak` e depois `checkAndUpdateLevel` para o usuário

#### Scenario: Concluir tarefa mas ainda restam outras pendentes — streak não muda
- **WHEN** o membro completa uma tarefa mas ainda existem outras com `status in (pending, in_progress)` para o mesmo dia
- **THEN** o `current_streak` permanece inalterado

#### Scenario: Tentar concluir tarefa já concluída
- **WHEN** o membro faz `PATCH /tasks/:id/complete` em uma instância com `status = done`
- **THEN** o sistema retorna `400 Bad Request`

### Requirement: Detalhe de tarefa
O sistema MUST retornar o detalhe de uma `task_instance` pertencente ao membro autenticado, incluindo dados do template e categoria.

#### Scenario: Buscar detalhe de tarefa própria
- **WHEN** o membro faz `GET /tasks/:id`
- **THEN** o sistema retorna a instância com relações de template carregadas

#### Scenario: Buscar detalhe de tarefa de outro membro
- **WHEN** o membro faz `GET /tasks/:id` para uma instância de outro usuário
- **THEN** o sistema retorna `403 Forbidden`
