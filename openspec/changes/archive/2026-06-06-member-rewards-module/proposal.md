## Why

Membros precisam visualizar recompensas disponíveis e solicitar resgates usando pontos acumulados. A fase 14 do roadmap entrega a vitrine e o fluxo de solicitação com validações de saldo, estoque, cooldown e débito imediato de pontos, fechando o ciclo gamificado de tarefas → pontos → recompensas.

## What Changes

- Adiciona um módulo de recompensas para membros em `/rewards`.
- Expõe vitrine com recompensas ativas e com estoque disponível.
- Permite consultar detalhes de uma recompensa.
- Permite solicitar resgate com validações de negócio e criação de `redemption` em status `pending`.
- Debita pontos imediatamente via `point_transaction` do tipo `redemption_debit`.

### Endpoints

```
GET    /rewards
GET    /rewards/:id
POST   /rewards/:id/redeem
```

## Capabilities

### New Capabilities
- `member-rewards-module`: vitrine de recompensas e solicitação de resgate com validações de saldo, estoque e cooldown.

### Modified Capabilities
- _(nenhuma — entities `Reward`, `Redemption` e `PointTransaction` já estão definidas em `database-schema`)_

## Impact

- `src/modules/rewards/` para service, controller, module e DTOs.
- `src/database/entities/reward.entity.ts`, `redemption.entity.ts`, `point-transaction.entity.ts` e `user.entity.ts`.
- `src/app.module.ts` para registrar o módulo de membro.
- Rotas protegidas por autenticação JWT de membro.
- Depende da fase 13 (`admin-rewards-module`) para existir catálogo gerenciável pelo admin.
