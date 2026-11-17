# URBS V12.7 — Liquid hover shader

A faixa horizontal de OBSERVE, LOCALIZE e ACOMPANHE mantém autoplay em 43 px/s, sem setas.

O hover usa um shader PixiJS com deslocamento localizado no ponteiro, rastro pela velocidade, duas ondas com frequências diferentes e leve aberração cromática. Ao sair do card, o efeito diminui progressivamente. O filtro só inicia após a interação, e cada imagem permanece como CSS fallback se WebGL ou CORS falhar.

**Nota:** efeito desenvolvido com a linguagem visual solicitada como inspiração, não é código extraído do site Dunamis.

**Testar:** XAMPP -> /urbs/public/index.html; Ctrl+F5. Com o DevTools aberto, acompanhar erros de CORS/WebGL. O efeito só aparece em dispositivos com mouse preciso e sem redução de movimento ativa.
