# URBS V19.3 — Atlas Urbano / Duas perspectivas

Base: **URBS V19.2 — Living City**, com as demais seções da homepage preservadas.

## Mudanças
- A seção antes dominada pela maquete 3D passa a abrir com **cartografia real 2D** de Montes Claros: imagens de satélite Esri/Maxar, sobreposição de nomes e opção ruas OpenStreetMap.
- **Maquete 3D 360° continua acessível** no seletor superior, com carregamento sob demanda para poupar hardware. Mantém veículos, pedestres, dia/noite, Raio-X, visão de rua, tour e visão aérea.
- Controles 3D agrupados num único menu **Ajustes 3D**. Inspetor 3D escondido até selecionar um ponto.
- Marcadores do mapa usam dados de `window.UrbsData.getAllReports()`; os cinco pontos de exemplo são **fictícios** e registros criados pelo usuário ficam só no navegador.
- A página `mapa.html` da V19 não foi modificada. Carrosséis, modais e globo também foram preservados.

## Importante
- O mapa 2D usa tiles externos e precisa de internet; a maquete 3D usa Three.js via CDN.
- Fotos de satélite são cartografia real. Os pontos demonstrativos e a maquete 3D são **ilustrativos**, sem dados oficiais da cidade.
- Não pressupõe conexão ao backend de `Davi161108/TCC-Project`.

## Instalação
1. Faça backup de `C:\xampp\htdocs\urbs\public`.
2. Copie **o conteúdo** da pasta `urbs_v19_3_atlas_urbano/public/` para `C:\xampp\htdocs\urbs\public`.
3. Acesse `http://localhost/urbs/public/index.html` e pressione `Ctrl + F5`.
4. Verifique a seção 'Uma cidade, outras perspectivas'. Use o seletor Satélite 2D / Cidade 3D 360°.

## Arquivos alterados
- `public/index.html`
- `public/assets/css/urbs-atlas-v19-3.css` (novo)
- `public/assets/js/urbs-atlas-v19-3.js` (novo)
- `public/assets/js/urbs-digital-twin-3d-v19-2.js` (ajuste do inspetor)
