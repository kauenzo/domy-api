# admin-dashboard Specification

## Purpose
TBD - created by archiving change admin-dashboard. Update Purpose after archive.
## Requirements
### Requirement: Admin Dashboard Overview
O sistema MUST fornecer um endpoint para o administrador consultar métricas gerais da família/grupo.

#### Scenario: Visualizando o dashboard geral
- **WHEN** um administrador faz uma requisição GET para `/admin/dashboard`
- **THEN** o sistema retorna um resumo contendo total de tarefas do dia (pendentes, concluídas, atrasadas), total de resgates pendentes e o ranking atualizado dos membros ordenado por pontos.

### Requirement: Admin Member Metrics
O sistema MUST fornecer um endpoint para consultar estatísticas consolidadas de um membro específico.

#### Scenario: Visualizando o dashboard de um membro específico
- **WHEN** um administrador faz uma requisição GET para `/admin/dashboard/members/:id` informando um ID de membro válido
- **THEN** o sistema retorna o total de pontos do membro, streak atual, nível atual, número de tarefas concluídas no período e total de resgates realizados.

