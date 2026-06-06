## Why

A Fase 15 do ROADMAP (Módulo de Resgates) é necessária para completar o fluxo de gamificação relacionado às recompensas. Após a implementação da vitrine e da solicitação de recompensas pelos membros (Fase 14), é preciso que os administradores possam gerenciar essas solicitações (aprovar ou rejeitar) e que os membros possam acompanhar o status histórico de seus resgates.

## What Changes

- Criação de endpoints para o administrador listar, aprovar e rejeitar resgates solicitados.
- Criação de endpoints para o membro visualizar seu histórico detalhado de resgates.
- Implementação da lógica de aprovação: atualização de status para `approved`, incremento de `stock_used` na recompensa correspondente e criação de notificação.
- Implementação da lógica de rejeição: atualização de status para `rejected`, reembolso dos pontos (`point_transaction` com type `redemption_refund`) e criação de notificação.
- Depende indiretamente da Fase 17 (Notificações) para enviar o aviso de aprovação/rejeição.

## Capabilities

### New Capabilities
- `admin-redemptions`: Gerenciamento de resgates pelo administrador (aprovação, rejeição, listagem).
- `member-redemptions`: Consulta do histórico e status de resgates pelo membro.

### Modified Capabilities


## Impact

- Criação de novos controllers, services e DTOs em `src/modules/admin/redemptions/` e `src/modules/redemptions/`.
- Afeta as entidades `Redemption`, `PointTransaction` e `Reward` (atualização de estoque e saldo).
- Interage com o módulo de notificações.
