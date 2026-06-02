## 1. Preparacao do fluxo de migration

- [x] 1.1 Confirmar que `src/config/database.config.ts` e o CLI do TypeORM compartilham o mesmo `DataSource`
- [x] 1.2 Garantir que a pasta `src/database/migrations/` esteja preparada para receber a migration inicial
- [x] 1.3 Validar que os scripts `migration:generate`, `migration:run` e `migration:revert` estao prontos para uso

## 2. Geracao da migration inicial

- [x] 2.1 Gerar a migration inicial `initial-schema` a partir das entities atuais
- [x] 2.2 Revisar o arquivo gerado e ajustar nomes, chaves, indices e relacionamentos quando necessario
- [x] 2.3 Confirmar que a migration resultante representa o schema completo do projeto

## 3. Validacao do schema

- [x] 3.1 Executar `migration:run` em um banco PostgreSQL limpo
- [x] 3.2 Verificar se todas as tabelas e colunas foram criadas em `snake_case`
- [x] 3.3 Conferir se UUIDs, FKs, enums e restricoes estao coerentes com o modelo de entities

## 4. Reversao e verificacao final

- [x] 4.1 Executar `migration:revert` e confirmar que a ultima migration pode ser desfeita
- [x] 4.2 Reaplicar a migration apos o revert para validar o fluxo completo de ida e volta
- [x] 4.3 Registrar o resultado final da validacao do schema antes de encerrar a change
