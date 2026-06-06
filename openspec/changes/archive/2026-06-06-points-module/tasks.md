## 1. DTOs

- [x] 1.1 Criar `PointsSummaryDto` em `src/modules/points/dto/points-summary.dto.ts` mapeando `points_balance`, `current_streak`, `longest_streak`, `level` e `total_earned`.

## 2. Points Module Core

- [x] 2.1 Criar `PointsModule` em `src/modules/points/points.module.ts` importando `TypeOrmModule` das entities `User` e `PointTransaction`.
- [x] 2.2 Criar `PointsService`.
- [x] 2.3 Implementar método `getSummary(userId: string)` recuperando o usuário e calculando `total_earned` a partir das transações positivas no banco de dados.
- [x] 2.4 Implementar método `getHistory(userId: string, page: number, limit: number)` no service para retornar a listagem descrescente e paginada.
- [x] 2.5 Criar `PointsController` implementando `GET /points` e `GET /points/history`, usando `@CurrentUser()` decorator e `JwtAuthGuard`. Configurar Swagger adequadamente.

## 3. Integração

- [x] 3.1 Registrar `PointsModule` no `AppModule`.
