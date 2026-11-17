# URBS V19 — Mapa integrado a partir de Davi161108/TCC-Project

## Comparação das bases

- **TCC-Project (`web/js/app.js`, `web/mapa.html`)**: Leaflet + OpenStreetMap, botões de ruas/satélite, pinos por situação, foco com `flyTo`, localização e integração com API PHP/MySQL. O arquivo `web/mapa.html` isolado usa uma URL de backend absoluta específica daquele projeto.
- **URBS V18**: Leaflet + camadas OSM/Esri, filtros de texto/categoria/situação, lista de ocorrências, geolocalização e armazenamento local com cinco exemplos, sem backend.

## Adaptação realizada

1. Alternância visível RUAS / SATÉLITE, como no TCC-Project (OSM e Esri).
2. Comandos CENTRALIZAR (Montes Claros) e VER PONTOS.
3. Pinos em formato de gota, coloridos por situação; exemplos distinguidos no centro do ícone.
4. `flyTo` ao focar um registro; popup e card sincronizados.
5. Mantidos filtros, busca, lista, status dos registros locais, aviso de dados fictícios, página de cadastro e toda a homepage V18.
6. Preservada a atribuição dos provedores cartográficos; se o satélite falhar, há retorno para o mapa de ruas.

## Limites

**Não foi importada a API do TCC-Project:** usa configuração específica de XAMPP/PHP/MySQL, autenticação e schema próprios. Os registros desta versão da URBS continuam locais e fictícios, como antes. O acesso às camadas externas requer internet. A navegação por teclado e a opção de reduzir movimentos estão mantidas, mas não foi possível testar visualmente no navegador nesta execução.

## Arquivos alterados

- `public/mapa.html`
- `public/assets/js/map.js`
- `public/assets/css/map-davi-integration-v19.css` (novo)

## Instalação

Copie o conteúdo de `public/` para `C:\xampp\htdocs\urbs\public` se o seu projeto estiver nesse layout. Se a pasta clonada do GitHub já apresenta `index.html` na raiz, copie **o conteúdo** de `public/` para a raiz `C:\xampp\htdocs\urbs`, sem criar outra pasta `public`. Use `http://localhost/urbs/mapa.html`. Antes de atualizar uma pasta já existente, guarde backup de alterações locais.
