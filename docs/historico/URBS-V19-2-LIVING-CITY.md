# URBS V19.2 — Living City

Base: URBS V19.1. Atualização **somente da cidade 3D na homepage**; mapa V19, hero, login, dois carrosséis e cards magnéticos da V18 permanecem.

## Novidades

1. **Ciclo de iluminação**: DIA / ENTARDECER / NOITE, com interpolação de céu, neblina, luz ambiente, sol/lua, postes e exposição. As horas são cenários ilustrativos e não representam tempo real.
2. **Cidade viva**: novos ônibus, pontos de ônibus, bancos/lixeiras, pedestres animados e semáforos com fases. Carros respeitam os sinais durante a simulação; não representa tráfego real.
3. **Raio-X por categoria**: NORMAL / VIAS / LUZ / ACESSO / VERDE. Realça vias, iluminação, travessias ou arborização sem substituir a maquete. Permanece 100% conceitual.
4. **Câmera de rua**: botão EXPLORAR AO NÍVEL DA RUA e retorno à vista orbital, com OrbitControls, órbita 360°, panorâmica orbital e zoom. Sem travar a rolagem vertical.

## Arquivos
- `public/index.html` — controles adicionais e referência ao JS e CSS da V19.2
- `public/assets/js/urbs-digital-twin-3d-v19-2.js` — cena completa melhorada
- `public/assets/css/digital-twin-v19-2.css` — painel de controles responsivo

## Instalação (XAMPP)
Faça backup de `C:\xampp\htdocs\urbs\public`. Copie o conteúdo da pasta `public` desta versão sobre `C:\xampp\htdocs\urbs\public`. Acesse `http://localhost/urbs/public/index.html`.

**Importante:** Three.js/OrbitControls são carregados de CDN, então o 3D depende de internet e suporte WebGL. O mapa V19 mantém seu funcionamento independente.
