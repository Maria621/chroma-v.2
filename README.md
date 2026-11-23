# Instituto Chroma — site institucional V3.7 (Etapas 01–08)

Evolução editorial controlada da V3.5: marcos históricos de unidades confirmados, identidade institucional padronizada e pendências separadas para validação. O layout e as interações aprovados foram preservados. A publicação permanece estática, com componentes reutilizáveis e JavaScript modular.

## Estrutura

- `src/pages/`: conteúdo HTML original de cada uma das seis páginas, com marcações para o cabeçalho/rodapé compartilhados.
- `src/partials/`: cabeçalho e rodapé únicos, reutilizados no build.
- `src/styles/modules/`: **oito módulos CSS de origem**, mantidos na ordem de `src/styles/manifest.mjs`; o build concatena um único `dist/assets/css/site.css`. Consulte `src/styles/README.md`.
- `src/scripts/components/`: navegação, carrossel, linha do tempo, lightbox, unidades, contato e notícias com responsabilidades separadas.
- `src/data/timeline.js`: somente os quatro marcos de unidades informados pela equipe (2016, 2019, 2022, 2026).
- `docs/validacao-institucional.md`: fatos confirmados, registros legados e pendências.
- `assets/` e `conteudo/`: imagens oficiais, artes ilustrativas e registro estático das campanhas já existentes no repositório. No ZIP, há cópias sob `public/` para montar o build de forma independente.
- `scripts/build.mjs`: compilador sem dependências externas que une os parciais e produz `dist/`.
- `tests/project.test.mjs`: testes de referências internas, integridade de recursos, estrutura, CTA e contrastes críticos.
- `tests/institutional.test.mjs`: testes de regressão para os marcos, a identidade e Valinhos.
- `tests/design-system.test.mjs`: validação de fontes, legibilidade e contraste de tokens WCAG AA.
- `tests/visual-media.test.mjs`: testes de regressão para proporções de imagens e responsividade do hero e rodapé.
- `tests/visual_qa.py`: QA responsivo e funcional com Chromium + Playwright (6 páginas × 6 larguras) e relatório de falhas.
- `tests/runtime_smoke.py`: teste real do JS modular via servidor HTTP local.
- `scripts/site-metadata.mjs`: indexação e dados estruturados sob configuração explícita.
- `scripts/image-dimensions.mjs`: dimensões intrínsecas de imagens, sem dependências externas.

## Executar

Requer Node.js 22 (conforme o campo `engines` do projeto).

```bash
npm run build
npm test
```

A pasta `dist/` é o diretório de publicação. O arquivo `vercel.json` aponta o build para `npm run build` e a saída para `dist/`. O projeto não exige React ou outro framework para estas seis páginas.

### Verificações de navegador

O roteiro `python3 tests/visual_qa.py` exige Python, Playwright e Chromium. É um teste complementar, não substitui uma avaliação de Lighthouse, WCAG com leitores de tela ou inspeção do site público.

## Regras de manutenção

1. **Não alterar conteúdos aprovados** durante mudanças de layout ou de estrutura. Revisões editoriais exigem aprovação específica.
2. Atualizar componentes no `src/`, executar `npm run build`, `npm test` e uma rodada visual antes de atualizar a prévia.
3. Não colocar dados fictícios de histórico ou fotos ilustrativas como registros documentais. A cronologia apresenta somente os quatro marcos de unidades informados pela equipe; outros anos estão pendentes. Imagens sintéticas de unidades e salas devem continuar identificadas como ilustrativas até a chegada de fotografias reais autorizadas.
4. A página Contato apenas **prepara uma mensagem para o WhatsApp**: o envio depende da confirmação do visitante no aplicativo. Não há envio de e-mail em servidor.
5. As páginas de prévia têm `noindex,nofollow`; isso deve ser revisto junto com SEO, política de privacidade e informações oficiais antes de produção.

A produção V2.2 e as versões de prévia anteriores não devem ser sobrescritas sem aprovação explícita.

## Etapa 01 — Fatos e pendências

Consulte `docs/validacao-institucional.md`. OBA, olimpíadas e seus respectivos anos/resultados não foram acrescentados como fatos históricos no site: é necessário confirmar o escopo. Endereço e atendimento da unidade de Valinhos ainda estão pendentes.

## Etapa 02 — Funcionalidades e navegação

A branch `preview/v3-6-etapa2-funcionalidades` mantém o layout da V3.5 e acrescenta correções controladas ao formulário (Diadema, Itavuvu, Pannunzio; Valinhos sem canal confirmado), menu móvel, âncoras, carrossel e linha do tempo. Consulte `docs/etapa-02-funcionalidades.md` e `tests/interaction.test.mjs`. Confirmar contatos e realizar homologação no navegador antes de publicar.

## Etapa 03 — Arquitetura modular

HTML formatado nas seis páginas, build de CSS modular e verificação de equivalência de saída em `tests/architecture.test.mjs`. As regras CSS de produção foram preservadas sem alteração. Consulte `docs/etapa-03-arquitetura.md`.

## Etapa 04 — Design System e tipografia

Montserrat continua nos títulos e elementos de navegação; Poppins permanece nos textos corridos. Tokens centrais foram adicionados no módulo final do CSS, e textos auxiliares com contraste insuficiente foram corrigidos. O hero e o carrossel permanecem como aprovados. Consulte `docs/etapa-04-design-system.md`.

## Etapa 05 — Refinamento visual e imagens

Hero principal mais compacto e com imagem inteira; heros internos revisados, artes ilustrativas e campanhas sem zoom/corte intencional, cartões de unidades padronizados e rodapé compacto responsivo. A identidade original e os conteúdos foram mantidos. Consulte `docs/etapa-05-refino-visual.md`. A inspeção visual real e o aceite da branch atual ainda são necessários.

## Etapas 06–08 — Acessibilidade, SEO e homologação

O menu, o carrossel, o lightbox e o formulário tiveram ajustes de UX/acessibilidade. O build passa a gerar dimensões reais das imagens e proteção de indexação nas prévias, com canonical/sitemap apenas após configuração de domínio público validado. O CI em `.github/workflows/quality.yml` testa a navegação modular real e as capturas de 36 cenários. **Produção permanece intacta.** Consulte `docs/etapas-06-08-qa-lancamento.md` para pendências e publicação segura.
