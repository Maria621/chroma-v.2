# Instituto Chroma — Etapa 05: refinamento visual e imagens

**Branch:** `preview/v3-6-etapa5-refino-visual`  
**Base:** `preview/v3-6-etapa4-design-system`  
**Status:** implementação em prévia; publicação em produção não autorizada.

## Objetivos do refinamento

Ajustar a experiência visual do site multipáginas sem alterar textos, imagens oficiais, identidade azul/amarela, família tipográfica ou interações aprovadas.

| Área | Antes | Implementação |
| --- | --- | --- |
| Hero da página inicial | Altura mínima em torno de 670px em desktop e 650px em celular, com imagem lateral em `object-fit: cover` | Altura mais moderada com `clamp`, espaço condicionado ao conteúdo, `object-fit: contain` e máscara suave lateral |
| Heros internos | Padrões de altura extensa e recorte amplo | Altura máxima de referência menor e posição da foto decorativa ajustada |
| Imagens ilustrativas institucionais | `cover` e zoom no hover podem esconder conteúdo da ilustração | Proporção 4:3/16:10, `contain`, fundo azul de apoio e sem zoom |
| Cartões das unidades | Proporção mais quadrada e fotos parcialmente cortadas | Área 16:10, imagem inteira, zoom removido, legenda mantida |
| Artes de campanhas e novidades | Artes completas, mas com zoom sutil no hover | Imagem inteira em `contain`, indicador de proporção já estabelecido (1896/829), zoom removido |
| Rodapé | Compacto, porém links podem ficar apertados em telas menores | Espaçamento mínimo ajustado e quebra responsiva sem adicionar conteúdo |
| Carregamento | Foto principal sem prioridade explícita | `fetchpriority="high"`, `loading="eager"`, `decoding="async"` no hero; demais `decoding="async"` quando faltava |

## Arquivos

- `src/styles/modules/08-visual-refinement.css`: regras finais e consultas responsivas de 1000, 760 e 460 pixels.
- `src/styles/manifest.mjs`: oitavo módulo, depois do Design System.
- `src/pages/`: prioridade e decodificação de imagens; texto alternativo atualizado na unidade Pannunzio.
- `tests/architecture.test.mjs`: ordem dos oito módulos e checksum preservado do Design System da Etapa 04.
- `tests/visual-media.test.mjs`: testes de composição, preservação das artes, prioridade das imagens e rodapé.
- `tests/visual_qa.py`: registra objeto-foco (`object-fit`), altura do hero e checa se textos permanecem dentro do bloco em 36 combinações de páginas e larguras.

## Critérios de aceite antes de merge/publicação

- [ ] `npm run build && npm test` com 0 falhas no último commit.
- [ ] Executar `npm run qa:visual` com Chromium, incluindo 320, 390, 768, 1024, 1440 e 1920px.
- [ ] Conferir capturas lado a lado: nenhuma palavra cortada, botão sobre imagem nem área vazia excessiva no hero.
- [ ] Revisar as peças de campanhas para garantir que todo texto esteja visível.
- [ ] Comparar rodapé em 320px e 1440px: sem expansão desnecessária ou corte de links.
- [ ] Validar desempenho real (LCP, CLS e carregamento da imagem principal) no domínio de prévia.

## Limitações e pendências

1. **Qualidade real da imagem:** CSS não adiciona resolução ou autenticidade às imagens. Fotografias reais autorizadas podem substituir as ilustrações conceituais em revisão futura, sem tratar imagens ilustrativas como registros fotográficos.
2. A área da foto decorativa nos heros internos ainda pode usar `cover` intencionalmente. A imagem principal da home e os cards informativos foram priorizados para preservação integral.
3. Não foi realizado um teste visual humano sobre a publicação mais recente nesta implementação; o script automatizado e a inspeção do navegador ainda precisam ser executados.
4. Não alterar a branch `main` nem publicar em produção antes do aceite.
