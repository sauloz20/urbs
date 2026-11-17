# URBS V19.6 — Arquivo Urbano / Antes e Depois fotográfico

## O que mudou
A seção `#experiencia` agora apresenta um carrossel editorial **manual**, com lista vertical de três casos à esquerda e duas fotografias lado a lado (antes e depois) à direita. Não há autoplay, movimento infinito ou novas faixas horizontais. Navegação por clique e setas; layout empilha as fotografias em telas pequenas.

As fotografias são **registros reais** de obras urbanas publicados por órgãos públicos. Cada caso usa a composição fotográfica oficial de duas imagens, separando suas metades superior e inferior com CSS para apresentar o ANTES e o DEPOIS.

**Importante:** os casos são de Curitiba/PR e Fortaleza/CE, **não** de Montes Claros/MG e **não** são obras da URBS. A URBS é um projeto acadêmico independente.

## Créditos e fontes das fotografias

1. **Rua Clothilde Hachenberg Monastier — Curitiba/PR**: Prefeitura de Curitiba / SMCS. https://www.curitiba.pr.gov.br/noticias/antes-e-depois-veja-como-ficou-rua-de-curitiba-transformada-por-obra-da-prefeitura/73095  
   Fotografia comparativa: https://mid-noticias.curitiba.pr.gov.br/2024/00441623.jpg
2. **Rua Lionidetti Sovinski Pacheco — Curitiba/PR**: Prefeitura de Curitiba / SMCS. https://www.curitiba.pr.gov.br/noticias/antes-e-depois-rua-de-curitiba-e-transformada-com-asfalto-e-sistema-de-drenagem/72588  
   Fotografia comparativa: https://mid-noticias.curitiba.pr.gov.br/2024/00433866.jpg
3. **Rua Expedito Madruga Monte — Fortaleza/CE**: Prefeitura de Fortaleza. https://www.fortaleza.ce.gov.br/noticias/obras-de-drenagem-e-saneamento-vao-beneficiar-65-ruas-no-canindezinho  
   Fotografia comparativa: https://www.fortaleza.ce.gov.br/images/images1/0000Janeiro2022/06%2001%202022%20rua%20Expedito%20Madruga%20Monte%20ante%20depois.jpeg

## Requisitos e limitações
As imagens são carregadas das fontes externas; o site precisa de conexão com a internet. A disponibilidade depende dos sites das prefeituras. Caso o site seja publicado, verifique as condições de reutilização das imagens junto às fontes; citar os créditos não substitui autorização quando necessária. O projeto não modifica as fotografias além do recorte visual.

## Instalação
Copie o conteúdo da pasta `public` deste pacote para `C:\xampp\htdocs\urbs\public`, substituindo os arquivos antigos. Entre em `http://localhost/urbs/public/index.html` e atualize com Ctrl+F5.

## Arquivos principais modificados
- `public/index.html`
- `public/assets/js/urbs-before-after-v19-6.js`
- `public/assets/css/urbs-before-after-v19-6.css`

Os carrosséis preexistentes, o mapa de ocorrências, login, registro e modais foram preservados.
