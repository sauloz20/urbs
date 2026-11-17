# URBS — extensão visual solicitada

## Decisão de redesign
**Modo:** extensão/redesign-preserve. A direção carvão/floresta, verde-lima e marfim já aprovada permanece. O escopo é a home e os rótulos editoriais do mapa/cadastro.

**Preservar:** logotipo textual, paleta, tipografia, navegação e rotas `/`, `/mapa.html` e `/registro.html`; mapa Leaflet completo, busca, filtros, geolocalização, formulário e armazenamento local `urbs:reports`; avisos que deixam claro que a demonstração não é oficial nem compartilhada.

**Melhorar:** a área “Simples para participar. Organizado para entender.” receberá carrossel editorial com imagens originais ilustrativas e legendas acessíveis. A home ganha atmosfera abstrata, sem simular dados ou cartografia.

**Remover:** mapa e marcadores fictícios da composição inicial da home; números de seção e índices decorativos como 01, 02 e 03 nas três páginas.

## Design read e dials
Landing page acadêmica/cívica para apresentar um protótipo sobre Montes Claros. Linguagem editorial urbana, com imagens documentais genéricas, contraste carvão/marfim e acento verde-lima. Extensão de marca existente. Variação visual 4/10; motion 5/10; densidade 4/10; dependência de assets 5/10; fidelidade à marca 9/10. Consequências: layout de home com texto protagonista e carrossel claro; preservar o sistema cromático e tipográfico; limitar os efeitos a detalhes com função narrativa; desativar animações de fundo e smooth scroll em `prefers-reduced-motion` e manter fallback sem WebGL.

## Implementação
- `public/index.html`: remover a prévia cartográfica e imports de Leaflet/store usados apenas por ela; manter CTA para mapa completo; incluir o carrossel no bloco processual e os hooks semânticos de animação.
- `public/mapa.html` e `public/registro.html`: retirar apenas os índices de seção/formulário, sem mudar campos, estado ou navegação.
- `public/assets/css/style.css`: manter tokens atuais, compor home sem mapa e carrossel responsivo/keyboard-friendly; remover estilos numéricos que ficarem sem uso.
- `public/assets/js/main.js`: inicializar Swiper, AOS, GSAP/ScrollTrigger, Motion, Vanilla Tilt, Lenis, Lottie e Vanta/Three com escopos separados, carregamento resiliente e caminho sem animação. Versões e forma de carga serão confirmadas em fontes oficiais antes do código.
- `public/assets/images/` e `public/assets/animations/`: imagens genéricas explicitamente ilustrativas; pequeno asset Lottie local se compatível com o player escolhido.
- Não adicionar servidor, banco, dependências de conta, alteração ao schema de dados ou publicação automática. O manifesto de rotas permanece igual.

## Risco principal e fallback
Nove bibliotecas juntas podem pesar ou competir pelo scroll/WebGL. Usar apenas uma função modesta por biblioteca, restringir os efeitos à home, não sobrepor bibliotecas no mesmo elemento, condicionar recursos com `prefers-reduced-motion` e suporte WebGL, e manter experiência íntegra se um CDN falhar. O mapa/cadastro não deve depender dos scripts de efeitos.
