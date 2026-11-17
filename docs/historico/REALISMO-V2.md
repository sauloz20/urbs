# URBS — Terra cinematográfica V2

## O que mudou

- Textura geográfica realista baseada na imagem Blue Marble Next Generation distribuída com Basemap (NASA / Earth Observatory).
- Relevo visual baseado em ETOPO1, usado como modulação de cor (não é uma malha de terreno 3D).
- Camada semitransparente de nuvens geradas proceduralmente, com movimento próprio.
- Iluminação de dia/noite por shader, atmosfera e reflexos sutis em água.
- Luzes de cidades **ilustrativas** derivadas de coordenadas conhecidas; **não são dados reais de satélite**.
- Animação de inversão do globo na alternância entre login e cadastro.
- Aproximação de câmera e passagem pelo globo, seguida por transição visual ao mapa.
- Texturas locais em `public/assets/textures/` para não depender de hospedagem externa de imagens.

## Limites

A tela demonstra uma experiência visual. Não existe autenticação real, criação de contas, armazenamento ou envio de senha. Nenhum sucesso de login é simulado como verificação de credenciais. A câmera aproxima a superfície da Terra de maneira cinematográfica, mas não georreferencia Montes Claros em uma imagem de satélite de alta resolução.

É preciso carregar Three.js e GSAP pelas URLs CDN usadas em `public/login.html` (conexão com a internet). Se WebGL estiver indisponível, o formulário ainda pode ser usado com fundo estático e transição simplificada.

## Instalar

Extraia a pasta `public` do ZIP como `C:\xampp\htdocs\urbs\public` e acesse `http://localhost/urbs/public/login.html`.

Se sua instalação atual estiver diretamente em `C:\xampp\htdocs\urbs`, copie **o conteúdo** de `public` para essa pasta e acesse `http://localhost/urbs/login.html`.

## Créditos visuais

Blue Marble Next Generation e ETOPO1 incluídos a partir do conjunto de imagens do pacote de dados Basemap. Consulte os termos das fontes originais para redistribuição em outros produtos.
