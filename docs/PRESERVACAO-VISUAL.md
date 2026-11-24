# Preservação da versão aprovada — Chroma V.2

Referência: `fb8472251c595914a974362e0f0fb434ef9b8c35` (preview/v3-7-qa-acessibilidade-seo). A branch técnica não substitui o deploy aprovado.

- HTML, imagens, módulos CSS e JS, dados e parciais existentes permanecem byte a byte idênticos.
- A arquitetura src/pages, src/partials, src/styles/modules e src/scripts é mantida; a ordem do manifesto CSS e o build não foram alterados.
- `npm run check:approved` verifica os hashes Git dos arquivos protegidos; `npm run validate` executa build e testes, incluindo a proteção da referência.
- As verificações HTTP e visuais existentes continuam no CI. Ações de checkout, Node e upload foram fixadas por SHA.
- Para uma futura mudança visual autorizada, revise a diferença, execute os testes e atualize a referência somente após aprovação explícita.
- Artefatos de build, relatórios e arquivos de ambiente não devem ser versionados. Nenhuma configuração de publicação ou domínio foi alterada.
