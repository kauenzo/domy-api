## ADDED Requirements

### Requirement: Listagem admin de instâncias de tarefas
O sistema MUST permitir ao admin listar `task_instances` com filtros por data, status e membro, de forma paginada.

#### Scenario: Listar instâncias sem filtros
- **WHEN** o admin faz `GET /admin/task-instances`
- **THEN** o sistema retorna todas as instâncias não soft-deleted, paginadas

#### Scenario: Filtrar instâncias por data e status
- **WHEN** o admin faz `GET /admin/task-instances?date=2026-07-01&status=pending`
- **THEN** o sistema retorna somente instâncias com `scheduled_date = 2026-07-01` e `status = pending`

### Requirement: Detalhe admin de instância
O sistema MUST retornar o detalhe completo de qualquer `task_instance`, independente de a quem está atribuída.

#### Scenario: Buscar detalhe de qualquer instância
- **WHEN** o admin faz `GET /admin/task-instances/:id`
- **THEN** o sistema retorna a instância com relações de template e usuário carregadas

### Requirement: Edição admin de ocorrência avulsa (override)
O sistema MUST permitir ao admin editar campos de override de uma instância específica sem afetar o template ou outras instâncias.

#### Scenario: Editar título de uma ocorrência
- **WHEN** o admin faz `PATCH /admin/task-instances/:id` com `{ "overrideTitle": "Novo título" }`
- **THEN** o sistema atualiza `override_title` e marca `is_exception = true`

### Requirement: Soft delete admin de instância
O sistema MUST permitir ao admin remover logicamente uma instância avulsa sem afetar o template.

#### Scenario: Soft delete de instância
- **WHEN** o admin faz `DELETE /admin/task-instances/:id`
- **THEN** o sistema define `deleted_at = now` na instância (soft delete) sem alterar o template
