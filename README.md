# URBS — Plataforma de Monitoramento Colaborativo Urbano

Site demonstrativo e projeto acadêmico sobre infraestrutura urbana. Área piloto: Montes Claros (MG).

[Abrir o protótipo navegável](https://raw.githack.com/sauloz20/urbs/main/public/index.html)

A demonstração abre a versão da branch `main`. Na primeira visita, selecione **Open the page**. Explore a página inicial, abra **Mapa** e escolha **Nova ocorrência** para conhecer o formulário.

![Percurso pelo protótipo: página inicial, mapa e registro de ocorrência](docs/portfolio/percurso.gif)

## Executar

A aplicação estática está em `public/`. Para testar, copie `public/` para o DocumentRoot do Apache/XAMPP, ou execute um servidor HTTP estático apontando para essa pasta. Abra `index.html`.

## Estrutura

- `public/*.html`: páginas do site
- `public/assets/css/`: estilos locais
- `public/assets/js/`: lógica da interface
- `public/assets/images/journey/`: imagens ilustrativas de Observe, Localize e Acompanhe
- `public/assets/images/`: demais imagens
- `public/assets/media/`: vídeo
- `public/assets/textures/`: texturas para experiências 3D
- `docs/historico/`: histórico de versões
- `docs/desenvolvimento/`: diretrizes e materiais internos

## Globo da tela de acesso

O reflexo nos oceanos usa uma máscara costeira feita com dados do [Natural Earth](https://www.naturalearthdata.com/downloads/110m-physical-vectors/).

## Transformações urbanas

O comparador 16:9 utiliza registros publicados por órgãos públicos de outros municípios. Não represente tais casos como obras da URBS ou de Montes Claros. A montagem da Rua Expedito Madruga Monte, publicada pela Prefeitura de Fortaleza, está incluída no projeto. Os demais casos carregam as imagens das fontes originais.

As imagens da seção **Do Olhar à Ação** são ilustrativas, geradas digitalmente, armazenadas em WebP no próprio projeto.

## Revisão V20.2

- Corrigida a ordem de camadas dos cards para evitar que apareçam apenas com fundo verde.
- Adicionados elementos `<img>` reais sobre o fundo de fallback, preservando a sobreposição editorial.
- Organizados documentos históricos em `docs/`.
- Arquivos CSS/JS/TS/JSON formatados com indentação de dois espaços.
- `public/` mantém todos os caminhos relativos das páginas funcionando como antes.
