# URBS V19.1 — Digital Twin 360°

## O que mudou

A seção **UMA CIDADE. INFINITAS CAMADAS.** foi redesenhada para apresentar um bairro **3D conceitual** em lugar da maquete antiga em wireframe transparente.

- **Navegação orbital em 360°** com Three.js `OrbitControls`: arrastar para girar, rolar a roda para aproximar/afastar, elevar a câmera até visão quase vertical; rotação horizontal completa sem limites de azimute.
- **Construção procedural detalhada**: ruas e faixas de trânsito, quadras e calçadas, fachadas sólidas de edifícios com janelas, telhados, praça, árvores, travessias de pedestres, postes e pontos de luz, veículos 3D circulando.
- **Interatividade**: quatro marcadores de infraestrutura (Mobilidade, Iluminação, Acessibilidade, Zeladoria). Clique para aproximar a câmera e ler a descrição; edifícios respondem ao hover (destaque) e clique (seleção por categoria).
- **Controles**: reiniciar visão, vista aérea, tour guiado com pausa. Exibição de azimute em graus.
- **Acessibilidade**: botões HTML focáveis, suporte a `prefers-reduced-motion`, instruções visíveis, rolagem de página livre sem scroll-jacking.
- **Performance**: janelas e faixas instanciadas (`InstancedMesh`), cenas fora da tela não são redesenhadas, menor resolução/sem sombras em telas móveis.
- **Fallback**: mensagem caso a biblioteca externa Three.js/WebGL não carregue; link para mapa completo sempre acessível.

O material é uma **simulação artística**: NÃO representa dados, denúncias, construções, mapeamento ou métricas reais de Montes Claros. Não substitui o mapa cartográfico da seção `mapa.html`.

## Arquivos alterados

- `public/index.html` — somente a seção 3D e seus imports.
- `public/assets/css/digital-twin-v19-1.css` — estilos exclusivos da nova cena.
- `public/assets/js/urbs-digital-twin-3d.js` — novo módulo 3D com Three.js + OrbitControls.
- `public/assets/js/digital-twin-fallback.js` — aviso caso as dependências externas falhem.
- `URBS-V19-1-DIGITAL-TWIN.md` — este arquivo.

`public/assets/js/urbs-city-3d.js` foi preservado para referência, mas **não é carregado** na V19.1.

**Todo o restante** (login, mapa integrado V19, cadastro, os dois carrosséis, Liquid Distortion, cinco cards e modais pixelados) permanece sem alterações.

## Instalação no XAMPP

1. Faça backup da instalação anterior em `C:\xampp\htdocs\urbs\public`.
2. Extraia o ZIP e abra a pasta `urbs_v19_1_twin360\public`.
3. Copie o conteúdo de `public` para `C:\xampp\htdocs\urbs\public`, substituindo os arquivos existentes.
4. Inicie o Apache no XAMPP e acesse `http://localhost/urbs/public/index.html`.
5. Pressione **Ctrl + F5** para limpar o cache dos scripts e estilos da versão anterior.

A cena 3D utiliza Three.js **r158 (0.158.0)** carregado pelo importmap original do projeto via `cdn.jsdelivr.net`; é necessário acesso à internet e WebGL. Em computadores bloqueados, o restante da homepage carrega e a cena exibe uma explicação da indisponibilidade após a tentativa de inicialização.

### Como testar

- Arraste o modelo com o mouse por uma volta completa; aproxime usando scroll.
- Clique em **VISTA AÉREA**, depois **REINICIAR**.
- Clique nos pinos **01–04**, ou passe o mouse e clique em edifícios.
- Clique em **INICIAR TOUR** e **PAUSAR TOUR**.
- Acesse o mapa em `http://localhost/urbs/public/mapa.html` e as páginas `login.html` e `registro.html`.

## Limites da validação

Foi realizada verificação estrutural do HTML, sintaxe JS (Node.js), parsing de CSS, existência de caminhos internos e integridade ZIP. O navegador automatizado deste ambiente bloqueia acesso a páginas locais e à CDN, portanto **não foi possível executar e validar o WebGL visualmente**. É recomendado testar no Chrome/Edge do notebook e consultar o console F12 se a cena não inicializar.
