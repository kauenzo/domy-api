## Requirement

O sistema SHALL fornecer um módulo administrativo para gerenciar usuários cadastrados, com listagem paginada, consulta de detalhes, edição de nome, roles e status ativo, soft delete e ajuste manual de pontos com lançamento em histórico.

### Scenario: Listar membros com filtros
- **WHEN** um admin acessa `GET /admin/users`
- **THEN** o sistema MUST retornar uma lista paginada de usuários
- **AND** o sistema SHOULD aceitar filtros por texto, role e status ativo
- **AND** o sistema MUST excluir registros soft deleted por padrão

### Scenario: Consultar detalhes de um membro
- **WHEN** um admin acessa `GET /admin/users/:id`
- **THEN** o sistema MUST retornar os dados do usuário correspondente
- **AND** o sistema MUST retornar `404` quando o usuário não existir

### Scenario: Atualizar dados administrativos do usuário
- **WHEN** um admin acessa `PATCH /admin/users/:id`
- **THEN** o sistema MUST permitir atualizar `name`, `roles` e `is_active`
- **AND** o sistema MUST persistir apenas os campos enviados

### Scenario: Excluir membro logicamente
- **WHEN** um admin acessa `DELETE /admin/users/:id`
- **THEN** o sistema MUST aplicar soft delete ao registro do usuário
- **AND** o sistema MUST manter o histórico relacionado intacto

### Scenario: Ajustar pontos manualmente
- **WHEN** um admin acessa `PATCH /admin/users/:id/points`
- **THEN** o sistema MUST atualizar o `points_balance` do usuário
- **AND** o sistema MUST criar uma `point_transaction` com `type = manual_adjustment`
- **AND** o sistema MUST registrar a descrição informada no ajuste
- **AND** o sistema SHOULD impedir saldo final negativo

### Scenario: Proteger rotas administrativas
- **WHEN** qualquer uma das rotas de administração de usuários é acessada
- **THEN** o sistema MUST exigir autenticação válida
- **AND** o sistema MUST exigir role `admin`
