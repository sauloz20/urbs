# URBS V14 — Painel 3D de Montes Claros

## Funcionalidades
- Inicialização automática com chave de navegador em `public/assets/js/google-maps-config.js`.
- Google Maps JavaScript API / `maps3d` em modo `SATELLITE` sem rótulos comerciais.
- Color grading CSS, bordas em névoa e alternância DIA/NOITE **visual** (não altera a iluminação real do Google).
- Filtros com contagens calculadas a partir de `UrbsData.getAllReports()`.
- Marcadores 3D personalizados com linha de extrusão e pino verde-lima; relatos demostrativos são rotulados como exemplo.
- Tour contínuo pelos pontos demonstrativos e locais existentes. **Não se afirma que sejam ocorrências reais.**
- Painel de informações sem inventar fotos, apoio/popularidade ou localização detalhada.
- Bússola e coordenadas atualizadas nos eventos de alteração de centro e heading.
- Controles +/- e botão de reset; rolagem vertical nativa sem disparar Ctrl+scroll no mapa.

## Segurança e cobrança
**A chave fornecida pelo usuário foi incluída conforme solicitado.** É chave de navegador, portanto aparece nas requisições e não é secreta. **Rotacione a chave antes de publicar**, restrinja a chave à Maps JavaScript API e aos referenciadores HTTP (`http://localhost/*` e domínio de produção) e configure limites/alertas de orçamento no Google Cloud. `google-maps-config.js` está no `.gitignore`, mas se já estiver versionado, o ignore não o removerá do histórico.

## Restrições técnicas
A API não oferece controle arbitrário do sol no modo SATELLITE; o noturno é um overlay/filtragem cosmética. A cobertura fotorrealista de Montes Claros depende do Google. Logos, créditos e condições de uso do Google não devem ser escondidos. O efeito de cor CSS pode afetar a tonalidade dos créditos; em produção verifique aderência às regras de atribuição e ajuste o filtro.

## Como testar
Inicie o XAMPP, acesse `http://localhost/urbs/public/index.html`, role até Montes Claros, confira o console caso haja erro de credencial/autorização. O tour começa ao clicar em INICIAR TOUR. A página não recarrega nem solicita chave ao visitante.

Documentação: https://developers.google.com/maps/documentation/javascript/3d/overview e https://developers.google.com/maps/documentation/javascript/3d/animate-camera
