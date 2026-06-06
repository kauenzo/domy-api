# member-rewards-module Specification

## Purpose
TBD - created by archiving change member-rewards-module. Update Purpose after archive.
## Requirements
### Requirement: Vitrine de recompensas para membros
O sistema SHALL expor uma vitrine de recompensas disponíveis para membros autenticados, filtrando apenas recompensas ativas, não excluídas e com estoque disponível.

#### Scenario: Listar vitrine de recompensas
- **WHEN** um membro autenticado acessa `GET /rewards`
- **THEN** o sistema MUST retornar recompensas com `is_active = true`
- **AND** o sistema MUST excluir recompensas soft deleted
- **AND** o sistema MUST excluir recompensas com estoque esgotado (`stock_limit` definido e `stock_used >= stock_limit`)

#### Scenario: Consultar detalhe de recompensa
- **WHEN** um membro autenticado acessa `GET /rewards/:id`
- **THEN** o sistema MUST retornar os dados da recompensa se estiver disponível na vitrine
- **AND** o sistema MUST retornar `404` quando a recompensa não existir ou não estiver disponível

### Requirement: Solicitação de resgate de recompensa
O sistema SHALL permitir que membros autenticados solicitem resgate de recompensas, aplicando validações de saldo, estoque, cooldown e débito imediato de pontos.

#### Scenario: Resgate bem-sucedido
- **WHEN** um membro autenticado acessa `POST /rewards/:id/redeem`
- **AND** possui saldo suficiente (`points_balance >= points_cost`)
- **AND** a recompensa está ativa e com estoque disponível
- **AND** o cooldown desde a última redemption aprovada do mesmo par `user_id + reward_id` foi respeitado
- **THEN** o sistema MUST criar uma `redemption` com `status = pending`
- **AND** o sistema MUST debitar `points_cost` do `points_balance` do usuário
- **AND** o sistema MUST criar uma `point_transaction` com `type = redemption_debit`, `amount` negativo e `reference_id` apontando para a redemption
- **AND** o sistema MUST persistir `points_cost` como snapshot na redemption

#### Scenario: Resgate com saldo insuficiente
- **WHEN** um membro tenta resgatar uma recompensa com `points_balance < points_cost`
- **THEN** o sistema MUST retornar erro indicando saldo insuficiente
- **AND** o sistema MUST NOT criar redemption nem transação de pontos

#### Scenario: Resgate de recompensa indisponível
- **WHEN** um membro tenta resgatar uma recompensa inativa, soft deleted ou sem estoque
- **THEN** o sistema MUST retornar erro indicando recompensa indisponível
- **AND** o sistema MUST NOT debitar pontos

#### Scenario: Resgate dentro do cooldown
- **WHEN** um membro tenta resgatar uma recompensa cujo `cooldown_days` não foi respeitado desde a última redemption aprovada do mesmo par `user_id + reward_id`
- **THEN** o sistema MUST retornar erro indicando cooldown ativo
- **AND** o sistema MUST NOT debitar pontos

#### Scenario: Proteger rotas de recompensas do membro
- **WHEN** qualquer rota de `/rewards` é acessada
- **THEN** o sistema MUST exigir autenticação válida de membro

