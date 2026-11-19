# Instituto Chroma — site institucional V3.5

Site institucional multipágina da Chroma. Esta versão consolida a V3.4 sem alterar os textos institucionais aprovados. A publicação é feita a partir de HTML estático, com componentes reutilizáveis e JavaScript modular.

## Estrutura

- `src/pages/`: conteúdo HTML original de cada uma das seis páginas, com marcações para o cabeçalho/rodapé compartilhados.
- `src/partials/`: cabeçalho e rodapé únicos, reutilizados no build.
- `src/styles/site.css`: **única fonte de CSS** (CSS de versões anteriores consolidado e regras não utilizadas removidas; tokens e ajustes de acessibilidade no final). Não criar novos arquivos `v36.css`, `v37.css` etc.
- `src/scripts/components/`: navegação, carrossel, linha do tempo, lightbox, unidades, contato e notícias com responsabilidades separadas.
- `src/data/timeline.js`: dados da linha do tempo editorial.
- `assets/` e `conteudo/`: imagens oficiais, artes ilustrativas e registro estático das campanhas já existentes no repositório. No ZIP, há cópias sob `public/` para montar o build de forma independente.
- `scripts/build.mjs`: compilador sem dependências externas que une os parciais e produz `dist/`.
- `tests/project.test.mjs`: testes de referências internas, integridade de recursos, estrutura, CTA e contrastes críticos.
- `tests/visual_qa.py`: roteiro de QA visual e funcional local para Chromium + Playwright, sem depender de um domínio público.

## Executar

Requer Node.js 20 ou superior.

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
3. Não colocar dados fictícios de histórico ou fotos ilustrativas como registros documentais. A cronologia é editorial provisória, e imagens sintéticas de unidades e salas devem continuar identificadas como ilustrativas até a chegada de fotografias reais autorizadas.
4. A página Contato apenas **prepara uma mensagem para o WhatsApp**: o envio depende da confirmação do visitante no aplicativo. Não há envio de e-mail em servidor.
5. As páginas de prévia têm `noindex,nofollow`; isso deve ser revisto junto com SEO, política de privacidade e informações oficiais antes de produção.

A produção V2.2 e as versões de prévia anteriores não devem ser sobrescritas sem aprovação explícita.
