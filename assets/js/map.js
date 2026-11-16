document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  const mapUnavailable = document.getElementById("map-unavailable");
  const data = window.UrbsData;
  if (!mapElement || !data) return;

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
    if (mapUnavailable) mapUnavailable.hidden = false;
    return;
  }

  const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: false }).setView(center, 13);
  // Satélite por padrão, como na experiência de entrada (Cesium).
  // Mapa de ruas permanece acessível pelo controle de camadas.
  const satellite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {maxZoom:19, attribution:'Imagens: Esri, Maxar, Earthstar Geographics e fornecedores de dados'}
  );
  const streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  // Nomes e limites em camada própria, sobre a fotografia de satélite.
  const labels = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    {maxZoom:19, opacity:.88, attribution:'Rótulos: Esri e colaboradores'}
  );
  satellite.addTo(map);
  labels.addTo(map);
  L.control.layers({'Satélite':satellite,'Ruas':streets},{'Nomes dos locais':labels}, {
    position:'topright', collapsed:true
  }).addTo(map);
  // Se o provedor estiver indisponível, não deixar a tela vazia.
  let tileErrorCount=0;
  satellite.on('tileerror',()=>{if(++tileErrorCount>=5 && map.hasLayer(satellite)){
    map.removeLayer(satellite);map.removeLayer(labels);streets.addTo(map);
  }});
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const markerLayer = L.featureGroup().addTo(map);
  const markersById = new Map();

  function normalizeText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
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
    if (report.demo) wrapper.append(makeElement("span", "demo-badge", "EXEMPLO FICTÍCIO"));
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
    if (report.demo) titleLine.append(makeElement("span", "demo-badge", "EXEMPLO"));
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
    if (!report.demo) actions.append(makeStatusSelect(report));
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
      const marker = L.circleMarker([report.lat, report.lng], {
        radius: report.demo ? 8 : 10,
        color: "#0b1a14",
        weight: 2,
        fillColor: categoryColors[report.category] || categoryColors.Outro,
        fillOpacity: .96
      }).addTo(markerLayer);
      marker.bindPopup(popupContent(report), { maxWidth: 260 });
      marker.on("click", () => {
        const card = [...list.querySelectorAll(".report-card")].find((item) => item.dataset.reportId === report.id);
        card?.classList.add("is-selected");
      });
      markersById.set(report.id, marker);
    });

    resultCount.textContent = String(reports.length);
    listCount.textContent = `${reports.length} ${reports.length === 1 ? "item" : "itens"}`;
    emptyState.hidden = reports.length > 0;

    if (reports.length > 0 && markerLayer.getBounds().isValid()) {
      map.fitBounds(markerLayer.getBounds().pad(.22), { maxZoom: 14 });
    } else {
      map.setView(center, 13);
    }
  }

  function focusReport(id) {
    const marker = markersById.get(id);
    if (!marker) return;
    const position = marker.getLatLng();
    map.setView(position, 16, { animate: true });
    marker.openPopup();
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
    if (button) focusReport(button.dataset.focusId);
  });

  list.addEventListener("change", (event) => {
    const select = event.target.closest("[data-status-for]");
    if (!select) return;
    const updated = data.updateStatus(select.dataset.statusFor, select.value);
    if (liveRegion) liveRegion.textContent = updated
      ? `Situação atualizada para ${select.value}. A atualização foi salva neste navegador.`
      : "Não foi possível atualizar a situação deste registro local.";
    render();
  });

  locateButton?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      if (liveRegion) liveRegion.textContent = "A geolocalização não está disponível neste dispositivo.";
      return;
    }
    locateButton.disabled = true;
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude], 15);
      locateButton.disabled = false;
      if (liveRegion) liveRegion.textContent = "Mapa centralizado na sua localização.";
    }, () => {
      locateButton.disabled = false;
      if (liveRegion) liveRegion.textContent = "Não foi possível obter sua localização. Confira as permissões do dispositivo.";
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });

  render();
  window.setTimeout(() => map.invalidateSize(), 120);
});
