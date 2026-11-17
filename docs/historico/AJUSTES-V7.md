# URBS V7 — refinamentos do login e da viagem

- Tela de login/cadastro sobre fundo preto, sem fundo, blur, borda ou sombra na caixa.
- Após validar o formulário demonstrativo, formulário, cabeçalho e rodapé somem ANTES de abrir a cena Cesium.
- Sequência de câmera com pontos geográficos: África/Atlântico → Brasil → Minas Gerais → Norte de Minas → Montes Claros, em um único movimento com interpolação contínua. Duração padrão: 16 segundos (`public/assets/js/geo-config.js`).
- Arraste o planeta com o mouse; a rotação automática retorna após ~2,2 s sem interação. O parallax de mouse continua.

**Limitações**: a viagem depende da conexão de rede, da disponibilidade das imagens Esri e do desempenho da GPU. Os rótulos indicam as regiões que estão sendo enquadradas, não uma simulação física de reentrada. Login e cadastro continuam como demonstração sem autenticação real. O serviço de imagens pode não conter o mesmo nível de detalhe em todas as altitudes.

Abra `http://localhost/urbs/public/login.html` com Apache ligado. Os créditos cartográficos devem continuar visíveis.
