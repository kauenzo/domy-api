## ADDED Requirements

### Requirement: CRUD administrativo de recompensas
O sistema SHALL fornecer um módulo administrativo para gerenciar o catálogo de recompensas com listagem, criação, consulta, edição parcial e soft delete.

#### Scenario: Listar recompensas do catálogo
- **WHEN** um admin acessa `GET /admin/rewards`
- **THEN** o sistema MUST retornar a lista de recompensas
- **AND** o sistema MUST excluir registros soft deleted por padrão

#### Scenario: Criar recompensa
- **WHEN** um admin acessa `POST /admin/rewards` com `title`, `description`, `cover_image_url`, `points_cost`, `stock_limit`, `cooldown_days` e `is_active`
- **THEN** o sistema MUST persistir a recompensa com `stock_used = 0`
- **AND** o sistema MUST retornar os dados da recompensa criada

#### Scenario: Consultar recompensa por ID
- **WHEN** um admin acessa `GET /admin/rewards/:id`
- **THEN** o sistema MUST retornar os dados da recompensa correspondente
- **AND** o sistema MUST retornar `404` quando a recompensa não existir

#### Scenario: Atualizar recompensa parcialmente
- **WHEN** um admin acessa `PATCH /admin/rewards/:id`
- **THEN** o sistema MUST permitir atualizar `title`, `description`, `cover_image_url`, `points_cost`, `stock_limit`, `cooldown_days` e `is_active`
- **AND** o sistema MUST persistir apenas os campos enviados
- **AND** o sistema MUST impedir definir `stock_limit` menor que `stock_used` atual

#### Scenario: Excluir recompensa logicamente
- **WHEN** um admin acessa `DELETE /admin/rewards/:id`
- **THEN** o sistema MUST aplicar soft delete ao registro da recompensa
- **AND** o sistema MUST manter resgates relacionados intactos

#### Scenario: Proteger rotas administrativas de recompensas
- **WHEN** qualquer rota de `/admin/rewards` é acessada
- **THEN** o sistema MUST exigir autenticação válida
- **AND** o sistema MUST exigir role `admin`
