# Etapa 03 — Arquitetura, HTML e CSS

**Repositório:** `Maria621/chroma-v.2`  
**Branch:** `preview/v3-6-etapa3-arquitetura`  
**Base:** `preview/v3-6-etapa2-funcionalidades`

## Escopo aplicado

- HTML fonte formatado e indentado nas seis páginas sem alterar textos, atributos ou relações semânticas.
- Build reformulado com funções pequenas, mensagens de erro explícitas e import do manifesto de estilos.
- CSS fonte V3.6 (83.984 caracteres) separado em seis módulos de responsabilidade progressiva.
- Única saída CSS mantida em `dist/assets/css/site.css`.
- Removida a cópia monolítica `src/styles/site.css` para evitar duas fontes concorrentes.
- Teste automatizado de equivalência do CSS: comprimento, checksum e saída compilada.
- Ordem da cascata preservada byte por byte; scripts de interação, imagens, carrossel e identidade visual não foram modificados.

## Objetivos de aceitação

- [x] Branch separada e base anterior preservada.
- [x] Fonte CSS modular e sem duplicação do monolito.
- [x] HTML legível e reversível para a saída compacta.
- [x] Testes de regressão adicionados.
- [ ] Executar build completo + testes do último commit na Vercel ou localmente.
- [ ] Validar visualmente as seis páginas em 320, 390, 768, 1024, 1440 e 1920 px.
- [ ] Aprovar resultado para eventual merge; produção permanece intocada.

## Limites conscientes

Esta etapa **não** faz deduplicação agressiva das centenas de regras acumuladas. O objetivo imediato era isolar responsabilidades sem introduzir regressões. A análise de CSS morto e os ajustes tipográficos ficam para a etapa de UI/Design System, condicionados a QA visual.
