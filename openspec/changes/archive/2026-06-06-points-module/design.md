## Context

Os membros interagem frequentemente com o app para completar tarefas, ganhar pontos e aumentar de nível ou *streak*. Atualmente os dados já estão previstos nas colunas da entidade `User` (como `points_balance`, `current_streak`, `longest_streak`, `level`) e as transações de pontos na entidade `PointTransaction`. Para dar visibilidade sobre essas métricas e engajar o usuário com a gamificação, precisamos disponibilizar os endpoints de consulta.

## Goals / Non-Goals

**Goals:**
- Prover um endpoint `GET /points` que retorne o `PointsSummaryDto` com os dados atuais.
- Prover um endpoint `GET /points/history` paginado que retorne a lista de `point_transactions` pertencentes ao membro autenticado.
- A rota deve ser protegida por `JwtAuthGuard`.

**Non-Goals:**
- Criação ou modificação da lógica que credita ou debita pontos (já abordado em tarefas, resgates ou jobs cron).
- Alteração das regras de *streak* ou de nível (Fase 11).

## Decisions

- **Cálculo de `total_earned`:** O total de pontos historicamente ganhos não possui uma coluna dedicada. Para o endpoint de resumo, o serviço fará um `SUM(amount)` na tabela `point_transactions` do usuário para transações onde `amount > 0` (excluindo resgates e penalidades).
- **Paginação do Histórico:** Utilizaremos paginação simples (e.g. `page` e `limit`) para a listagem do histórico, ordenando as transações da mais recente para a mais antiga (`createdAt` DESC).

## Risks / Trade-offs

- **[Risk] Lentidão ao calcular `total_earned` via query on-the-fly:**
  - **Mitigation:** Como o volume de transações por usuário começa pequeno, a operação de `SUM` direto no Postgres usando índice na coluna `user_id` será eficiente. Caso o projeto cresça significativamente, a arquitetura futura pode adotar cache ou coluna sumarizada.
