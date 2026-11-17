# URBS V10 — Carrosséis, mídia e animações

O projeto continua um protótipo acadêmico. Sem dados de servidor ou autenticação real.

## Bibliotecas integradas

- Swiper: carrossel de categorias já existente, preservado.
- Embla Carousel 8.6: novo carrossel editorial “As ruas contam histórias”.
- Splide 4.1: novo carrossel acessível de recursos, com 3/2/1 cards responsivos.
- GSAP/ScrollTrigger: animações hero/parallax já existentes.
- AOS: revelações progressivas.
- Motion: microinterações do painel existente.
- Plyr: player principal de vídeo original URBS.
- Video.js: player alternativo disponível em botão no mesmo vídeo; um player por vez.
- GLightbox: tela ampliada para vídeo e fotografia Blue Marble.
- Lite YouTube Embed: integração preparada; inserir um ID *verificado* em `assets/js/media-experience.js` quando houver conteúdo URBS real. Sem vídeo não criamos incorporação fictícia.

## Novo conteúdo

Narrativas editoriais, recursos da plataforma, mídia ilustrativa original, galeria com lightbox.
O vídeo `public/assets/media/urbs-movimento.mp4` é um motion graphic conceitual original (sem filmagem de Montes Claros).

## Personalização

- `public/assets/css/media-experience.css` — design das novas seções.
- `public/assets/js/media-experience.js` — inicializações e opções.
- `public/index.html` — marcação.

Os indicadores decorativos numéricos de seções, cards e formulários foram retirados. Datas, coordenadas e números com função informativa foram preservados.

## Instalação

Copie o conteúdo de `public/` sobre a pasta do projeto no XAMPP (faça backup se editou algo recentemente). Carrosséis e players dependem de CDN; o arquivo de vídeo local já acompanha o ZIP.

## Testes

Verifique todos os novos carrosséis com mouse/teclado/toque; abra o vídeo Plyr, alterne para Video.js e volte; abra o vídeo e a imagem no GLightbox; confira a home em 375px, 768px, desktop; confirme o comportamento sem as CDNs.
