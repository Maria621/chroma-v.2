# Etapa 02 — QA de funcionalidades e navegação

**Base:** `preview/v3-6-etapa1-historia`  
**Branch de revisão:** `preview/v3-6-etapa2-funcionalidades`

## Alterações implementadas

### Contato e roteamento

- Formulário separa Diadema, Itavuvu e Pannunzio.
- As duas unidades de Sorocaba utilizam o canal já exibido no projeto anterior. **Os números ainda aguardam reconfirmação oficial.**
- Valinhos é mostrada como opção indisponível, pois não há contato próprio confirmado.
- Nenhuma unidade desconhecida é silenciosamente roteada para Diadema.
- Nome e mensagem com apenas espaços são rejeitados.
- O WhatsApp abre com a unidade de interesse explícita na mensagem.
- O link de recuperação fica sempre disponível depois que a mensagem é preparada, independentemente do retorno de `window.open`, que pode ser `null` com `noopener`.
- O envio só ocorre quando a pessoa confirma no aplicativo WhatsApp.
- Sem JavaScript, o botão de envio fica desativado para não enviar dados acidentalmente por GET; os canais diretos permanecem disponíveis.

### Interação e acessibilidade

- O menu móvel isola temporariamente o conteúdo de fundo enquanto está aberto, fecha com Escape e restaura o foco ao fechar ou mudar para desktop.
- A linha do tempo relaciona dinamicamente a aba ativa ao painel por `aria-labelledby`, mantendo o conteúdo dos quatro anos da Etapa 01.
- Botão copiar endereço restaura o foco depois da alternativa de cópia.
- O carrossel passa a calcular a largura de seu indicador de progresso conforme a quantidade real de imagens.
- As âncoras respeitam o espaço do cabeçalho sticky no desktop e celular.

### Preservado

O design aprovado, as seis páginas, imagens, logotipos, títulos, CTA, carrossel inclinado, lightbox, a cronologia confirmada e o estilo geral não foram redesenhados.

## Verificações

- `tests/interaction.test.mjs`: quatro casos de regressão, executáveis via `npm test` após `npm run build`.
- `tests/visual_qa.py`: ampliado para inspecionar isolamento do menu, ligação entre aba e painel da timeline e rota do WhatsApp para Pannunzio sem abrir o aplicativo externo.
- A checagem estática e inspeção do código não substituem a execução do navegador real, as condições de rede, a confirmação de telefones e a acessibilidade assistiva.

## Pendências

- Confirmar o canal dedicado de Valinhos e os telefones das outras unidades.
- Confirmar a forma de atendimento de Pannunzio com a gestão.
- Executar `npm run build && npm test` e `npm run qa:visual` no ambiente que permita compilar e executar Chromium.
- Publicar/validar uma nova prévia quando a cota de deployments da Vercel estiver disponível.
- Não enviar a branch para produção sem homologação.
