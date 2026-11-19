# Instituto Chroma — Site institucional (revisão editorial V2.1)

Versão independente, baseada na V2 original, corrigida após auditoria de repetições e informações não confirmadas. **Não foi publicada nem sobreposta à V2 anterior.**

## Abrir o site

Abra `index.html` no navegador. As seis páginas possuem arquivos HTML próprios e navegação interna. Para que `conteudo/novidades.json` atualize automaticamente os comunicados, sirva a pasta por HTTP/HTTPS; ao abrir diretamente os arquivos, os conteúdos de notícias já existentes no HTML permanecem visíveis.

## Correções aplicadas

- **Início:** removidas seções que reapresentavam a essência e a metodologia; mantidas abertura institucional, carrossel inclinado e área única de notícias.
- **A Chroma:** retirada a duplicação da missão/propósito; preservadas missão, visão, valores oficiais e linha do tempo horizontal, claramente rotulada como registros pedagógicos de 2026, não como história fundacional.
- **Nosso Trabalho:** retirado o segundo bloco que repetia programação, games e empreendedorismo; mantida uma área de exemplos práticos e a apresentação do acompanhamento pedagógico.
- **Projetos e Parcerias:** retirado o catálogo repetido de projetos de sala e a afirmação sobre instituição externa sem documentação confirmada. A página agora é dedicada a parcerias externas, com pendências documentais explícitas.
- **Unidades:** retiradas as referências não confirmadas a Sorocaba e “Outras unidades”, endereços presumidos e links de rota. Diadema aparece somente como localidade identificada em artes enviadas, sem endereço final de visita.
- **Contato:** removido o formulário desabilitado e os contatos não validados. Mantido o Instagram `@escola_chroma` como link funcional já conhecido.
- **Campanhas:** uma única seção mostra Presença Premiada, Consciência Negra e novidades de Natal. O carrossel inclinado contém peças distintas, sem repetir as três campanhas da seção de notícias.
- **Marca:** logotipo real **Instituto Chroma**, enviado no projeto, substitui a versão antiga com outra assinatura; a imagem foi mantida com suas cores e proporção originais.

## Restrições que permanecem em vigor

O site **não é loja de cursos**: não inclui preços, promoções de matrícula, catálogos comerciais ou checkout. Cada página tem finalidade editorial própria, conforme `MATRIZ_EDITORIAL.md`. Não devemos exibir nome de parceiro, data institucional, resultados, endereço ou unidades sem confirmação. As artes ilustrativas e conceituais não devem ser tratadas como fotografias documentais de alunos, professores ou instalações reais.

## Pendências antes da publicação

1. Fotografias reais autorizadas dos ambientes, atividades e equipe.
2. História institucional, marcos de fundação e expansão, com datas confirmadas.
3. Parcerias e projetos externos com documentação, fotos e permissões de divulgação.
4. Lista oficial de unidades com endereços, mapas, horários e contatos confirmados.
5. Telefone, e-mail e WhatsApp institucionais; eventual formulário só com integração real, segurança e informações de privacidade.
6. Auditoria final de WCAG, SEO, LGPD, Lighthouse, dispositivos físicos e endereço de produção.

## Arquivos

`index.html`, `a-chroma.html`, `nosso-trabalho.html`, `projetos-e-parcerias.html`, `unidades.html`, `contato.html`, `styles.css`, `site.js`, `conteudo/novidades.json`, `assets/`, `MATRIZ_EDITORIAL.md`.

## QA executado

Verificação estática de seis páginas, navegação interna, existência dos arquivos de imagem e sintaxe do JavaScript. Renderização isolada de 1440, 390 e 320 px, sem rolagem horizontal ou erros JavaScript observados. Testes interativos do menu mobile, carrossel e linha do tempo realizados; não houve teste público ou publicação. Imagens lazy-load fora da área inicial são carregadas conforme a rolagem, e as verificações de produção continuam pendentes.
