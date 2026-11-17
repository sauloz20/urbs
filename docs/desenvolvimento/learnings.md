# URBS — refinamento visual (2026-11-16)

## Solicitação atual
- Adicionar carrossel com imagens na seção da página inicial “Simples para participar. Organizado para entender.”
- Remover numerações editoriais como 01, 02, 03 de todas as páginas.
- Remover do topo da página inicial o mapa demonstrativo/fictício.
- Integrar bibliotecas GSAP, AOS, Motion, Three.js, Vanilla Tilt, Vanta.js, Swiper.js, Lenis e Lottie com efeitos visuais coerentes e discretos.
- A imagem de referência anexada mostra o bloco de passos numerados a ser redesenhado. Não reabrir/inspecionar o anexo usando o utilitário `file`.

## Restrições e contexto preservados
- Continuar no projeto gerenciado `/home/ubuntu/urbsweb`.
- O mapa principal e os registros demonstrativos continuam claramente identificados como locais/fictícios; não remover o mapa da página `/mapa.html`.
- Remover somente o mapa de prévia da abertura da home, mantendo CTA para abrir o mapa completo.
- A área piloto continua Montes Claros — MG; não gerar imagens que finjam retratar locais reais reconhecíveis da cidade.
- Projeto estático HTML/CSS/JS; não adicionar backend, persistência remota ou dependências de credenciais sem necessidade.
- Configuração de publicação automática era desligada; não publicar.

## Decisões provisórias de implementação
- Reutilizar o CSS, GSAP/ScrollTrigger e carregamento local/de CDN existente, após inspecionar os arquivos.
- Carrossel Swiper acessível, com navegação e texto alternativo; criar imagens editoriais genéricas da infraestrutura urbana, não fotografias atribuídas a Montes Claros.
- Configurar uma utilização pequena e deliberada de cada biblioteca solicitada, reduzir motion com `prefers-reduced-motion`, lazy-load bibliotecas que não sejam críticas e evitar múltiplos sistemas concorrentes de scroll/animação.
