# Chroma V3.5 — Registro de QA e engenharia

## Problemas corrigidos

| Classificação | Problema na V3.4 | Solução na V3.5 |
|---|---|---|
| P0 | Texto escuro sobre painel azul na chamada final de Unidades | Contraste estável para título, destaque, corpo e link; espaçamento interno corrigido |
| P1 | Link `projetos-e-parcerias.html#nexus` sem âncora | Destino corrigido para `projetos-e-parcerias.html`; o bloco Nexus permanece em Nosso Trabalho |
| P1 | Indicadores e botões pequenos | Alvos interativos de 44×44 px para navegação e ações relevantes |
| P1 | Quatro CSS sequenciais e dois JS com múltiplos listeners | Uma folha CSS consolidada; módulos JavaScript com responsabilidades únicas |
| P1 | Cabeçalho/rodapé duplicados em seis páginas | Componentes compartilhados gerados em build estático |
| P2 | CTA na página Contato apontava para ela mesma | CTA conduz ao formulário `#chromaContactForm` |
| P2 | Imagens simulavam botões com `role=button` no próprio `img` | Botões semânticos com foco visível e lightbox em `dialog` |
| P2 | Agenda histórica e galeria com controles sobrepostos em scripts diferentes | Controladores únicos com estado acessível e teclado |
| P2 | Linha do tempo podia saltar para o elemento quando inicializada no celular | Rolagem automática somente após interação deliberada |
| P2 | Falta de testes automatizados básicos | Suíte Node integrada ao build e testes visuais/funcionais via Playwright |

## Resultado da revisão local

- **6 páginas** geradas pelo build.
- **5 testes de integração estática** aprovados, incluindo links, âncoras, arquivos, estrutura compartilhada e correções críticas.
- **36 combinações de página e largura de tela** (320, 390, 768, 1024, 1440 e 1920 px) examinadas com Chromium.
- **0 exceções JavaScript** registradas; **0 imagens essenciais quebradas**, **0 controles menores que 24 px** e **0 elementos efetivamente escapando da área visível** após considerar decorações recortadas pelos seus contêineres.
- Menu móvel, carrossel (setas, indicadores), ampliação de imagens, cronologia e controles de unidades testados localmente.

**Limites destes testes:** navegador renderizado por documento e assets incorporados no ambiente isolado; os scripts são reunidos para a inspeção local. A resolução dos imports ES Modules e caminhos também é verificada na estrutura de arquivos. Não foi realizada medição de Lighthouse, nem auditoria completa com leitor de tela, nem verificação do endereço público.

## Pendências para publicação definitiva

- Conferir a cronologia dos dez anos e políticas de bolsas com a direção.
- Substituir ilustrações de fachadas por fotos reais autorizadas, preservando os avisos até lá.
- Validar dados institucionais, rotas de atendimento e política de privacidade.
- Revisar `noindex,nofollow` e metadados de SEO quando houver aprovação para produção.

A V3.5 é uma **candidata de prévia**, não uma declaração de 100/100 ou conclusão da validação factual.
