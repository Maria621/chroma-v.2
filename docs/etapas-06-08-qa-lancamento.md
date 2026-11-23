# Instituto Chroma — Etapas 06, 07 e 08

**Escopo:** conclusão das correções de UX, acessibilidade, desempenho, SEO técnico e QA da V3.7.  
**Branch:** `preview/v3-7-qa-acessibilidade-seo`  
**Base:** `preview/v3-6-etapa5-refino-visual`  
**Produção:** não alterada.

## 06 — UX, acessibilidade e responsividade

- Menu móvel impede interação no conteúdo de fundo, mantém foco em controles visíveis, fecha com Escape e restaura foco no logo quando o layout muda para desktop.
- Conteúdo móvel do menu tem rolagem própria e itens com altura mínima de toque.
- Carrossel identifica semanticamente cada imagem e associa os botões de navegação aos respectivos itens, mantendo o anúncio do contador.
- Lightbox declara a modalidade de diálogo e mantém fechamento por Escape.
- Formulário relaciona a orientação sobre unidades ao campo de seleção por `aria-describedby`; não tenta encaminhar Valinhos para números de outras unidades.
- Botão de retorno ao topo só participa da navegação por teclado quando está visível.
- Focos visíveis, redução de animações e correções de leitura na viewport estreita foram acrescentados ao módulo CSS existente, sem modificar as cores aprovadas.

## 07 — Desempenho, SEO e segurança

- O build lê as dimensões intrínsecas reais dos arquivos PNG, JPEG e WebP e as injeta no HTML de saída (`width`/`height`). Isso permite ao navegador reservar a proporção correta da imagem e reduz oportunidades de deslocamento de layout. **Não redimensiona os arquivos.**
- O feed estático de novidades respeita a política padrão de cache HTTP, sem a opção anterior `no-store`.
- As seis páginas de prévia preservam a meta `noindex,nofollow`.
- `robots.txt` é gerado em todos os builds; `sitemap.xml`, canonical, `og:url`, metadados sociais absolutos e dados estruturados institucionais são gerados **somente** quando a publicação é explicitamente habilitada.
- `vercel.json` inclui `Permissions-Policy` para desativar recursos de câmera, microfone e geolocalização não utilizados.

### Regras para eventual publicação pública

Habilitar indexação exige, **ambas**, as variáveis abaixo no ambiente de produção, após aprovação:

```ini
CHROMA_PUBLISH=true
CHROMA_PUBLIC_URL=https://DOMINIO-OFICIAL-CONFIRMADO
```

O build rejeita domínio `*.vercel.app`, `http://`, URLs com caminhos/credenciais e qualquer tentativa de publicar com `VERCEL_ENV=preview`. Não configurar esses valores na branch de revisão. Os dados estruturados incluem somente o nome, a fundação em 2016 e o Instagram institucional informados pela equipe, sem endereços ou resultados de projetos não confirmados.

## 08 — QA e homologação

- Vercel executa `npm run build && npm test` a cada deploy.
- `tests/seo.test.mjs`: proteção contra indexação indevida, canonical, sitemap e cabeçalhos.
- `tests/image-dimensions.test.mjs`: dimensões reais nas imagens, inclusive os formatos WebP de uso institucional.
- `tests/runtime_smoke.py`: Chromium em servidor HTTP local para comprovar importação de JS modular e interações reais.
- `tests/visual_qa.py`: 6 páginas × 6 larguras (320, 390, 768, 1024, 1440 e 1920 px); gera screenshots, relatório JSON e encerra com falha quando encontra problemas críticos.
- `.github/workflows/quality.yml`: CI GitHub Actions com Node 22, Chromium e artefatos para inspeção visual.

## Checklist de homologação da versão

- [x] Branch exclusiva, produção preservada.
- [x] Correções de código e testes adicionados.
- [ ] Confirmar que o **último commit** possui build Vercel com 0 falhas.
- [ ] Confirmar execução do GitHub Actions (QA em Chromium e capturas).
- [ ] Revisar screenshots em viewport móvel e desktop: hero, banners, unidades e rodapé.
- [ ] Testar clique real nos contatos oficiais e confirmar os números existentes.
- [ ] Confirmar endereço, imagens e contato próprios da unidade Valinhos.
- [ ] Validar com a gestão detalhes e datas da OBA, olimpíadas e demais projetos antes da divulgação.
- [ ] Validar termos/privacidade aplicáveis e o domínio oficial para publicação.
- [ ] Aprovar visualmente antes de promover/mesclar com a branch de produção.

## Limites conscientemente respeitados

O formulário prepara a mensagem no WhatsApp, mas **não** envia e-mails nem guarda dados em banco. A V3.7 não altera essa decisão de produto sem nova especificação. As ilustrações existentes continuam descritas como ilustrações; não foram substituídas por supostas fotos reais. Não são declaradas métricas LCP, CLS, INP, Lighthouse ou conformidade WCAG integral sem testes medidos.
