# Manutenção estrutural V2

Base: `5ff370f36488d3812f704c1017afc82687ee6053`.

- HTMLs, CSS e JavaScript formatados sem redesenho intencional.
- CSS e JS em diretórios próprios; caminhos HTML e imagem CSS atualizados.
- Ordem da cascata e seletores de animação preservados.
- Requisições de campanhas limitadas a páginas que possuem slots.
- Variáveis não reatribuídas com const; contador derivado dos dados.
- Documentos históricos preservados.

Validação estática: HTML balanceado, comparação de tokens CSS/JS, análise sintática JS e referências locais verificadas. Teste visual e interativo em navegador/preview pendente. Não publicar sem essa etapa.
