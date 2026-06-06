## Context

A plataforma possui um sistema de gamificação onde os membros acumulam pontos realizando tarefas e, posteriormente, gastam esses pontos para solicitar recompensas. Esse processo gera registros na tabela `redemptions` com status inicial `pending`. Precisamos agora do mecanismo para que administradores aprovem ou rejeitem essas solicitações, bem como endpoints para os membros acompanarem o status e histórico de resgates.

## Goals / Non-Goals

**Goals:**
- Prover endpoints na rota de admin (`/admin/redemptions`) para listagem, aprovação e rejeição de resgates.
- Prover endpoints na rota de membro (`/redemptions`) para listagem de histórico e detalhes.
- Garantir a consistência financeira (reembolso do `points_balance` e registro em `point_transactions` em caso de rejeição).
- Garantir a consistência de estoque (incrementar `stock_used` em `rewards` na aprovação).
- Integrar com o `NotificationsService` para disparar notificações apropriadas em ambos os casos.

**Non-Goals:**
- Criação ou listagem do catálogo de recompensas (Fase 13/14).
- Alterações na funcionalidade de solicitação de resgate (Fase 14).

## Decisions

- **Transações em Banco de Dados:** Como as rotas de aprovação e rejeição alteram várias tabelas (ex: `redemptions`, `users`, `point_transactions`, `rewards`), é imprescindível a utilização de transações do TypeORM (`queryRunner` ou `manager.transaction`) para garantir atomicidade.
- **Integração de Notificações:** Utilizaremos injeção de dependência do `NotificationsService` no `AdminRedemptionsService` para facilitar o disparo das notificações tipo `redemption_approved` e `redemption_rejected`.
- **Separação de Módulos:** Os endpoints para administrador ficarão no `AdminRedemptionsModule` com o `AdminGuard`, enquanto os endpoints para os membros ficarão no `RedemptionsModule` com apenas `JwtAuthGuard`.

## Risks / Trade-offs

- **[Risk] Condição de corrida ao aprovar/rejeitar simultaneamente:** 
  - **Mitigation:** Uso de transações (transactions) do TypeORM, impedindo que o saldo de pontos ou estoque fiquem inconsistentes. Além disso, validar se a redemption continua `pending` logo no início da transação.
