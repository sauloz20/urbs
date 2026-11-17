# URBS V6 — Globo geográfico com satélite

## Alterações

- Substitui a esfera de textura estática do login por **CesiumJS**, um globo geográfico verdadeiro.
- A camada visual usa **Esri World Imagery**; a Terra exibe imagens geográficas reais e muda de região durante a rotação.
- Login começa com foco em África/Oriente Médio. Cadastro altera gradualmente o ponto de vista até as Américas.
- Preserva os dois formulários, o glassmorphism e a travessia horizontal de **1,2 s**.
- Mantém a descida geográfica contínua da V5 e o mapa de satélite.
- Sem credenciais Google e sem copiar recursos privados do Google Earth. Não é uma incorporação do site Google Earth.

## Requisitos

- Conexão à internet (CesiumJS por CDN e imagens do serviço Esri).
- WebGL habilitado no navegador.
- Mantenha créditos de imagens e da tecnologia visíveis no canto inferior do planeta.
- Se não houver conexão, a fotografia Blue Marble previamente incluída é usada como fallback visual.

## Executar

Extraia o ZIP em `C:\xampp\htdocs\urbs\` e abra `http://localhost/urbs/public/login.html` se preservou a pasta `public`.

## Observações

A qualidade visual e o detalhe espacial dependem da resolução oferecida pelo provedor e da conexão. Não é o mesmo globo do Google Earth, que é proprietário, mas utiliza o mesmo conceito de imagens geográficas projetadas em uma esfera. O cadastro e o login são apenas demonstração; não enviam dados nem autenticam.
