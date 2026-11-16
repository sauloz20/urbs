# URBS — plataforma colaborativa urbana

Versão web acadêmica para registrar, localizar, visualizar e acompanhar demonstrações de problemas de infraestrutura urbana em Montes Claros — MG.

## Executar localmente

Na raiz do projeto, inicie um servidor estático para servir a pasta `public`:

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Acesse `http://127.0.0.1:8000/`. O serviço de mapas e as fontes precisam de conexão com a internet.

## Telas

- `public/index.html`: apresenta a iniciativa, categorias, área piloto e fluxo de participação.
- `public/mapa.html`: explora categorias, estados e referências de localização; exibe detalhes e permite atualizar o estado de registros locais.
- `public/registro.html`: coleta título, categoria, descrição, referência e coordenadas selecionadas no mapa ou pela geolocalização do dispositivo.

## Bibliotecas e serviços

- Leaflet 1.9.4 para mapa, marcadores e geolocalização visual.
- OpenStreetMap como camada cartográfica, com atribuição mantida no mapa.
- GSAP 3 + ScrollTrigger para entradas leves de conteúdo na página inicial; desativados quando o dispositivo solicita movimento reduzido.
- Google Fonts: Space Grotesk, Manrope e DM Mono.

## Dados e limitações

Os registros criados são salvos na chave `urbs:reports` do `localStorage` e existem apenas no navegador/dispositivo em que foram registrados. Estados disponíveis: Novo, Em análise, Em andamento e Solucionado. Alguns pontos predefinidos são fictícios e servem apenas para demonstrar categorias, filtros e estados. Eles não são ocorrências reais de Montes Claros.

Este site não tem backend, conta de usuário, sincronização entre dispositivos, canal oficial de atendimento nem integração com a Prefeitura. Não use dados pessoais ou informações sensíveis.


## Experiência do planeta no acesso (protótipo visual)

- Abra `public/login.html` ou `http://localhost/urbs/login.html` para visualizar a página imersiva.
- Globe 3D gerado em Three.js com textura procedural estilizada, atmosfera e estrelas. A rotação muda de direção ao alternar login/cadastro.
- GSAP controla a transição de aproximação/queda em direção ao planeta quando um formulário válido é enviado. Após a demonstração, o navegador abre `mapa.html`.
- **Segurança**: esta implementação é somente demonstrativa, **não há login/cadastro real**, nenhuma credencial é transmitida ou armazenada. O formulário apenas valida os campos no navegador, descarta os valores e anima a transição. Para produção, integrar um backend de autenticação com sessões seguras e redirecionar exclusivamente após o servidor confirmar sucesso.
- Respeita `prefers-reduced-motion` e contém fallback se WebGL não estiver disponível. Three.js e GSAP são carregados por CDN, exigindo internet.
