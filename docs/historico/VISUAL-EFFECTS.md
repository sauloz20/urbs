# URBS — camada de efeitos visuais

Foram adicionados GSAP/ScrollTrigger (já presentes), Lenis, Three.js, Vanta, Vanilla Tilt, Swiper, AOS, Lottie e Motion. Todos são aprimoramentos progressivos: sem rede ou sem WebGL, as funções de mapa e registro continuam independentes.

## Arquivos
- `public/index.html`: referências CDN, camada 3D e nova seção de carrossel.
- `public/assets/css/visual-effects.css`: estilos isolados e responsivos.
- `public/assets/js/visual-effects.js`: inicialização, redução de movimento e limpeza de recursos.

## Rodar no XAMPP
Copie a pasta `public` para `C:\xampp\htdocs\urbs` e abra `http://localhost/urbs/`.

## Observações
- A versão fornecida é estática: os registros ficam no localStorage do navegador, sem backend e sem vínculo oficial com a Prefeitura.
- É necessário acesso à internet para carregar bibliotecas, fontes e mapas.
- Efeitos pesados ficam desabilitados em telas pequenas e com `prefers-reduced-motion`.
- Verifique o console e o desempenho real no navegador; este pacote não foi submetido a teste visual automatizado.
