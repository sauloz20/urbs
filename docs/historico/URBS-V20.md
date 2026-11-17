# URBS V20 — Refinamento do comparador de intervenções

Partindo da URBS V19.9, somente o componente de comparação foi atualizado.

## Melhorias
- Transições sutis de imagens e painel de conteúdo em cada troca de intervenção.
- Realce da alça divisória, fotografia em 16:9, ajustes de contraste e sombra.
- Modo tela cheia usando `<dialog>` nativo; fecha com Esc, botão ou clique no fundo.
- Painel editorial com indicadores mais legíveis e divisórias discretas.
- Miniaturas com títulos compactos e progresso; setas e seleção por teclado.
- Preservadas as URLs documentais e links de origem da V19.9. As fotografias são externas e não estão armazenadas no ZIP.

## Arquivos
- `public/index.html`: markup da seção e do diálogo.
- `public/assets/css/urbs-before-after-v20.css`: estilos isolados.
- `public/assets/js/urbs-before-after-v20.js`: interações isoladas.

## Observações
Imagens das prefeituras podem não carregar quando o serviço remoto estiver indisponível. A correspondência de enquadramento depende da montagem original das fotografias públicas. Mantidos todos os outros arquivos da V19.9, sem alteração nas demais seções.
