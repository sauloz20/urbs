document.addEventListener("DOMContentLoaded", () => {
    const mapElement = document.getElementById("map");
    const mapUnavailable = document.getElementById("map-unavailable");
    const data = window.UrbsData;
    if (!mapElement || !data)
        return;
    const center = [-16.7286, -43.8578];
    const otherCategory = { symbol: "•", color: "#cbd4ca" };
    const categoryMarkers = new Map([
        ["Pavimentação", { symbol: "║", color: "#f4a96e" }],
        ["Iluminação pública", { symbol: "✦", color: "#f8df75" }],
        ["Acessibilidade", { symbol: "♿︎", color: "#9ce0a3" }],
        ["Descarte irregular de resíduos", { symbol: "▤", color: "#c9b7f4" }],
        ["Drenagem", { symbol: "≋", color: "#8dcdf3" }],
        ["Sinalização", { symbol: "!", color: "#f6a6bf" }]
    ]);
    const statusColors = {
        "Novo": "#b8e954",
        "Em análise": "#e5a94a",
        "Em andamento": "#53c4aa",
        "Solucionado": "#6dae71"
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
    const activeFilterCount = document.getElementById("active-filter-count");
    const clearButton = document.getElementById("clear-filters");
    const locateButton = document.getElementById("locate-me");
    const liveRegion = document.getElementById("map-live-region");
    const actionFeedback = document.getElementById("report-action-feedback");
    const explorer = document.getElementById("occurrence-explorer");
    const explorerToggle = document.getElementById("explorer-toggle");
    const isMobile = window.matchMedia("(max-width: 760px)");
    if (explorer && explorerToggle) {
        explorer.dataset.expanded = "false";
        explorerToggle.addEventListener("click", () => {
            const expanded = explorer.dataset.expanded === "false";
            explorer.dataset.expanded = String(expanded);
            explorerToggle.setAttribute("aria-expanded", String(expanded));
        });
    }
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
        else
            wrapper.append(makeReportActions(report));
        return wrapper;
    }
    function showActionFeedback(message, error = false) {
        actionFeedback.classList.toggle("is-error", error);
        actionFeedback.textContent = message;
    }
    function makeReportActions(report) {
        const actions = makeElement("div", "report-management");
        const edit = makeElement("a", "report-action", "Editar");
        const remove = makeElement("button", "report-action report-action-delete", "Excluir");
        edit.href = `registro.html?${new URLSearchParams({ editar: report.id })}`;
        edit.setAttribute("aria-label", `Editar ocorrência: ${report.title}`);
        remove.type = "button";
        remove.setAttribute("aria-label", `Excluir ocorrência: ${report.title}`);
        remove.addEventListener("click", () => {
            if (!window.confirm(`Excluir “${report.title}”? Esta ação não pode ser desfeita.`))
                return;
            const result = data.deleteReport(report.id);
            if (!result.ok) {
                if (result.reason === "missing")
                    render();
                showActionFeedback(result.reason === "missing"
                    ? "Esta ocorrência já não está disponível neste navegador."
                    : "Não foi possível excluir a ocorrência neste navegador.", true);
                return;
            }
            render();
            showActionFeedback("Ocorrência excluída deste navegador.");
            const focusTarget = isMobile.matches && explorer?.dataset.expanded === "false" ? explorerToggle : locationFilter;
            focusTarget?.focus({ preventScroll: true });
        });
        actions.append(edit, remove);
        return actions;
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
        const category = makeElement("span", "report-card-category");
        const appearance = categoryMarkers.get(report.category) || otherCategory;
        const symbol = makeElement("span", "report-card-symbol", appearance.symbol);
        symbol.style.setProperty("background-color", appearance.color);
        symbol.setAttribute("aria-hidden", "true");
        category.append(symbol, makeElement("span", "", report.category));
        card.append(category);
        if (report.demo)
            topline.append(makeElement("span", "demo-badge", "EXEMPLO"));
        const badge = makeElement("span", `status-pill ${statusClass[report.status] || ""}`, report.status);
        topline.append(badge);
        card.append(topline);
        const titleLine = makeElement("h3");
        const focusButton = makeElement("button", "report-card-title", report.title);
        focusButton.type = "button";
        focusButton.dataset.focusId = report.id;
        focusButton.setAttribute("aria-pressed", "false");
        focusButton.setAttribute("aria-label", `Ver no mapa: ${report.title}`);
        titleLine.append(focusButton);
        card.append(titleLine);
        const meta = makeElement("div", "report-card-meta");
        meta.textContent = report.address || "Ponto marcado no mapa";
        card.append(meta);
        if (!report.demo) {
            const actions = makeReportActions(report);
            actions.append(makeStatusSelect(report));
            card.append(actions);
        }
        return card;
    }
    function makeReportMarker(report) {
        const pin = makeElement("span", report.demo ? "map-v19-pin map-v19-demo-pin" : "map-v19-pin");
        pin.setAttribute("aria-hidden", "true");
        const appearance = categoryMarkers.get(report.category) || otherCategory;
        pin.style.setProperty("--pin-color", appearance.color);
        pin.style.setProperty("--pin-status", statusColors[report.status] || statusColors.Novo);
        pin.append(
            makeElement("span", "map-pin-stem"),
            makeElement("span", "map-pin-head"),
            makeElement("span", "map-pin-status")
        );
        const icon = L.divIcon({
            className: "map-v19-pin-holder",
            html: pin.outerHTML,
            iconSize: [44, 48], iconAnchor: [22, 46], popupAnchor: [8, -45]
        });
        const label = `${report.title} · ${report.category} · ${report.status}`;
        const marker = L.marker([report.lat, report.lng], { icon, keyboard: true, title: label }).addTo(markerLayer);
        marker.getElement()?.setAttribute("aria-label", label);
        return marker;
    }
    function render() {
        const reports = getFilteredReports();
        markerLayer.clearLayers();
        markersById.clear();
        list.replaceChildren();
        reports.forEach((report) => {
            list.append(makeReportCard(report));
            const marker = makeReportMarker(report);
            marker.bindPopup(popupContent(report), { maxWidth: 260 });
            marker.on("popupopen", () => selectReport(report.id));
            markersById.set(report.id, marker);
        });
        resultCount.textContent = `${reports.length} ${reports.length === 1 ? "registro" : "registros"}`;
        const active = [categoryFilter, statusFilter].filter((field) => field?.value && field.value !== "all").length;
        activeFilterCount.hidden = active === 0;
        activeFilterCount.textContent = String(active);
        emptyState.hidden = reports.length > 0;
        if (reports.length > 0 && markerLayer.getBounds().isValid()) {
            map.fitBounds(markerLayer.getBounds().pad(.22), { maxZoom: 14, animate: false });
        }
        else {
            map.setView(center, 13);
        }
    }
    let selectedReportId = null;
    let pendingPopup = 0;
    function selectReport(id) {
        selectedReportId = id;
        list.querySelectorAll(".report-card").forEach((card) => {
            card.classList.toggle("is-selected", card.dataset.reportId === id);
            card.querySelector("[data-focus-id]").setAttribute("aria-pressed", String(card.dataset.reportId === id));
        });
        markersById.forEach((marker, markerId) => {
            const selected = markerId === id;
            marker.getElement()?.classList.toggle("is-selected", selected);
            marker.setZIndexOffset(selected ? 1000 : 0);
        });
    }
    function focusReport(id, animate = true) {
        const marker = markersById.get(id);
        if (!marker)
            return false;
        const position = marker.getLatLng();
        selectReport(id);
        window.clearTimeout(pendingPopup);
        if (animate) {
            map.flyTo(position, 16, { duration: 1.15 });
            pendingPopup = window.setTimeout(() => {
                if (markersById.get(id) === marker && selectedReportId === id)
                    marker.openPopup();
            }, 400);
        }
        else {
            map.setView(position, 16, { animate: false });
            marker.openPopup();
        }
        return true;
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
        if (button && focusReport(button.dataset.focusId, !isMobile.matches) && isMobile.matches) {
            mapElement.scrollIntoView({ block: "nearest", behavior: "instant" });
        }
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
    window.addEventListener("storage", (event) => {
        if (event.key === data.STORAGE_KEY || event.key === null)
            render();
    });
    window.addEventListener("pageshow", (event) => {
        if (event.persisted)
            render();
    });
    const params = new URLSearchParams(window.location.search);
    const editedReportId = params.get("editado");
    const requestedReportId = editedReportId || params.get("novo");
    window.setTimeout(() => {
        map.invalidateSize();
        if (requestedReportId && focusReport(requestedReportId, false)) {
            if (editedReportId)
                showActionFeedback("Alterações salvas. Ocorrência selecionada no mapa.");
            else if (liveRegion)
                liveRegion.textContent = "Registro salvo neste navegador. Ocorrência selecionada no mapa.";
            mapElement.scrollIntoView({ block: "nearest", behavior: "instant" });
        }
    }, 120);
});


