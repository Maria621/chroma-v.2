# Etapa 04 — Tipografia, hierarquia e Design System

**Projeto:** Instituto Chroma — site multipáginas V3.6  
**Branch:** `preview/v3-6-etapa4-design-system`  
**Base:** `preview/v3-6-etapa3-arquitetura`  
**Escopo:** UI editorial, tokens de design, contraste de textos auxiliares.

## Direção de arte preservada

A Chroma continua usando azul como identidade dominante, superfícies claras para leitura e amarelo para pequenos pontos de destaque. A composição visual das páginas, o herói, o carrossel inclinado, as fotografias, os banners e o rodapé não foram reconstruídos.

As famílias já carregadas em todas as páginas continuam:

- **Montserrat:** títulos, navegação, botões e elementos editoriais.
- **Poppins:** parágrafos, formulários e textos corridos.

O CSS legado utilizava `--font: Manrope/Inter` e `--body: DM Sans` sem que essas famílias fossem importadas. Agora ambas as variáveis legadas apontam para as famílias efetivamente carregadas. Nenhuma nova dependência externa foi adicionada.

## Sistema semântico

Módulo de origem: `src/styles/modules/07-design-system.css`, último item do `src/styles/manifest.mjs`.

### Tokens introduzidos

- Tipografia: `--ds-font-display`, `--ds-font-body`, `--ds-type-card`, `--ds-type-caption`, `--ds-type-small`, `--ds-leading-body`.
- Paleta: `--ds-brand`, `--ds-brand-deep`, `--ds-accent`, `--ds-text`, `--ds-muted-text`, `--ds-surface`, `--ds-surface-soft`.
- Ritmo: `--ds-space-1` até `--ds-space-6`.
- Controles: `--ds-radius-control`, `--ds-min-touch`, `--ds-focus-ring`.

### Legibilidade e contraste

Contrastes calculados pela fórmula WCAG 2.2 para as cores definidas nos tokens:

| Elemento | Antes | Depois |
| --- | --- | --- |
| Texto auxiliar em branco | `#617c96` — ~4,35:1 | `#52667d` — ~5,91:1 |
| Metadado da história em branco | `#8298ae` — ~2,98:1 | `#52667d` — ~5,91:1 |
| Descrição de unidade em branco | `#6b7f92` — ~4,14:1 | `#52667d` — ~5,91:1 |
| Texto auxiliar em `#f4f8fc` | valores variados | `#52667d` — ~5,53:1 |
| Identificador azul da unidade em branco | `#367bb6` — ~4,50:1 | `#1c6399` — ~6,38:1 |

**Limite da verificação:** esses resultados cobrem combinações explícitas de cor/superfície, não certificam WCAG AA para a interface inteira. A checagem visual sobre imagens, componentes e estados interativos ainda é necessária.

Melhorias adicionais:
- Textos auxiliares, legendas e metadados passaram a contar com tamanhos de 12 a 14 px, conforme papel.
- Os cartões de unidades ganharam corpo de texto de 14 px, sem modificar sua estrutura.
- Notas e fontes institucionais deixaram de depender de alguns `!important` herdados, permitindo estilos semânticos.
- Placeholders dos formulários passam a usar cor com contraste adequado.
- Títulos de destaque preservam seus tamanhos, pesos, quebras e alinhamentos específicos para não prejudicar o hero.

## Testes

- `tests/design-system.test.mjs`: fontes, tokens, contraste WCAG AA para pares definidos e remoção de overrides desnecessários.
- `tests/architecture.test.mjs`: confere o manifesto de sete módulos e o CSS final; preserva hashes de módulos não alterados.
- `tests/visual_qa.py`: passa a inspecionar fontes computadas no corpo e nos títulos para 36 combinações responsivas.

## Homologação para seguir à Etapa 05

- [ ] `npm run build && npm test` executado integralmente no último commit.
- [ ] Capturas visuais comparativas das seis páginas (desktop e celular).
- [ ] Verificação manual de que textos ampliados não criam cortes ou transbordamentos.
- [ ] Confirmação de fontes carregadas em rede e sem layout shift relevante.
- [ ] Aprovação visual antes de qualquer alteração em produção.

**Pendente de etapas posteriores:** dimensionamento e enquadramento das imagens, QA visual completo, SEO e novos dados institucionais.
