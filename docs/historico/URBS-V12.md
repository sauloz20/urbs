# URBS V12 — Urban Intelligence Experience

Versão frontend baseada na V11.4, mantendo login com globo, transição de 6 segundos, mapa, registro e carrossel horizontal contínuo.

## Mudanças

- **Cidade 3D guiada pela rolagem:** ao alcançar a seção Experiência, a visualização permanece visível durante a travessia; a câmera passa por enquadramento aéreo, aproximação, passagem entre torres e retorno a uma visão ampla. A página continua com rolagem vertical nativa. O arraste com mouse segue disponível e pode ajustar a orientação temporariamente.
- **Camadas luminosas:** fluxos de luz, linhas e beacons pulsantes representam conexões urbanas conceituais. Não representam ruas, medições ou ocorrências reais.
- **Transições visuais:** atmosfera e foco sutil no hero, zoom proporcional à rolagem na fotografia da seção-manifesto. Nenhuma seção depende de `opacity:0` para existir.
- **Chamada final:** nova composição “A CIDADE É VIVA. PARTICIPE.”, com órbitas gráficas e botão para o mapa.
- **Tipografia:** letras que saltam ao passar o mouse preservadas da V11.4.

## Onde editar

- `public/index.html`: conteúdos, ordem das seções, chamada final.
- `public/assets/css/urbs-v11.css`: layout, hero, seção 3D e animações CSS.
- `public/assets/js/urbs-v11.js`: carrossel contínuo e efeitos editoriais.
- `public/assets/js/urbs-city-3d.js`: cena Three.js, fluxos, trajetórias e tooltips.

## Teste no XAMPP

Extraia o projeto e copie o **conteúdo** de `public/` para `C:\xampp\htdocs\urbs\public\`. Acesse `http://localhost/urbs/public/index.html` e force uma atualização com Ctrl+F5.

A cena 3D exige conexão com a internet para carregar Three.js e depende de suporte a WebGL. Em caso de erro, a fotografia de fundo permanece como alternativa. Usuários com `prefers-reduced-motion` não recebem a câmera guiada pela rolagem.

## Estado da validação

Scripts JavaScript conferidos por `node --check`, caminhos locais e ZIP conferidos. O teste automatizado por navegador local não foi possível porque o navegador bloqueou o acesso ao servidor localhost neste ambiente. Testar movimento, renderização e responsividade no computador de destino.
