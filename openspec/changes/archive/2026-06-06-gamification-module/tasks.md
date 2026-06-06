## 1. Setup

- [x] 1.1 Criar a estrutura de pastas do módulo (`src/modules/gamification`)
- [x] 1.2 Criar o arquivo `gamification.module.ts` e definir a classe `GamificationModule`

## 2. Service Implementation

- [x] 2.1 Criar o arquivo `gamification.service.ts` e injetar o repositório de usuários (ou importar `UsersModule`)
- [x] 2.2 Implementar o método `calculateStreakBonus(streak: number): number` aplicando a tabela de multiplicadores (1.0 a 2.0)
- [x] 2.3 Implementar o método `calculateLevel(totalPoints: number): Level` aplicando a tabela de limiares de pontos (Bronze a Diamante)
- [x] 2.4 Implementar o método `checkAndUpdateLevel(userId: string)` que obtém as transações positivas do usuário, calcula o nível e o atualiza caso suba (incluindo integração futura para disparar `level_up` via `NotificationsModule`)
- [x] 2.5 Implementar o método `incrementStreak(userId: string)` que atualiza o `current_streak` e potencialmente o `longest_streak` no banco de dados
- [x] 2.6 Implementar o método `resetStreak(userId: string)` que atualiza o `current_streak` para 0 no banco de dados

## 3. Module Wiring

- [x] 3.1 Adicionar `GamificationService` nos providers e exports do `GamificationModule`
- [x] 3.2 Registrar o `GamificationModule` no arquivo `src/app.module.ts`
