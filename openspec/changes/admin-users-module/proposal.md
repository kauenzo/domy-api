## Why

O admin precisa de uma área dedicada para administrar membros da plataforma sem depender das rotinas de autenticação. A fase 7 do roadmap pede controle direto sobre listagem, detalhes, edição, desativação e ajuste manual de pontos, mantendo o histórico financeiro do usuário consistente.

## What Changes

- Adiciona um módulo administrativo de usuários em `/admin/users`.
- Permite listar membros com paginação e filtros básicos.
- Permite consultar detalhes de um membro por ID.
- Permite editar nome, papéis e status ativo.
- Permite soft delete de um membro.
- Permite ajuste manual de pontos com criação de `point_transactions`.

## Capabilities

### New Capabilities
- `admin-users-module`: administração de usuários com controle operacional sobre membros.

### Modified Capabilities
- `database-schema`: passa a ser consumido de forma mais intensa pelo módulo administrativo de usuários.
- `points`: o saldo do usuário e o histórico de transações passam a receber ajustes manuais pelo admin.

## Impact

- `src/modules/admin/users/` para service, controller, module e DTOs.
- `src/database/entities/user.entity.ts` e `src/database/entities/point-transaction.entity.ts` para leitura e atualização de estado.
- `src/app.module.ts` para registrar o novo módulo administrativo.
- Rotas administrativas protegidas por autenticação e role `admin`.
