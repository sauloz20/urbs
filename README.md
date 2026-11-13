# URBS — experiência web

Frontend responsivo da plataforma acadêmica URBS, com homepage editorial/cinematográfica, mapa interativo e fluxo demonstrativo de registro.

## Executar

1. Extraia a pasta `urbs-site` para `C:\xampp\htdocs\`.
2. Inicie o Apache no XAMPP.
3. Acesse `http://localhost/urbs-site/`.

Também pode abrir `index.html` diretamente no navegador, mas o uso por servidor local é recomendado para evitar restrições de alguns navegadores.

## O que está implementado

- Homepage responsiva com vídeo de fundo, fotografias e seções editoriais.
- Animações com GSAP e ScrollTrigger; rolagem suave com Lenis.
- Menu responsivo e barra de progresso de leitura.
- Mapa Leaflet com base OpenStreetMap, centralizado em Montes Claros.
- Formulário de registro com seleção de coordenadas no mapa.
- Registros demonstrativos salvos no `localStorage` do navegador e exibidos no mapa.
- Filtro por categoria e popups dos marcadores.
- Avisos explícitos de que os registros não são enviados a um servidor.

## Limitação importante: backend

Este pacote é um frontend funcional para demonstração. Ainda não está conectado à API PHP nem ao banco MySQL do projeto. Os registros ficam somente no navegador em que foram criados, não são compartilhados com outros usuários e podem ser apagados ao limpar os dados do site. Não use dados pessoais ou sensíveis.

Para integrar ao backend, substitua as operações de `localStorage` em `assets/js/registro.js` e `assets/js/map.js` por requisições à API, mantendo validação no servidor e consultas parametrizadas.

## Bibliotecas e serviços externos

- GSAP 3 + ScrollTrigger
- Lenis
- Leaflet 1.9.4
- OpenStreetMap
- Google Fonts

As bibliotecas, fontes, tiles do mapa, vídeo e fotografias são carregados de serviços externos; é necessária conexão com a internet.

As imagens e o vídeo são ilustrativos, de bancos fotográficos, e não representam ocorrências reais de Montes Claros. Antes de publicar, baixe e hospede localmente os arquivos de mídia e confira os termos de uso/licença e créditos.

## Estrutura

```text
urbs-site/
├── index.html
├── mapa.html
├── registro.html
├── README.md
└── assets/
    ├── css/style.css
    └── js/
        ├── main.js
        ├── map.js
        └── registro.js
```
