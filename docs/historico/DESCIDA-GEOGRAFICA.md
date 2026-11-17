# URBS — descida geográfica V4

## O que muda

Mantém-se a tela de login/cadastro V3 (Three.js/GSAP). Ao enviar os formulários de demonstração, abre-se uma nova cena CesiumJS, georreferenciada, com trajeto da órbita à América do Sul, Minas Gerais e Montes Claros (-16.7286, -43.8578). O usuário pode pular a introdução. O destino é `mapa.html`.

## Modos disponíveis

- **Padrão, sem chaves:** CesiumJS + imagens geográficas públicas do OpenStreetMap projetadas no globo 3D. As localizações são reais, mas não existem edifícios fotogramétricos nem relevo detalhado.
- **Cesium ion (opcional):** informe `cesiumIonToken` em `public/assets/js/geo-config.js` para habilitar Cesium World Terrain, sujeito a disponibilidade e limites do serviço.
- **Google Photorealistic 3D Tiles (opcional):** habilite a **Map Tiles API** com faturamento no Google Cloud e informe `googleMapsApiKey`. A aplicação tentará carregar os tiles e mostrará as atribuições. A cobertura fotogramétrica pode ser limitada em Montes Claros. Consulte os termos atuais e exija Google geocoder quando aplicável.

**Segurança:** chaves de navegador não são secretas; restrinja por domínios autorizados e APIs, configure cotas e alertas de custos. Nunca use tokens privilegiados aqui. A API do Google pode cobrar por requisições.

## Instalação XAMPP

Copie `public/` para `C:\xampp\htdocs\urbs\public\` e acesse `http://localhost/urbs/public/login.html`. Necessita de acesso à internet para CesiumJS e mapas. Se a CDN ou os serviços falharem, uma transição visual abre o mapa do URBS.

## Arquivos

- `public/assets/js/geo-descent.js`: inicialização Cesium, câmera, seis etapas, pular e fallback.
- `public/assets/js/geo-config.js`: chaves opcionais e coordenadas.
- `public/assets/css/geo-descent.css`: overlay cinematográfico e responsivo.
- `public/login.html`: cena Cesium e interface de progresso.
- `public/assets/js/auth-globe.js`: mantém login/cadastro e aciona a nova descida.

Login e cadastro **continuam protótipos visuais**. Nenhuma senha é enviada, nenhuma conta é criada, nenhuma autenticação é realizada. A viagem é uma simulação guiada por coordenadas, não uma animação de voo físico ou visita real a cada altitude.
