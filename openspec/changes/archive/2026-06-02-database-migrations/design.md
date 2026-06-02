## Context

A fase 1 ja entregou todas as entities TypeORM do dominio. O projeto tambem ja possui um `DataSource` exportavel em `src/config/database.config.ts` e scripts de migration no `package.json`, entao a fase 2 pode se concentrar em transformar esse modelo em uma migration inicial executavel e validada em banco limpo.

O principal objetivo aqui e reduzir a distancia entre o modelo declarado nas entities e o schema real no PostgreSQL. Isso evita criacao manual de tabelas, facilita bootstrap local e reduz divergencias entre ambientes.

## Goals / Non-Goals

**Goals:**

- Gerar a migration inicial a partir das entities atuais.
- Garantir que a migration use o mesmo `DataSource` da aplicacao.
- Validar que o schema criado corresponde ao modelo esperado.
- Manter fluxo de aplicacao e reversao previsivel para desenvolvimento local.

**Non-Goals:**

- Alterar o modelo de dados ou revisar regras de negocio das entities.
- Criar endpoints, DTOs ou modulos de dominio.
- Introduzir um novo mecanismo de migrations fora do TypeORM.

## Decisions

- **Reusar o DataSource existente**: manter `src/config/database.config.ts` como unica fonte de configuracao para a app e para o CLI do TypeORM. Isso evita duplicacao de parametros e reduz o risco de divergencia. Alternativa considerada: criar um arquivo separado para CLI, mas isso aumenta manutencao sem ganho real.
- **Migration inicial unica e versionada**: gerar uma migration baselined do schema atual em vez de varias migrations pequenas retroativas. Para esta fase, o valor esta em materializar o estado atual do modelo, nao em documentar cada iteracao historica. Alternativa considerada: fragmentar por entidade, o que deixaria a fase mais lenta e com mais pontos de falha.
- **Ajuste manual da migration gerada**: revisar a saida automatica do TypeORM antes de considerar a fase concluida. A geracao automatica costuma acertar o esqueleto, mas pode precisar de refinamentos em nomes, indices e relacoes. Alternativa considerada: aceitar a saida bruta, o que aumenta risco de inconsistencias.
- **Validacao em banco limpo**: executar a migration do zero em um PostgreSQL novo para confirmar que o schema sobe sem dependencias ocultas. Alternativa considerada: validar apenas em banco ja populado, mas isso mascara falhas de bootstrap.
- **Sem `synchronize` em runtime**: manter a criacao de schema restrita a migrations. Isso preserva previsibilidade entre ambientes. Alternativa considerada: habilitar `synchronize` em dev, mas isso cria inconsistencias e contorna o fluxo oficial.

## Risks / Trade-offs

- [Generated SQL diverge do modelo real] -> Mitigacao: revisar manualmente a migration e validar a estrutura final em banco limpo.
- [Migration inicial fica grande] -> Mitigacao: manter a primeira migration apenas como baseline e usar pequenas migrations futuras para mudancas incrementais.
- [Rollback nao cobre todo cenario de producao] -> Mitigacao: documentar que `migration:revert` serve para desenvolvimento e para rollback controlado, nao como estrategia unica de emergencia.
- [Ambiente local diferente do banco alvo] -> Mitigacao: usar a mesma configuracao de DataSource e mesmas variaveis de ambiente em todos os comandos de migration.

## Migration Plan

1. Gerar a migration inicial a partir das entities atuais.
2. Revisar o arquivo gerado e ajustar manualmente o que for necessario.
3. Aplicar a migration em um banco PostgreSQL limpo.
4. Verificar que todas as tabelas, FKs, enums e colunas estao presentes com os nomes esperados.
5. Testar `migration:revert` em ambiente local para confirmar reversibilidade basica.
6. Manter o arquivo versionado como baseline do schema atual.

## Open Questions

- Nenhuma no momento. O escopo da fase esta bem definido pela fase 1 e pelo schema atual das entities.
