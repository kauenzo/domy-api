## Context

O aplicativo doméstico de tarefas possui uma mecânica central de pontos para engajar os membros. Para garantir que este engajamento seja mantido a longo prazo, implementaremos um sistema de Gamificação focado em "Streak" (frequência) e "Níveis" (progressão de longo prazo). Este módulo servirá de base (engine) para que o módulo de tarefas e os cron jobs calculem bônus de pontos, além de atualizar o nível do usuário conforme ele acumula pontos.

## Goals / Non-Goals

**Goals:**
- Centralizar as regras de negócio de gamificação (cálculo de bônus por streak, determinação de níveis).
- Prover métodos utilitários que incrementam, resetam o streak diário e processam subidas de nível.
- Isolar a lógica de pontuação para facilitar eventuais mudanças de balanceamento sem impactar o domínio de `tasks`.

**Non-Goals:**
- Não expor endpoints diretos (REST APIs) para os membros alterarem seus streaks/níveis. Todas as mudanças serão derivadas de processos internos de backend (conclusão de tarefas, jobs cron).
- Não lidar com o agendamento do reset (isso é responsabilidade da Fase 12 - Jobs Cron).

## Decisions

- **Isolamento de Lógica**: O `GamificationService` atuará como um provedor de cálculos puros (`calculateStreakBonus`, `calculateLevel`) e orquestrador de atualizações de perfil (`checkAndUpdateLevel`, `incrementStreak`, `resetStreak`).
- **Níveis baseados em ganhos brutos**: O nível é calculado apenas em cima de pontos ganhos, não afetado por gastos (como resgates) ou penalidades. Para determinar os pontos ganhos totais, podemos somar as transações positivas do usuário ou, preferencialmente, o banco ou cache já pode prover esse total (que é referenciado como "sobre total histórico positivo").
- **Notificações Automáticas**: `checkAndUpdateLevel` deve emitir notificação (`level_up`) caso o nível salvo no banco seja diferente do nível recém-calculado. Será necessário interagir com a API do `NotificationsModule` no futuro.

## Risks / Trade-offs

- **[Risk] Inconsistência de Nível/Pontos Totais:** Calcular os pontos totais somando toda a tabela `point_transactions` repetidas vezes pode degradar a performance conforme a base cresce.
  - **Mitigation:** Como otimização, o sistema poderia manter um sumário pre-calculado, porém, como o MVP pode suportar essa carga, a princípio a soma (`SUM`) das transações positivas (onde amount > 0 e type indica ganho) será suficiente.
- **[Risk] Dependência Circular:** Possível injeção circular se `TasksModule` e `GamificationModule` dependerem muito fortemente um do outro.
  - **Mitigation:** `GamificationModule` não dependerá de `TasksModule`. O `TasksModule` fará as chamadas para o `GamificationModule` que, por sua vez, apenas injetará dependências para `Users` ou `TypeORM`.
