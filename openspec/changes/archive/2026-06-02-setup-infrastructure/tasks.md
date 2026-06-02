## 1. Dependencias e ambiente

- [x] 1.1 Adicionar dependencias principais no `package.json` conforme a fase 0
- [x] 1.2 Criar `.env.example` com todas as variaveis obrigatorias

## 2. Configuracao base

- [x] 2.1 Criar `src/config/database.config.ts` exportando o DataSource do TypeORM
- [x] 2.2 Criar `src/config/jwt.config.ts` com segredo e expiracao centralizados
- [x] 2.3 Registrar `ConfigModule` global em `src/app.module.ts`

## 3. Bootstrap da aplicacao

- [x] 3.1 Configurar `ValidationPipe` global em `src/main.ts`
- [x] 3.2 Validar carregamento de envs obrigatorios no bootstrap

## 4. Infra local e migrations

- [x] 4.1 Criar `docker-compose.yml` com PostgreSQL e portas padronizadas
- [x] 4.2 Adicionar scripts de migration (generate/run/revert) no `package.json`

## 5. Estrutura do projeto

- [x] 5.1 Criar pastas `src/common`, `src/database`, `src/modules`, `src/jobs`
- [x] 5.2 Atualizar README com instrucoes basicas de setup local
