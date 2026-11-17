# URBS V11.4 — Tipografia e Território em Camadas

## Mudanças
- Títulos grandes (`main h1`, `main h2`) possuem animação individual por letra ao passar o mouse, preservando a leitura por tecnologias assistivas e desativando o efeito em movimento reduzido.
- A maquete da homepage foi substituída por torres com material translúcido e EdgesGeometry em verde-lima #a3e635.
- Grade GridHelper no lugar da plataforma sólida, com THREE.FogExp2 para dissipação do espaço.
- Luz direcional com sombras suaves PCFSoftShadowMap e bloom opcional via UnrealBloomPass.
- Seleção de torres com raycasting: elevação e tooltip. Os indicadores são **simulados**, não representam dados reais de Montes Claros.
- O restante do projeto permanece inalterado, inclusive carrossel contínuo da V11.3.

## Requisitos
Internet para carregar Three.js e módulos de postprocessamento no CDN; WebGL no navegador. Em indisponibilidade, o fundo visual alternativo fica preservado. O site usa rolagem nativa.

## Teste
Abra `public/index.html` via servidor XAMPP, faça hover nos títulos e nas torres. Arraste a maquete para girar. Confira o funcionamento da rolagem e a navegação mobile.
