## 1. Setup e DTOs

- [x] 1.1 Criar o DTO `UpdateProfileDto` em `src/modules/users/dto/update-profile.dto.ts` com validação no `name` (string) e `avatar_url` (url, opcional)

## 2. Core Implementation (Serviço)

- [x] 2.1 Adicionar o método `getProfileWithStats(userId: string)` no `UsersService` (`src/modules/users/users.service.ts`), que retorne o usuário e utilize o repository de `task_instances` para contar as tarefas concluídas pelo usuário

## 3. API Endpoints (Controller)

- [x] 3.1 Criar o `ProfileController` (`src/modules/users/profile.controller.ts`)
- [x] 3.2 Implementar a rota `GET /profile` utilizando o guard `JwtAuthGuard` e o decorator `@CurrentUser()` para extrair o ID
- [x] 3.3 Implementar a rota `PATCH /profile` reutilizando o método `update` do `UsersService` para salvar as alterações do `UpdateProfileDto`
- [x] 3.4 Registrar o `ProfileController` no array de controllers do `UsersModule`
- [x] 3.5 Adicionar os decorators do Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) para a documentação
