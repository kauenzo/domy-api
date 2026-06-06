## 1. Setup do Módulo

- [x] 1.1 Criar a estrutura do módulo `AdminDashboardModule` em `src/modules/admin/dashboard/dashboard.module.ts`
- [x] 1.2 Registrar o `AdminDashboardModule` no `AppModule`

## 2. Core Implementation (Serviço)

- [x] 2.1 Criar os DTOs de resposta (`DashboardOverviewDto`, `MemberMetricsDto`) em `src/modules/admin/dashboard/dto/`
- [x] 2.2 Criar o `DashboardService` (`src/modules/admin/dashboard/dashboard.service.ts`)
- [x] 2.3 Implementar a consulta `getGeneralOverview()` usando TypeORM para totalizar tarefas de hoje, resgates pendentes e ranking de usuários por `points_balance`
- [x] 2.4 Implementar a consulta `getMemberMetrics(userId)` retornando saldo, streak, nível, e agregados de tarefas/resgates específicos do usuário

## 3. API Endpoints (Controller)

- [x] 3.1 Criar o `DashboardController` (`src/modules/admin/dashboard/dashboard.controller.ts`)
- [x] 3.2 Implementar a rota `GET /admin/dashboard` chamando `getGeneralOverview()`
- [x] 3.3 Implementar a rota `GET /admin/dashboard/members/:id` chamando `getMemberMetrics()`
- [x] 3.4 Aplicar os guards `JwtAuthGuard` e `RolesGuard` com `@Roles('admin')` nas rotas
- [x] 3.5 Adicionar os decorators do Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)
