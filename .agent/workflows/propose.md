---
description: Propõe uma nova feature para o domy-api. O contexto do projeto é injetado automaticamente pelo openspec via config.yaml.
---

# Workflow: Propor nova feature (domy-api)

---

## Contexto

O openspec injeta o contexto do projeto automaticamente via `openspec/config.yaml` em cada chamada de `openspec instructions`.
**Não é necessário ler back-speck.md, stack-speck.md ou project-context.md.**

Leia apenas:
- **A seção da fase no ROADMAP** → `../../ROADMAP.md`
  - Não leia o arquivo inteiro. Busque pelo change name ou nome da fase e leia só aquela seção.

---

## Input

O argumento após a menção deste workflow é o **nome da feature** ou uma **descrição do que construir**.

- Se for um change name do ROADMAP (ex: `auth-member`), localize a seção correspondente.
- Se for uma descrição livre, derive um kebab-case (ex: "autenticação do membro" → `auth-member`).
- Se nenhum input foi dado, pergunte: _"Qual feature você quer propor? Pode ser o nome de uma fase do ROADMAP ou uma descrição livre."_

---

## Passos

### 1. Ler o contexto da fase

No `ROADMAP.md`, localize e leia **apenas a seção da fase solicitada** (busque pelo change name ou nome da fase).

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

O JSON retorna `context` (injetado do config.yaml), `rules`, `template`, `instruction`, `outputPath`, `dependencies`.
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

- Leia apenas a seção da fase no ROADMAP — o contexto da stack vem automaticamente via openspec
- Se a change já existir, pergunte: continuar ou criar nova?
- Prefira decisões razoáveis a perguntas — pergunte só quando criticamente ambíguo

