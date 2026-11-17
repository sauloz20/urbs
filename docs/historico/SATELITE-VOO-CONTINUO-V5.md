# URBS V5 — Descida contínua e satélite

## O que mudou

- A viagem tem **uma única animação contínua de 11 segundos**, sem cinco voos diferentes nem esperas intermediárias.
- A trajetória parte da órbita, move-se em direção ao Brasil e termina em Montes Claros (-16.7286, -43.8578), com velocidade e altitude interpoladas continuamente. Textos de progresso não afetam o voo.
- A camada de chegada do Cesium usa **Esri World Imagery (satélite)** em vez do mapa de ruas, quando o provedor responde.
- `mapa.html` agora abre com **satélite por padrão**, com rótulos de lugares sobrepostos quando disponíveis; menu de camadas permite escolher **Ruas**.
- Fallback para OpenStreetMap em caso de falha ao inicializar o satélite e botão para pular a introdução.

## Ajustar a duração

Edite `public/assets/js/geo-config.js`:

```js
flightDurationSeconds: 11,
```

Valores próximos de 10 a 14 segundos equilibram ritmo e compreensão. O código limita a duração mínima a 7 segundos.

## Licenças, serviços e limites

As imagens Esri World Imagery são de um serviço remoto. Seu uso depende das políticas, disponibilidade, cobertura, atribuição e eventuais requisitos de autenticação do provedor. Não são fotos do Google Earth nem asseguram a mesma aparência da captura fornecida. Crédito dos provedores aparece no mapa; não o remova. Uma implementação pública/produção deve revisar termos e autenticação/licença adequados ao volume esperado.

Google Photorealistic 3D Tiles e Cesium World Terrain continuam opcionais e exigem chaves/configuração específica. O padrão por satélite é raster 2D sobre a esfera, não prédios fotogramétricos em 3D.

## Rodar localmente

Coloque a pasta `public` em `C:\xampp\htdocs\urbs\public` e abra `http://localhost/urbs/public/login.html`. A internet é necessária para bibliotecas CDN e mapas.

## Estado

O formulário continua um protótipo visual sem autenticação, criação de usuários ou gravação de senha. A sintaxe foi verificada mas a renderização precisa ser validada no navegador com conectividade.
