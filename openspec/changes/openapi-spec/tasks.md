## 1. Configuração do Swagger no NestJS

- [x] 1.1 Configurar a criação do documento Swagger no arquivo `src/main.ts` (apenas quando `NODE_ENV !== 'production'`).
- [x] 1.2 Configurar o Swagger UI para ser servido no endpoint `/api/docs`.

## 2. Documentação de DTOs

- [x] 2.1 Habilitar o plugin do Swagger no `nest-cli.json` para inferência automática de tipos.
- [x] 2.2 Revisar DTOs (`src/modules/**/dto/*.ts`) e adicionar decorators do Swagger (`@ApiProperty()`) quando a inferência não for suficiente (ex: propriedades não primitivas ou Enums).

## 3. Documentação de Controllers - Auth & Core

- [x] 3.1 Adicionar decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`) no `AuthController`.
- [x] 3.2 Adicionar decorators no `AdminAuthController`.
- [x] 3.3 Adicionar decorators no `InvitesController`.
- [x] 3.4 Adicionar decorators no `ProfileController`.
- [x] 3.5 Adicionar decorators no `AdminUsersController`.

## 4. Documentação de Controllers - Tasks & Gamification

- [x] 4.1 Adicionar decorators no `CategoriesController` e no `TagsController`. <!-- N/A: Fase 8 ainda pendente — controllers não existem -->
- [x] 4.2 Adicionar decorators no `AdminTasksController` e no `AdminTaskInstancesController`.
- [x] 4.3 Adicionar decorators no `TasksController`.
- [x] 4.4 Adicionar decorators no `PointsController`.
- [x] 4.5 Adicionar decorators no `DashboardController`.

## 5. Documentação de Controllers - Rewards & Notifications

- [x] 5.1 Adicionar decorators no `AdminRewardsController` e no `RewardsController`.
- [x] 5.2 Adicionar decorators no `AdminRedemptionsController` e no `RedemptionsController`.
- [x] 5.3 Adicionar decorators no `NotificationsController`. <!-- N/A: Fase 17 ainda pendente — controller não existe -->

## 6. Exportação do Schema YAML

- [x] 6.1 Criar o arquivo `src/swagger-gen.ts` que instancia o NestFactory vazio para gerar e salvar fisicamente o arquivo `openapi.yaml` (usando dump do js-yaml).
- [x] 6.2 Adicionar o comando `swagger:gen` aos scripts do `package.json` (`nest start --entryFile swagger-gen`).
- [x] 6.3 Atualizar o arquivo `openspec/config.yaml` se houver necessidade de injetar o `openapi.yaml` como contexto.
