# URBS V8 — chegada cinematográfica ao mapa

- O voo Cesium foi reduzido de 16 para **6 segundos de movimento de câmera**. O carregamento do Cesium e imagens externas, além do desaparecimento inicial do formulário, pode acrescentar tempo de espera dependendo da rede.
- A câmera utiliza keyframes geográficos interpolados (sem paradas) de Terra, América do Sul, Brasil, Minas Gerais e Montes Claros.
- No final, um véu escuro de aproximadamente 280 ms cobre o salto entre os dois renderizadores. A página `mapa.html` reconhece a origem da navegação por um sinal temporário em `sessionStorage` e revela gradualmente o mapa e sua interface.
- Os créditos e atribuições de mapas permanecem visíveis nos respectivos componentes.
- `public/assets/js/geo-config.js` permite ajustar `flightDurationSeconds`.
- Não existe autenticação de usuários; a viagem é demonstrativa.
- A continuidade entre Cesium e Leaflet é uma transição visual, não uma transferência real da câmera ou renderização compartilhada. O enquadramento final de Cesium aproxima Montes Claros; o mapa Leaflet inicia na mesma cidade com zoom 13.
