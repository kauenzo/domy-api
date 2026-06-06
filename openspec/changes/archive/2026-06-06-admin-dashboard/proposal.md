## Why

A implementação do Dashboard (Fase 18) é essencial para que os administradores (pais/responsáveis) tenham uma visão consolidada e métricas em tempo real sobre o engajamento dos membros na plataforma. Isso resolve a necessidade de acompanhar o progresso geral, avaliando tarefas concluídas, resgates pendentes e comparando o desempenho no ranking de pontos.

## What Changes

- Criação de recursos para o dashboard do admin.
- Retorno de métricas gerais (total de tarefas, resgates pendentes, ranking, streak atual).
- Retorno de métricas detalhadas por membro (pontos totais, streak, nível, tarefas concluídas, resgates).
- **Lista de endpoints implementados:**
  - `GET /admin/dashboard` → métricas gerais.
  - `GET /admin/dashboard/members/:id` → métricas por membro.

## Capabilities

### New Capabilities
- `admin-dashboard`: Visão consolidada de métricas para o administrador (tarefas pendentes/concluídas, resgates, ranking de pontos e streak atual dos membros).

### Modified Capabilities

## Impact

- **API**: Novos endpoints no prefixo `/admin/dashboard`.
- **Código**: Novo módulo em `src/modules/admin/dashboard/`.
- **Dependências**: O dashboard fará leitura agregada nas tabelas `users`, `task_instances` e `redemptions`. Não há alteração estrutural no banco de dados.
