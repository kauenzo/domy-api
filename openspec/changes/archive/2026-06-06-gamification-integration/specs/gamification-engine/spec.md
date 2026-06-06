## MODIFIED Requirements

### Requirement: Streak Management
The system MUST provide capabilities to increment the user's current streak (and update longest streak if applicable) and to reset the current streak to 0. **O incremento DEVE ser chamado somente quando todas as `task_instances` do usuário para `scheduled_date = hoje` cujo `status` não seja `skipped` estejam com `status = done`.** Instâncias `skipped` são ignoradas na contagem — apenas `pending` e `in_progress` bloqueiam o incremento.

#### Scenario: Incrementing streak breaks longest streak record
- **WHEN** the user's current streak is incremented to 15 and their longest streak was 14
- **THEN** both the current streak and longest streak are updated to 15 in the user profile

#### Scenario: Resetting streak
- **WHEN** the user's streak is reset
- **THEN** the current streak is updated to 0 and the longest streak remains unchanged

#### Scenario: Streak não incrementa com tarefas pendentes
- **WHEN** o sistema verifica se deve incrementar o streak e ainda existem instâncias com `status in (pending, in_progress)` para o dia
- **THEN** `incrementStreak` NÃO é chamado

#### Scenario: Streak incrementa quando apenas skipped e done restam
- **WHEN** o sistema verifica se deve incrementar o streak e as únicas instâncias do dia têm `status in (done, skipped)`
- **THEN** `incrementStreak` É chamado
