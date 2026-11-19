# Instituto Chroma — organização do CSS

Nesta versão, o site continua utilizando **um único CSS de produção**:
`dist/assets/css/site.css`, gerado no build.

As fontes foram separadas em seis módulos ordenados, definidos em
`src/styles/manifest.mjs`:

| Arquivo | Responsabilidade | Observação |
| --- | --- | --- |
| `01-foundation.css` | Base compartilhada e estilos herdados de V2 | Preserva regras de compatibilidade |
| `02-institutional-layout.css` | Layout institucional V3 e páginas | Fonte da estrutura visual principal |
| `03-page-components.css` | Componentes das páginas e refinamentos V3.2 | Manter as regras nos contextos originais |
| `04-interaction-system.css` | Componentes e refinamentos V3.3/V3.4 | Mantém carrossel, timeline e comportamento responsivo |
| `05-quality-accessibility.css` | Tokens e verificações de contraste/QA | Regras anteriores preservadas |
| `06-reviewed-fixes.css` | Correções aprovadas nas Etapas 01 e 02 | Migrar futuras correções para o módulo correspondente após QA |

## Invariantes da migração

1. A concatenação de todos os módulos é **idêntica, caractere por caractere**, ao antigo `src/styles/site.css` da Etapa 02.
2. Ordem dos módulos é obrigatória: alterar esta sequência altera a cascata CSS.
3. O arquivo compilado continua exatamente no mesmo caminho `assets/css/site.css`; nenhuma página muda sua referência.
4. `tests/architecture.test.mjs` valida o comprimento e checksum da linha de base, além da equivalência do CSS gerado.
5. As seis páginas HTML originais foram somente indentadas. `scripts/build.mjs` remove quebras de linha geradas entre tags para manter a saída idêntica à etapa anterior.

## Padrões de manutenção

- Alterar apenas arquivos de origem em `src/`; nunca editar `dist/` à mão.
- Uma nova funcionalidade deve pertencer ao módulo de origem pertinente e não gerar mais uma versão CSS solta.
- Conservar a convenção de seletores existentes até a refatoração semântica de classes, em PR com teste visual e comparação de telas.
- **Não** retirar regras antigas ou `!important` sem comprovar que não afetam as seis páginas e suas 36 combinações responsivas.
- Após mudanças, executar `npm run build && npm test`; executar adicionalmente `npm run qa:visual` em ambiente com Playwright e Chromium.

## Itens deliberadamente não alterados

A existência de seletores legados (`v3-`, `v32-`, `v33-`, `v34-`) e declarações repetidas é um débito técnico controlado. Removê-los sem uma referência visual poderia modificar o design aprovado. Esta etapa estabeleceu módulos, build legível e testes; a eliminação semântica deverá ocorrer com comparação de capturas e revisão técnica posterior.
