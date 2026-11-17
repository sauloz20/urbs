# URBS V11 — Urban Experience

Homepage reconstruída, preservando `login.html`, `mapa.html`, `registro.html` e a viagem 3D de 6 segundos para a homepage.

## Tecnologias
- Three.js: maquete tridimensional **conceitual** de infraestrutura urbana, com arrasto do mouse, iluminação e partículas. Não reproduz a geometria real de Montes Claros.
- GSAP: animação sutil de abertura (opcional).
- Leaflet: prévia geográfica de Montes Claros com os dados demonstrativos existentes.
- CSS: hero editorial cinematográfico, manifesto, galeria horizontal com scroll nativo, painel do território, passos e CTA.

## Estabilidade
Nenhum bloco depende de JS para ficar visível; scroll é nativo, não usa Lenis/AOS. A experiência 3D tem fallback CSS, pausa de renderização fora de vista e é desabilitada em `prefers-reduced-motion`.

## Observações
Fotografias editoriais remotas são ilustrativas; não as apresente como sendo de Montes Claros. Os registros continuam apenas locais; a autenticação não foi implementada.

## Teste
Copie o conteúdo de `public` para a pasta pública de seu XAMPP; abra `index.html`. Para a transição 3D pré-existente, abra `login.html`.
