# URBS V17 — Painel Split-Screen Magnético

Nova seção da homepage em formato de acordeão horizontal com cinco faixas, no lugar da experiência geográfica V16.

## Arquivos
- `public/index.html` — seção de território substituída e novos assets carregados.
- `public/assets/css/urban-split-v17.css` — layout, expansão de ~67% em desktop e versão vertical no celular.
- `public/assets/js/urban-split-v17.js` — hover, clique, toque, teclado e foco.

## Conteúdo
Os cinco painéis utilizam **os registros demonstrativos existentes em `assets/js/store.js`**, com coordenadas e status de exemplo. Não são registros reais. Os fundos são fotografias temáticas do Unsplash carregadas pela internet. Caso elas não carreguem, as faixas mantêm um fundo visual em degradê. As fotos não retratam os locais ou registros fictícios.

## Interação
- Desktop: passe o mouse para expandir, clique para fixar uma faixa; ao sair da galeria, volta ao painel fixado.
- Celular: toque em uma faixa para expandir; layout vertical.
- Teclado: Tab para focar; setas e Home/End para alternar; Enter/Espaço para fixar; Tab para acessar o botão interno.
- Preferência por movimento reduzido: animações desabilitadas.

## O que foi preservado
Os dois carrosséis editoriais, Liquid Distortion, login com globo, navegação pelo mapa de ocorrências e página de registro.

## Instalação
Copie **o conteúdo** de `public/` para `C:\xampp\htdocs\urbs\public\`. Depois acesse `http://localhost/urbs/public/index.html` e recarregue com Ctrl+F5.
