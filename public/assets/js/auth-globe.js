/* URBS V6 — Globo satélite real, inspirado na experiência de navegação Earth.
 * CesiumJS + Esri World Imagery, sem copiar imagens/código do Google Earth.
 * Mantenha as atribuições do provedor visíveis na cena.
 * Login e cadastro são DEMONSTRAÇÕES, sem autenticação nem armazenamento.
 */
(() => {
    'use strict';
    const root = document.querySelector('.auth-experience');
    if (!root)
        return;
    const C = window.Cesium;
    const gsap = window.gsap;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = document.getElementById('planet-canvas');
    const status = document.querySelector('.screen-reader-status');
    const planetZone = document.querySelector('.planet-zone');
    const loginSide = document.getElementById('login-side');
    const registerSide = document.getElementById('register-side');
    const WORLD_IMAGERY = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer';
    let mode = 'login', entering = false, viewer = null, raf = 0, lastTime = 0;
    let pointerX = 0, pointerY = 0, panX = 0, panY = 0, switching = false;
    let dragging = false, dragX = 0, dragY = 0, lastDrag = 0;
    const globe = { rotation: { y: 0 } }; // Proxy animável pelo GSAP; vira longitude da câmera Cesium.
    const initialCenter = { lon: 23, lat: 15 }; // África e Oriente Médio.
    function fallback(message) {
        host.classList.add('globe-fallback');
        if (status)
            status.textContent = message || 'Globo de satélite indisponível; formulários disponíveis.';
    }
    function globeCamera() {
        if (!viewer || viewer.isDestroyed() || entering)
            return;
        const mobile = innerWidth <= 760;
        const lon = initialCenter.lon + C.Math.toDegrees(globe.rotation.y) + panX * 2.0;
        const lat = initialCenter.lat + panY * 1.3;
        // Câmera acima do centro geográfico da Terra. O movimento da longitude
        // equivale à rotação do planeta, preservando relevo e geografia reais.
        const height = mobile ? 15200000 : 13100000;
        viewer.camera.setView({
            destination: C.Cartesian3.fromDegrees(lon, lat, height),
            orientation: { heading: 0, pitch: -C.Math.PI_OVER_TWO, roll: 0 }
        });
    }
    async function initGlobe() {
        if (!C || !host) {
            fallback();
            return;
        }
        try {
            // CesiumJS é usado apenas como renderizador. Sem controles ou interface de mapa.
            // O usuário vê um planeta limpo, preservando créditos de imagem obrigatórios.
            viewer = new C.Viewer(host, {
                animation: false, timeline: false, fullscreenButton: false,
                homeButton: false, navigationHelpButton: false, sceneModePicker: false,
                baseLayerPicker: false, geocoder: false, infoBox: false,
                selectionIndicator: false, baseLayer: false,
                terrainProvider: new C.EllipsoidTerrainProvider(),
                skyBox: false, sun: false, moon: false,
                requestRenderMode: false, shouldAnimate: true
            });
            viewer.scene.globe.enableLighting = false;
            viewer.scene.globe.show = true;
            viewer.scene.globe.baseColor = C.Color.fromCssColorString('#123049');
            viewer.scene.backgroundColor = C.Color.BLACK;
            viewer.scene.skyAtmosphere.show = true;
            viewer.scene.fog.enabled = false;
            viewer.scene.screenSpaceCameraController.enableInputs = false;
            viewer.scene.globe.showGroundAtmosphere = true;
            // Adapta resolução ao dispositivo para não sobrecarregar placas simples.
            viewer.resolutionScale = Math.min(1.5, window.devicePixelRatio > 1.5 ? 1 : window.devicePixelRatio || 1);
            host.classList.add('globe-ready');
            globeCamera();
            try {
                // O serviço devolve os créditos mostrados pelo Cesium no rodapé.
                const provider = await C.ArcGisMapServerImageryProvider.fromUrl(WORLD_IMAGERY, {
                    enablePickFeatures: false
                });
                if (viewer && !viewer.isDestroyed()) {
                    viewer.imageryLayers.addImageryProvider(provider);
                    host.classList.add('satellite-loaded');
                }
            }
            catch (err) {
                console.warn('URBS: Esri World Imagery indisponível; carregando ruas.', err);
                try {
                    viewer.imageryLayers.addImageryProvider(new C.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' }));
                    host.classList.add('osm-loaded');
                }
                catch (other) {
                    console.warn('URBS: camada geográfica indisponível.', other);
                }
            }
            lastTime = performance.now();
            function animate(now) {
                raf = requestAnimationFrame(animate);
                const dt = Math.min(.06, (now - lastTime) / 1000 || 0);
                lastTime = now;
                if (entering)
                    return;
                if (!switching && !dragging && !reduced && now - lastDrag > 2200)
                    globe.rotation.y += .014 * dt; // Reinicia ao soltar / ficar inativo.
                panX += (pointerX - panX) * Math.min(1, dt * 1.6);
                panY += (pointerY - panY) * Math.min(1, dt * 1.6);
                globeCamera();
            }
            raf = requestAnimationFrame(animate);
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
                else if (!raf) {
                    lastTime = performance.now();
                    raf = requestAnimationFrame(animate);
                }
            });
            window.addEventListener('pagehide', () => {
                cancelAnimationFrame(raf);
                if (viewer && !viewer.isDestroyed())
                    viewer.destroy();
                viewer = null;
            }, { once: true });
        }
        catch (err) {
            console.warn('URBS: CesiumJS indisponível.', err);
            fallback();
        }
    }
    // Arrastar no globo altera a longitude e latitude em tempo real. O globo
    // retoma sua rotação lenta após 2,2 s sem interação; nenhum controle Cesium interfere.
    planetZone.addEventListener('pointerdown', e => {
        if (entering || switching || e.button !== 0 || e.target.closest('.cesium-viewer-bottom'))
            return;
        dragging = true;
        dragX = e.clientX;
        dragY = e.clientY;
        lastDrag = performance.now();
        planetZone.classList.add('is-dragging');
        try {
            planetZone.setPointerCapture(e.pointerId);
        }
        catch (_) { }
    });
    planetZone.addEventListener('pointermove', e => {
        if (!dragging || entering)
            return;
        const dx = e.clientX - dragX, dy = e.clientY - dragY;
        globe.rotation.y -= dx * .006;
        panY = Math.max(-26, Math.min(26, panY + dy * .12));
        pointerY = panY;
        dragX = e.clientX;
        dragY = e.clientY;
        lastDrag = performance.now();
        globeCamera();
    });
    const stopDrag = () => { dragging = false; lastDrag = performance.now(); planetZone.classList.remove('is-dragging'); };
    planetZone.addEventListener('pointerup', stopDrag);
    planetZone.addEventListener('pointercancel', stopDrag);
    planetZone.addEventListener('lostpointercapture', stopDrag);
    document.addEventListener('pointermove', event => {
        if (reduced || entering || event.pointerType === 'touch')
            return;
        pointerX = (event.clientX / innerWidth - .5) * 2;
        if (!dragging)
            pointerY = (event.clientY / innerHeight - .5) * 2;
    }, { passive: true });
    // Alternância exatamente em 1,2 s: globo muda de metade + longitude da câmera.
    function switchMode(next) {
        if (entering || next === mode || switching)
            return;
        const toRegister = next === 'register';
        const outgoing = toRegister ? loginSide : registerSide;
        const incoming = toRegister ? registerSide : loginSide;
        const mobile = matchMedia('(max-width:760px)').matches;
        mode = next;
        root.dataset.mode = next;
        outgoing.inert = true;
        outgoing.setAttribute('aria-hidden', 'true');
        incoming.inert = false;
        incoming.removeAttribute('aria-hidden');
        incoming.style.pointerEvents = 'auto';
        outgoing.style.pointerEvents = 'none';
        const done = () => {
            incoming.style.visibility = 'visible';
            incoming.style.opacity = '1';
            incoming.style.transform = 'translateX(0px)';
            outgoing.style.visibility = 'hidden';
            switching = false;
        };
        if (!gsap || reduced) {
            planetZone.style.left = mobile ? '0%' : toRegister ? '0%' : '50%';
            globe.rotation.y += toRegister ? -1.7 : 1.7;
            outgoing.style.visibility = 'hidden';
            outgoing.style.opacity = '0';
            incoming.style.visibility = 'visible';
            done();
            globeCamera();
        }
        else {
            gsap.killTweensOf([planetZone, outgoing, incoming, globe.rotation]);
            switching = true;
            const tl = gsap.timeline({ onComplete: done });
            tl.to(outgoing, { autoAlpha: 0, x: toRegister ? -85 : 85, duration: .48, ease: 'power2.in' }, 0)
                .set(incoming, { visibility: 'visible', opacity: 0, x: toRegister ? 85 : -85 }, .35)
                .to(incoming, { autoAlpha: 1, x: 0, duration: .75, ease: 'power3.out' }, .45);
            if (!mobile)
                tl.to(planetZone, { left: toRegister ? '0%' : '50%', duration: 1.2, ease: 'power3.inOut' }, 0);
            tl.to(globe.rotation, { y: globe.rotation.y + (toRegister ? -1.7 : 1.7), duration: 1.2, ease: 'power2.inOut', onUpdate: globeCamera }, 0);
        }
        if (status)
            status.textContent = toRegister ? 'Cadastro à direita. Terra à esquerda.' : 'Login à esquerda. Terra à direita.';
    }
    document.querySelectorAll('[data-switch]').forEach(btn => btn.addEventListener('click', () => {
        const next = btn.dataset.switch;
        switchMode(next);
        setTimeout(() => document.getElementById(next === 'login' ? 'login-email' : 'register-name')?.focus({ preventScroll: true }), reduced ? 0 : 1250);
    }));
    document.querySelectorAll('.show-password').forEach(btn => btn.addEventListener('click', () => {
        const field = document.getElementById(btn.dataset.target);
        const show = field.type === 'password';
        field.type = show ? 'text' : 'password';
        btn.textContent = show ? 'OCULTAR' : 'MOSTRAR';
        btn.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
    }));
    function enterExperience(event) {
        event.preventDefault();
        if (entering)
            return;
        const form = event.currentTarget, error = form.querySelector('.field-error');
        error.textContent = '';
        if (!form.checkValidity()) {
            const field = form.querySelector(':invalid');
            error.textContent = field?.validity.typeMismatch ? 'Digite um e-mail válido.' : field?.validity.tooShort ? 'Campo com menos caracteres do que o mínimo exigido.' : 'Preencha todos os campos obrigatórios.';
            field?.focus();
            return;
        }
        if (form.id === 'register-form') {
            const pass = document.getElementById('register-password');
            const confirm = document.getElementById('register-confirm');
            if (pass.value !== confirm.value) {
                error.textContent = 'As senhas não coincidem.';
                confirm.focus();
                return;
            }
        }
        // Apenas demonstração: descarta os dados. Não cria contas e não verifica senhas.
        form.reset();
        entering = true;
        root.classList.add('is-departing');
        document.querySelectorAll('.submit-button,.switch-link').forEach(btn => btn.disabled = true);
        if (status)
            status.textContent = 'Viagem de demonstração até Montes Claros. Nenhuma conta foi acessada.';
        const beginFlight = () => {
            if (window.URBSGeoDescent)
                window.URBSGeoDescent.start();
            else {
                const overlay = document.querySelector('.arrival-overlay');
                overlay.style.display = 'flex';
                overlay.style.opacity = '1';
                setTimeout(() => location.assign('index.html'), 1500);
            }
        };
        // Primeiro desaparecem formulário e cabeçalho; só então aparece o Cesium.
        const elements = [...document.querySelectorAll('.form-side:not([aria-hidden="true"]),.topline,.bottomline')];
        if (gsap && !reduced) {
            gsap.to(elements, { autoAlpha: 0, y: -20, duration: .55, stagger: .035, ease: 'power2.inOut', onComplete: beginFlight });
        }
        else {
            elements.forEach(el => el.style.visibility = 'hidden');
            beginFlight();
        }
    }
    document.getElementById('login-form')?.addEventListener('submit', enterExperience);
    document.getElementById('register-form')?.addEventListener('submit', enterExperience);
    initGlobe();
})();
