## Why

A Fase 16 do ROADMAP (Módulo de Pontos) consolida a visibilidade do membro sobre sua evolução no app. Fornecer ao usuário um painel claro com o saldo de pontos, nível atual, status do seu *streak* e um histórico completo das transações de pontos é crucial para engajamento, transparência e funcionamento da gamificação.

## What Changes

- Criação do endpoint `GET /points` para retornar o resumo de gamificação do membro logado: saldo atual (`balance`), *streak* atual (`current_streak`), maior *streak* alcançado (`longest_streak`), nível (`level`) e total de pontos ganhos (`total_earned`).
- Criação do endpoint `GET /points/history` para listar o histórico paginado de transações do usuário (ganhos, penalidades, resgates, ajustes).
- Criação do DTO `PointsSummaryDto`.

## Capabilities

### New Capabilities
- `member-points`: Permite que o membro consulte seu saldo de pontos, status de gamificação (nível, streak) e histórico de transações.

### Modified Capabilities


## Impact

- Criação de novos controllers, services e DTOs em `src/modules/points/`.
- Depende fortemente da tabela `point_transactions` e dos campos de gamificação na tabela `users`.
