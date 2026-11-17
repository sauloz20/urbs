document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    const mapUnavailable = document.getElementById("map-unavailable");
    const data = window.UrbsData;
    if (!mapElement || !data)
        return;
    const center = [-16.7286, -43.8578];
    const categoryColors = {
        "Pavimentação": "#b77c43",
        "Iluminação pública": "#799e32",
        "Acessibilidade": "#387f79",
        "Descarte irregular de resíduos": "#77619a",
        "Drenagem": "#4f7ca3",
        "Sinalização": "#bd7b4a",
        "Outro": "#637269"
    };
    const statusClass = {
        "Novo": "",
        "Em análise": "status-analysis",
        "Em andamento": "status-progress",
        "Solucionado": "status-solved"
    };
    const statusFilter = document.getElementById("status-filter");
    const categoryFilter = document.getElementById("category-filter");
    const locationFilter = document.getElementById("location-filter");
    const list = document.getElementById("report-list");
    const emptyState = document.getElementById("empty-state");
    const resultCount = document.getElementById("result-count");
    const listCount = document.getElementById("list-count");
    const clearButton = document.getElementById("clear-filters");
    const locateButton = document.getElementById("locate-me");
    const liveRegion = document.getElementById("map-live-region");
    if (!window.L) {
        if (mapUnavailable)
            mapUnavailable.hidden = false;
        return;
    }
    // Integração do mapa do TCC-Project: base OSM inicial, opção satélite Esri,
    // botões de camadas, recenter, zoom e transições flyTo; os registros continuam
    // vindo do armazenamento demonstrativo da URBS V18, sem exigir PHP/MySQL.
    const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: false, preferCanvas: true }).setView(center, 13);
    const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Imagens: Esri, Maxar, Earthstar Geographics e colaboradores'
    });
    const labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, opacity: .88, attribution: 'Rótulos: Esri'
    });
    let selectedLayer = 'light';
    streets.addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const lightButton = document.getElementById('btnLayerLight');
    const satButton = document.getElementById('btnLayerSat');
    function setMapLayer(mode) {
        if (mode !== 'light' && mode !== 'satellite')
            return;
        selectedLayer = mode;
        map.removeLayer(streets);
        map.removeLayer(satellite);
        map.removeLayer(labels);
        if (mode === 'satellite') {
            satellite.addTo(map);
            labels.addTo(map);
        }
        else {
            streets.addTo(map);
        }
        lightButton?.classList.toggle('is-active', mode === 'light');
        satButton?.classList.toggle('is-active', mode === 'satellite');
        lightButton?.setAttribute('aria-pressed', String(mode === 'light'));
        satButton?.setAttribute('aria-pressed', String(mode === 'satellite'));
        if (liveRegion)
            liveRegion.textContent = mode === 'light' ? 'Mapa de ruas selecionado.' : 'Visualização por satélite selecionada.';
    }
    lightButton?.addEventListener('click', () => setMapLayer('light'));
    satButton?.addEventListener('click', () => setMapLayer('satellite'));
    let failedSatelliteTiles = 0;
    satellite.on('tileerror', () => {
        if (selectedLayer === 'satellite' && ++failedSatelliteTiles >= 5) {
            setMapLayer('light');
            if (liveRegion)
                liveRegion.textContent = 'Imagens de satélite indisponíveis. Alternamos para o mapa de ruas.';
        }
    });
    const markerLayer = L.featureGroup().addTo(map);
    const markersById = new Map();
    const resetCityButton = document.getElementById('map-reset-city');
    const fitReportsButton = document.getElementById('map-fit-reports');
    function centerCity() { map.flyTo(center, 15, { duration: 1.25 }); }
    function showAllPoints() {
        if (markerLayer.getLayers().length && markerLayer.getBounds().isValid()) {
            map.flyToBounds(markerLayer.getBounds().pad(.22), { maxZoom: 14, duration: 1.35 });
        }
        else {
            centerCity();
        }
    }
    resetCityButton?.addEventListener('click', centerCity);
    fitReportsButton?.addEventListener('click', showAllPoints);
    function normalizeText(value) {
        return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
    }
    function makeElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className)
            element.className = className;
        if (text !== undefined)
            element.textContent = text;
        return element;
    }
    function getFilteredReports() {
        const category = categoryFilter?.value || "all";
        const status = statusFilter?.value || "all";
        const term = normalizeText(locationFilter?.value || "").trim();
        return data.getAllReports().filter((report) => {
            const matchesCategory = category === "all" || report.category === category;
            const matchesStatus = status === "all" || report.status === status;
            const haystack = normalizeText(`${report.address} ${report.title} ${report.description}`);
            return matchesCategory && matchesStatus && (!term || haystack.includes(term));
        }).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    }
    function popupContent(report) {
        const wrapper = makeElement("div", "map-popup");
        wrapper.append(makeElement("small", "", report.category));
        wrapper.append(makeElement("strong", "", report.title));
        wrapper.append(makeElement("p", "", report.description));
        wrapper.append(makeElement("span", "popup-meta", `${report.address || "Localização marcada no mapa"} · ${data.formatDate(report.createdAt)} · ${report.status}`));
        if (report.demo)
            wrapper.append(makeElement("span", "demo-badge", "EXEMPLO FICTÍCIO"));
        return wrapper;
    }
    function makeStatusSelect(report) {
        const select = document.createElement("select");
        select.className = "status-select";
        select.dataset.statusFor = report.id;
        select.setAttribute("aria-label", `Atualizar situação de ${report.title}`);
        data.STATUSES.forEach((status) => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            option.selected = status === report.status;
            select.append(option);
        });
        return select;
    }
    function makeReportCard(report) {
        const card = makeElement("article", "report-card");
        card.dataset.reportId = report.id;
        const topline = makeElement("div", "report-card-topline");
        topline.append(makeElement("span", "report-category", report.category));
        const badge = makeElement("span", `status-pill ${statusClass[report.status] || ""}`, report.status);
        topline.append(badge);
        card.append(topline);
        const titleLine = makeElement("h3", "", report.title);
        if (report.demo)
            titleLine.append(makeElement("span", "demo-badge", "EXEMPLO"));
        card.append(titleLine);
        card.append(makeElement("p", "", report.description));
        const meta = makeElement("div", "report-card-meta");
        meta.append(makeElement("span", "", report.address || "Ponto marcado no mapa"));
        meta.append(makeElement("span", "", data.formatDate(report.createdAt)));
        card.append(meta);
        const actions = makeElement("div", "report-card-actions");
        const focusButton = makeElement("button", "focus-report", "Ver no mapa");
        focusButton.type = "button";
        focusButton.dataset.focusId = report.id;
        actions.append(focusButton);
        if (!report.demo)
            actions.append(makeStatusSelect(report));
        card.append(actions);
        return card;
    }
    function render() {
        const reports = getFilteredReports();
        markerLayer.clearLayers();
        markersById.clear();
        list.replaceChildren();
        reports.forEach((report) => {
            list.append(makeReportCard(report));
            // Pinos em gota por situação, adaptados da interface do TCC-Project.
            const pinColor = {
                'Novo': '#b8e954', 'Em análise': '#e5a94a',
                'Em andamento': '#53c4aa', 'Solucionado': '#6dae71'
            }[report.status] || '#b8e954';
            const pin = document.createElement('span');
            pin.className = 'map-v19-pin' + (report.demo ? ' map-v19-demo-pin' : '');
            pin.style.setProperty('--pin-color', pinColor);
            const icon = L.divIcon({
                className: 'map-v19-pin-holder',
                html: pin.outerHTML,
                iconSize: [30, 38], iconAnchor: [15, 36], popupAnchor: [0, -33]
            });
            const marker = L.marker([report.lat, report.lng], {
                icon, keyboard: true, title: report.title, alt: report.title
            }).addTo(markerLayer);
            marker.bindPopup(popupContent(report), { maxWidth: 260 });
            marker.on('click', () => {
                list.querySelectorAll('.report-card').forEach((card) => {
                    card.classList.toggle('is-selected', card.dataset.reportId === report.id);
                });
            });
            markersById.set(report.id, marker);
        });
        resultCount.textContent = String(reports.length);
        listCount.textContent = `${reports.length} ${reports.length === 1 ? "item" : "itens"}`;
        emptyState.hidden = reports.length > 0;
        if (reports.length > 0 && markerLayer.getBounds().isValid()) {
            map.fitBounds(markerLayer.getBounds().pad(.22), { maxZoom: 14, animate: false });
        }
        else {
            map.setView(center, 13);
        }
    }
    function focusReport(id) {
        const marker = markersById.get(id);
        if (!marker)
            return;
        const position = marker.getLatLng();
        map.flyTo(position, 16, { duration: 1.15 });
        window.setTimeout(() => marker.openPopup(), 400);
        list.querySelectorAll(".report-card").forEach((card) => {
            const selected = card.dataset.reportId === id;
            card.classList.toggle("is-selected", selected);
        });
    }
    [categoryFilter, statusFilter].forEach((field) => field?.addEventListener("change", render));
    locationFilter?.addEventListener("input", render);
    clearButton?.addEventListener("click", () => {
        categoryFilter.value = "all";
        statusFilter.value = "all";
        locationFilter.value = "";
        render();
        locationFilter.focus();
    });
    list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-focus-id]");
        if (button)
            focusReport(button.dataset.focusId);
    });
    list.addEventListener("change", (event) => {
        const select = event.target.closest("[data-status-for]");
        if (!select)
            return;
        const updated = data.updateStatus(select.dataset.statusFor, select.value);
        if (liveRegion)
            liveRegion.textContent = updated
                ? `Situação atualizada para ${select.value}. A atualização foi salva neste navegador.`
                : "Não foi possível atualizar a situação deste registro local.";
        render();
    });
    locateButton?.addEventListener("click", () => {
        if (!navigator.geolocation) {
            if (liveRegion)
                liveRegion.textContent = "A geolocalização não está disponível neste dispositivo.";
            return;
        }
        locateButton.disabled = true;
        navigator.geolocation.getCurrentPosition((position) => {
            map.flyTo([position.coords.latitude, position.coords.longitude], 16, { duration: 1.25 });
            locateButton.disabled = false;
            if (liveRegion)
                liveRegion.textContent = "Mapa centralizado na sua localização.";
        }, () => {
            locateButton.disabled = false;
            if (liveRegion)
                liveRegion.textContent = "Não foi possível obter sua localização. Confira as permissões do dispositivo.";
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    });
    render();
    window.setTimeout(() => map.invalidateSize(), 120);
});
