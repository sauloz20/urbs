# URBS V10.1 — correção de rolagem e seções invisíveis

- Recupera a rolagem nativa da homepage, sem interceptação de eventos por Lenis.
- Desativa revelações que podiam manter conteúdo oculto em caso de falha no ScrollTrigger/AOS.
- Preserva Swiper, Embla, Splide, Plyr, Video.js, GLightbox e o globo/Cesium da tela de login.
- O CSS de segurança deixa seções visíveis mesmo sem JavaScript ou com CDN indisponível.
- A animação de chegada da homepage continua e mantém encerramento de segurança.

Instalação: copie o conteúdo de `public/` para a pasta `public/` usada no XAMPP, substituindo os arquivos. Force a atualização do cache com Ctrl+F5.

O layout de login é independente e não foi alterado.
