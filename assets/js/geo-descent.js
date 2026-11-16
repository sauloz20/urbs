/* URBS — jornada geográfica, CesiumJS 1.138; não autentica usuários.
 * A Terra da tela é Three.js; ao entrar, a cena migra para CesiumJS e
 * a câmera visita altitudes reais em torno de Montes Claros.
 * O terreno 3D fotorealista depende de dados externos e cobertura local.
 */
(() => {
  'use strict';
  const CDN = 'https://cdn.jsdelivr.net/npm/cesium@1.138.0/Build/Cesium/';
  const config = window.URBS_GEO_CONFIG || {};
  const destination = config.destination || {longitude:-43.8578, latitude:-16.7286,label:'Montes Claros, MG'};
  const root = document.getElementById('geo-flight');
  const sceneHost = document.getElementById('cesium-flight');
  const phase = document.getElementById('geo-phase');
  const place = document.getElementById('geo-place');
  const altitude = document.getElementById('geo-altitude');
  const progress = document.getElementById('geo-progress-bar');
  const skip = document.getElementById('geo-skip');
  let viewer=null, running=false, cancelled=false, complete=false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function loadCss(url) {
    if(document.querySelector('link[data-geo-cesium]')) return;
    const el=document.createElement('link');el.rel='stylesheet';el.href=url;el.dataset.geoCesium='true';document.head.append(el);
  }
  function loadScript(url) {
    if (window.Cesium) return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const el=document.createElement('script');el.src=url;el.async=true;
      el.onload=()=>window.Cesium?resolve():reject(new Error('CesiumJS não inicializado'));
      el.onerror=()=>reject(new Error('Falha ao carregar CesiumJS (rede/CDN).'));
      document.head.appendChild(el);
      setTimeout(()=>{if(!window.Cesium)reject(new Error('Tempo esgotado ao carregar CesiumJS.'));},14000);
    });
  }
  function update(message, location, height, percent) {
    if (phase) phase.textContent=message;
    if (place) place.textContent=location;
    if (altitude) altitude.textContent=height;
    if (progress) progress.style.width=percent+'%';
    const sr=document.querySelector('.screen-reader-status');
    if(sr) sr.textContent=`${message}. ${location}.`;
  }
  function destinationUrl() {return 'index.html';}
  // Sinal de navegação de curtíssima duração: aciona a revelação na homepage
  // sem transmitir credenciais ou dados do formulário.
  function rememberArrival() {
    try { sessionStorage.setItem('urbs-home-arrival-v9', String(Date.now())); } catch (_) {}
  }
  function finish() {
    if(complete)return;
    complete=true;cancelled=true;
    try { viewer?.camera.cancelFlight(); } catch (_) {}
    rememberArrival();
    window.location.assign(destinationUrl());
  }
  skip?.addEventListener('click', finish);
  function setVisible() {
    root.classList.add('geo-active');root.setAttribute('aria-hidden','false');
    root.style.opacity='1';
    document.querySelectorAll('.form-side').forEach(x=>{x.inert=true;});
    update('INICIANDO TRAJETO','DA ÓRBITA À CIDADE','COORDENADAS REAIS · -16.7286, -43.8578',3);
  }
  async function initViewer() {
    loadCss(CDN+'Widgets/widgets.css');
    window.CESIUM_BASE_URL=CDN;
    await loadScript(CDN+'Cesium.js');
    if(cancelled)return null;
    const C=window.Cesium;
    window.CESIUM_BASE_URL=CDN;
    if(config.cesiumIonToken)C.Ion.defaultAccessToken=config.cesiumIonToken;
    const v=new C.Viewer(sceneHost,{
      animation:false,timeline:false,fullscreenButton:false,homeButton:false,
      navigationHelpButton:false,sceneModePicker:false,baseLayerPicker:false,
      geocoder:false,infoBox:false,selectionIndicator:false,
      baseLayer:false, terrainProvider:new C.EllipsoidTerrainProvider(),
      requestRenderMode:false,shouldAnimate:true
    });
    v.scene.globe.enableLighting=true;
    v.scene.globe.show=true;
    v.scene.skyAtmosphere.show=true;
    v.scene.screenSpaceCameraController.enableInputs=false;
    v.scene.fog.enabled=true;
    v.scene.globe.depthTestAgainstTerrain=true;
    v.resolutionScale=Math.min(1,1/(window.devicePixelRatio||1)*1.8);
    // Imagens de satélite (Esri World Imagery). As atribuições são fornecidas
    // pelo serviço e mantidas visíveis no rodapé do visualizador Cesium.
    // O serviço é externo; acesso/limites/licenciamento dependem do provedor.
    try {
      const satellite = await C.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
        {enablePickFeatures:false}
      );
      if(!cancelled) {
        v.imageryLayers.addImageryProvider(satellite);
        root.classList.add('geo-satellite');
      }
    } catch(error) {
      console.warn('URBS: satélite indisponível; usando mapa de ruas.', error);
      if(!cancelled) v.imageryLayers.addImageryProvider(new C.OpenStreetMapImageryProvider({
        url:'https://tile.openstreetmap.org/'
      }));
    }
    // Terrain opcional via Cesium ion: adiciona relevo ao percurso.
    if(config.cesiumIonToken){
      try {
        const terrain=await C.createWorldTerrainAsync();
        if(!cancelled)v.terrainProvider=terrain;
      } catch(err) {console.warn('URBS: Cesium World Terrain indisponível:',err);}
    }
    // Dados 3D do Google podem não cobrir a cidade. Mantemos a base OSM como fallback.
    if(config.googleMapsApiKey){
      try{
        const url='https://tile.googleapis.com/v1/3dtiles/root.json?key='+encodeURIComponent(config.googleMapsApiKey);
        const tileset=await C.Cesium3DTileset.fromUrl(url,{showCreditsOnScreen:true,maximumScreenSpaceError:16});
        if(!cancelled){v.scene.primitives.add(tileset);v.scene.globe.show=false;
          root.classList.add('geo-google');
        }
      }catch(error){console.warn('URBS: Google 3D Tiles indisponível. Usando imagens OpenStreetMap.',error);}
    }
    return v;
  }
  // V7 — trajetória contínua com enquadramentos GEOGRÁFICOS REAIS.
  // A versão anterior aplicava zoom logarítmico diretamente sobre o destino:
  // Brasil e Minas mal apareciam na tela. Agora cada região tem um intervalo
  // VISÍVEL de altitude e posição, sem pausas, jump cuts ou novos flyTo().
  // Longitude/latitude são interpoladas via Hermite (derivada contínua).
  // A altitude usa a mesma curva em escala logarítmica.
  function runJourney(v) {
    return new Promise(resolve=>{
      if(cancelled)return resolve();
      const C=window.Cesium;
      const duration=Math.max(2,Number(config.flightDurationSeconds)||6);
      // Fração do tempo, centro do quadro, altitude (em metros).
      // A rota começa pela África, mostra o Brasil inteiro, depois MG,
      // Norte de Minas e, por fim, Montes Claros.
      const route=[
        // Visão planetária -> América do Sul -> Brasil -> Minas Gerais -> cidade.
        // Cada ponto determina enquadramento, não uma parada da câmera.
        {t:0, lon:12, lat:4, h:18500000, title:'PLANETA TERRA',place:'DO ESPAÇO AO TERRITÓRIO'},
        {t:.19,lon:-36,lat:-10,h:11500000,title:'AMÉRICA DO SUL',place:'CONTINENTE SUL-AMERICANO'},
        {t:.40,lon:-52,lat:-14,h:5800000,title:'BRASIL',place:'BRASIL · VISTA ORBITAL'},
        {t:.64,lon:-45.8,lat:-18.5,h:1200000,title:'MINAS GERAIS',place:'SUDESTE DO BRASIL'},
        {t:.83,lon:-43.98,lat:-16.99,h:135000,title:'NORTE DE MINAS',place:'REGIÃO DE MONTES CLAROS'},
        {t:1,lon:destination.longitude,lat:destination.latitude,h:10500,title:'MONTES CLAROS',place:destination.label.toUpperCase()}
      ];
      // Tangentes ponderadas: suavidade C1, sem zerar velocidade entre etapas.
      function sample(key,u){
        let i=0;while(i<route.length-2 && u>route[i+1].t)i++;
        const a=route[i],b=route[i+1],dt=b.t-a.t;
        const val=(j)=>key==='h'?Math.log(route[j].h):route[j][key];
        const slope=(j,k)=>(val(k)-val(j))/(route[k].t-route[j].t);
        const ma=i===0?slope(0,1):slope(i-1,i+1);
        const mb=i+2>=route.length?slope(i,i+1):slope(i,i+2);
        const q=Math.max(0,Math.min(1,(u-a.t)/dt));
        const q2=q*q,q3=q2*q;
        const result=(2*q3-3*q2+1)*val(i)+(q3-2*q2+q)*dt*ma+(-2*q3+3*q2)*val(i+1)+(q3-q2)*dt*mb;
        return key==='h'?Math.exp(result):result;
      }
      let raf=0,lastStage=-1;
      const start=performance.now();
      root.classList.add('geo-rendering');
      const frame=now=>{
        if(cancelled){cancelAnimationFrame(raf);return resolve();}
        const t=Math.min(1,Math.max(0,(now-start)/(duration*1000)));
        // O parâmetro temporal cresce uniformemente: não há desaceleração
        // artificial nas fronteiras entre Brasil, Minas Gerais e a cidade.
        const u=t;
        const lon=sample('lon',u),lat=sample('lat',u),height=sample('h',u);
        const tilt=Math.max(0,(u-.8)/.2);
        v.camera.setView({
          destination:C.Cartesian3.fromDegrees(lon,lat,height),
          orientation:{heading:0,pitch:-C.Math.PI_OVER_TWO+tilt*.15,roll:0}
        });
        let stage=0;while(stage<route.length-1 && u>=route[stage+1].t)stage++;
        if(stage!==lastStage){
          lastStage=stage;
          if(phase)phase.textContent=route[stage].title;
          if(place)place.textContent=route[stage].place;
        }
        if(altitude)altitude.textContent=height>=1000
          ?`ALTITUDE · ${Math.round(height/1000).toLocaleString('pt-BR')} KM`
          :`ALTITUDE · ${Math.round(height).toLocaleString('pt-BR')} M`;
        if(progress)progress.style.width=(t*100).toFixed(2)+'%';
        if(t<1)raf=requestAnimationFrame(frame);else resolve();
      };
      raf=requestAnimationFrame(frame);
    }).then(()=>{
      if(cancelled)return;
      update('CHEGADA A MONTES CLAROS','BEM-VINDO AO URBS','ABRINDO A EXPERIÊNCIA URBS',100);
      root.classList.add('geo-arriving');
      // Curto véu escuro, evita o corte instantâneo Cesium -> Leaflet.
      setTimeout(finish, 280);
    });
  }
  function simpleFallback(){
    root.classList.add('geo-fallback');
    update('VISUALIZAÇÃO 3D INDISPONÍVEL','MONTES CLAROS, MG','ABRINDO A PÁGINA INICIAL',100);
    setTimeout(finish,1700);
  }
  async function start(){
    if(running)return;running=true;cancelled=false;complete=false;
    setVisible();
    // Sem movimento, não executar viagem longa.
    if(reduced){update('ENTRADA SIMPLIFICADA','MONTES CLAROS, MG','ABRINDO O URBS',100);setTimeout(finish,600);return;}
    try{
      viewer=await initViewer();
      if(!viewer||cancelled)return;
      await runJourney(viewer);
    }catch(error){console.warn('URBS: descida geográfica indisponível:',error);simpleFallback();}
  }
  window.URBSGeoDescent={start};
  window.addEventListener('pagehide',()=>{cancelled=true;viewer?.destroy();viewer=null;},{once:true});
})();
