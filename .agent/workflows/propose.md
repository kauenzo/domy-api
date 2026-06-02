---
description: Propõe uma nova feature para o domy-api. Lê o contexto mínimo necessário e gera todos os artefatos em um passo.
---

# Workflow: Propor nova feature (domy-api)

---

## Contexto (leia apenas isto — não leia back-speck.md nem stack-speck.md)

Leia os dois arquivos abaixo. São compactos e suficientes para este workflow:

1. **Digest do projeto** → `../.agent/project-context.md`
   - Stack, convenções de código, modelo de dados resumido, regras de negócio
2. **Apenas a seção da fase no ROADMAP** → `../../ROADMAP.md`
   - Não leia o arquivo inteiro. Localize a seção da fase solicitada pelo nome ou change name e leia só ela.

> Se precisar de detalhes muito específicos do modelo de dados ou de um endpoint que não estejam no digest, então — e só então — consulte `../../../back-speck.md` na seção relevante.

---

## Input

O argumento após a menção deste workflow é o **nome da feature** ou uma **descrição do que construir**.

- Se for um change name do ROADMAP (ex: `auth-member`), localize a seção correspondente.
- Se for uma descrição livre, derive um kebab-case (ex: "autenticação do membro" → `auth-member`).
- Se nenhum input foi dado, pergunte: _"Qual feature você quer propor? Pode ser o nome de uma fase do ROADMAP ou uma descrição livre."_

---

## Passos

### 1. Ler o contexto mínimo

1. Leia `project-context.md` (digest compacto).
2. No `ROADMAP.md`, localize e leia **apenas a seção da fase solicitada** (busque pelo change name ou nome da fase).

### 2. Criar o diretório da change

```bash
cd domy-api && openspec new change "<name>"
```

Cria `openspec/changes/<name>/` com `.openspec.yaml`.

### 3. Obter a ordem de build dos artefatos

```bash
cd domy-api && openspec status --change "<name>" --json
```

Parse o JSON:
- `applyRequires`: artefatos necessários antes da implementação
- `artifacts`: lista com status e dependências

### 4. Criar os artefatos em sequência

Use o **TodoWrite tool** para rastrear progresso.

Para cada artefato `ready`:

```bash
cd domy-api && openspec instructions <artifact-id> --change "<name>" --json
```

O JSON retorna `context`, `rules`, `template`, `instruction`, `outputPath`, `dependencies`.
- `context` e `rules` são restrições para você — **nunca os copie para o output**
- Use `template` como estrutura e `instruction` como guia
- Leia artefatos de `dependencies` antes de criar o próximo

Continue até que todos os artefatos em `applyRequires` estejam `status: "done"`.

### 5. Status final

```bash
cd domy-api && openspec status --change "<name>"
```

---

## Output

```
✅ Change: openspec/changes/<name>/
📄 Artefatos: proposal.md · design.md · tasks.md
📌 Para implementar: @[domy-api/.agent/workflows/opsx-apply.md]
```

---

## Guardrails

- Leia `project-context.md` e a seção da fase no ROADMAP — **não leia os specs completos por padrão**
- Só consulte `back-speck.md` se precisar de detalhe específico não coberto pelo digest
- Siga as convenções do digest: NestJS modules, TypeORM snake_case, DTOs com class-validator, UUIDs
- Se a change já existir, pergunte: continuar ou criar nova?
- Prefira decisões razoáveis a perguntas — pergunte só quando criticamente ambíguo
