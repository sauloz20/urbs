# URBS — Login com Terra 3D fullscreen

## Abrir no XAMPP

- Copie a pasta `public` (ou seu conteúdo) para `C:\xampp\htdocs\urbs\public`.
- Inicie o Apache e abra `http://localhost/urbs/public/login.html`.
- É necessária internet para carregar as bibliotecas Three.js e GSAP pelo CDN; as texturas do planeta estão no projeto.

## Design e comportamento

- Tela fixa `100vw × 100dvh`, sem rolagem da página.
- **Login:** formulário à esquerda, Terra à direita.
- **Cadastro:** o globo atravessa para a esquerda enquanto o formulário troca para a direita; movimento completo dura 1,2 s.
- Globo com mapas equiretangulares de dia, relevo, nuvens separadas, luz noturna estilizada, atmosfera shader e estrelas.
- Rotação lenta contínua e parallax suave por ponteiro.
- No mobile, o planeta vira fundo atenuado e os formulários ocupam o centro.
- Ao enviar dados válidos, o formulário é descartado e a animação demonstrativa atravessa o planeta até `mapa.html`.

## Imagem de referência enviada

`assets/images/terra-blue-marble-referencia.jpg` é a fotografia fornecida. Ela aparece como fallback se WebGL falhar. Não é aplicada como textura 360° porque a fotografia circular frontal não é equiretangular e distorceria numa esfera. O globo 3D usa mapas geográficos retangulares em `assets/textures/`.

## Limitação de segurança

Este é um **protótipo visual**, sem autenticação, sem registro, sem backend e sem armazenamento de dados. O botão 'Entrar' / 'Criar conta' demonstra a transição visual, não valida nem cria usuários. Não digite senhas reais.

## Arquivos alterados

- `public/login.html`
- `public/assets/css/auth-globe.css`
- `public/assets/js/auth-globe.js`
- `public/assets/images/terra-blue-marble-referencia.jpg`

## Biblioteca

Three.js 0.158.0, GSAP 3.13.0 (carregadas por CDN).
