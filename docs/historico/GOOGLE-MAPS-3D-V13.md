# URBS V13 — Google Maps 3D na homepage

A seção **Montes Claros** usa o componente `Map3DElement` da **Google Maps JavaScript API / maps3d** (não utiliza a API Photorealistic 3D Tiles nem a chave de um SDK Android).

## Como ativar
1. Configure sua chave no Google Cloud Console, habilite **Maps JavaScript API** e verifique faturamento ou validade da chave de demonstração. O Maps 3D Web pode gerar cobrança.
2. Em **Restrições de aplicativo**, selecione **Sites (referenciadores HTTP)** e autorize as origens do seu ambiente de testes e domínio de produção. Restrinja em **Restrições de API** à Maps JavaScript API.
3. Inicie Apache no XAMPP e abra `http://localhost/urbs/public/index.html`.
4. Na seção Montes Claros, cole a chave no formulário **Ativar mapa 3D**. A chave é salva somente em `sessionStorage` nesta aba, não nos arquivos do projeto. Após fechar a aba, será necessário inseri-la novamente.

**Segurança**: como uma chave foi exposta em conversa, revogue/rotacione essa chave e utilize outra restrita. Uma chave de navegador aparece nas solicitações de rede: nunca dependa de ocultá-la no JavaScript; utilize restrições de referrer, API, monitoramento de uso e limites de orçamento.

## O que mudou
- `public/index.html`: substituída apenas a prévia 2D da homepage.
- `public/assets/js/google-3d-preview.js`: carregamento sob demanda, configuração local e cena 3D centrada em Montes Claros.
- `public/assets/css/google-3d-preview.css`: estilos e estado de carregamento.
- O mapa 2D completo `mapa.html` e os registros foram mantidos.

## Limitações
- Não há garantia de prédios fotorrealistas em Montes Claros: isso depende da cobertura do Google.
- Não foi possível testar a credencial fornecida nem abrir seu console em nome do usuário.
- Exige rede, WebGL e chave apta a usar a Maps JavaScript API.
- Se o mapa não carregar, consulte F12 → Console para erros de autorização, API desabilitada ou faturamento.

Fontes: https://developers.google.com/maps/documentation/javascript/3d/overview e https://developers.google.com/maps/documentation/javascript/get-api-key
