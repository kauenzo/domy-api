## Why

A gamificação é o coração do engajamento no aplicativo. Precisamos de um sistema centralizado que calcule o nível do usuário com base em seus pontos acumulados e gerencie o *streak* (dias consecutivos completando tarefas), incentivando a consistência e recompensando o esforço contínuo.

## What Changes

- Criação do módulo central `GamificationModule` que expõe serviços para outros módulos do sistema.
- Implementação de lógica para calcular o bônus de pontos com base no *streak* atual.
- Lógica para calcular o nível (Bronze, Prata, Ouro, Diamante) do usuário com base nos pontos totais ganhos.
- Atualização do perfil do usuário e envio de notificações automáticas quando ocorre uma subida de nível (`level_up`).
- Fornecimento de métodos fundamentais de controle do *streak* (`incrementStreak`, `resetStreak`) que serão consumidos pelo módulo de tarefas e rotinas em background.

## Capabilities

### New Capabilities
- `gamification-engine`: Lógica central para cálculo de níveis (Bronze a Diamante) com base no histórico de transações positivas, e multiplicadores de bônus de *streak* (10% a 100%). Gerencia atualização de nível e disparo de notificações pertinentes.

### Modified Capabilities

## Impact

- **Módulos Novos**: Criação de `src/modules/gamification/gamification.service.ts` e `src/modules/gamification/gamification.module.ts`.
- **Integração Futura**: Servirá como dependência core para o `TasksModule` (para aplicar o multiplicador de streak nos pontos ganhos e incrementar o streak diário) e para os `Cron Jobs` (Fase 12, para zerar o streak quando necessário).
- **Notificações**: Irá disparar a criação de notificações do tipo `level_up` através do `NotificationsModule` (dependência, será a Fase 17).
