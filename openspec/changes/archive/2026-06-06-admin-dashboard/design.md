## Context

O sistema domy-api já conta com entidades de tarefas, usuários, transações de pontos e resgates. Pais (admins) precisam de um dashboard que consolide essas informações para facilitar a gestão e visualização do progresso dos filhos (membros) sem ter que verificar várias páginas individualmente.

## Goals / Non-Goals

**Goals:**
- Prover um endpoint de métricas agregadas da plataforma.
- Prover um endpoint de métricas detalhadas por membro.
- Reaproveitar as lógicas e consultas já disponíveis sempre que possível, focando em visualização.

**Non-Goals:**
- Criação de novos modelos de dados ou tabelas focadas unicamente em relatórios consolidados (ex: views materializadas) neste momento.

## Decisions

- **Arquitetura do Módulo**: Será criado um novo módulo `AdminDashboardModule` com seu respectivo `DashboardController` e `DashboardService` no diretório `src/modules/admin/dashboard/`.
  - **Rationale**: Manter a coesão. O `DashboardService` orquestrará a injeção do repositório ou importará serviços se eles expuserem métodos para métricas, ou fará chamadas diretas ao banco usando TypeORM `queryBuilder` para agregações eficientes (ex: `COUNT`, `SUM`).
- **Agregação via QueryBuilder**: Para evitar trazer dados excessivos para a memória, as métricas como total de tarefas concluídas, pontos e ranking serão realizadas via SQL com QueryBuilder diretamente na base.
  - **Rationale**: Desempenho e baixo custo de memória, aproveitando o motor do banco de dados.
- **Guards**: Rotas protegidas por `JwtAuthGuard` e `AdminGuard` ou `@Roles('admin')`.

## Risks / Trade-offs

- [Risk] Múltiplas queries de agregação em tempo real podem causar degradação de performance se a base de dados crescer consideravelmente.
  - Mitigation: No cenário atual de um app doméstico, a volumetria de dados é muito baixa. Podemos implementar chamadas em cache num futuro ou views materializadas se isso se tornar um gargalo, o que é altamente improvável.
