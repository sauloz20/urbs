# URBS V20.1 — Mídia local e comparador aprimorado

## Correção

O carrossel **DO OLHAR À AÇÃO** tinha três URLs externas do Unsplash e cores verdes de fallback. Agora recebe três imagens ilustrativas locais compactadas em WebP, em `public/assets/images/journey/`, para que imagens não fiquem vazias por indisponibilidade da CDN. São **imagens geradas digitalmente**, não fotografias documentais da cidade.

## Melhorias

- Melhor gradação da máscara de contraste no carrossel de etapas.
- Comparador documental mantém quatro fontes externas originais e exibe mensagem de erro caso falhem.
- Botões funcionais `VER MELHORIA`, `50 / 50` e `VER ORIGINAL` abaixo do comparador, com estado acessível.
- Teclado, toque e tela cheia existentes preservados; alteração isolada em CSS/JS.
- Incremento de versão nos recursos da página para recarregar sem cache antigo.

## Executar

Copiar o conteúdo de `public/` para `C:\xampp\htdocs\urbs\public`, acessar `http://localhost/urbs/public/index.html` e atualizar o navegador.

**Nota:** as fotos do comparador Antes e Depois seguem hospedadas em fontes externas, portanto requerem internet e disponibilidade dos órgãos públicos.
