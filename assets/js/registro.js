document.addEventListener("DOMContentLoaded", () => {
  const mapEl = document.getElementById("picker-map");
  if (!mapEl || !window.L) return;
  const map = L.map(mapEl, { scrollWheelZoom: false }).setView([-16.7286, -43.8578], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  let marker = null;
  const latInput = document.getElementById("latitude");
  const lngInput = document.getElementById("longitude");
  const coordinates = document.getElementById("coordinates");
  const feedback = document.getElementById("form-feedback");

  function setPoint(latlng) {
    if (marker) marker.setLatLng(latlng);
    else marker = L.marker(latlng, { draggable: true }).addTo(map);
    latInput.value = latlng.lat.toFixed(6);
    lngInput.value = latlng.lng.toFixed(6);
    coordinates.textContent = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
    marker.off("dragend").on("dragend", () => setPoint(marker.getLatLng()));
  }
  map.on("click", event => setPoint(event.latlng));

  document.getElementById("report-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!latInput.value || !lngInput.value) {
      feedback.textContent = "Selecione um ponto no mapa antes de salvar.";
      feedback.className = "form-feedback is-error";
      return;
    }
    const reports = (() => {
      try { return JSON.parse(localStorage.getItem("urbs:reports") || "[]"); }
      catch { return []; }
    })();
    const data = new FormData(form);
    const record = {
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      title: String(data.get("title")).trim(),
      category: String(data.get("category")),
      address: String(data.get("address") || "").trim(),
      description: String(data.get("description")).trim(),
      lat: Number(data.get("latitude")),
      lng: Number(data.get("longitude")),
      createdAt: new Date().toISOString()
    };
    reports.push(record);
    try {
      localStorage.setItem("urbs:reports", JSON.stringify(reports));
      feedback.textContent = "Registro salvo neste navegador. Abrindo o mapa…";
      feedback.className = "form-feedback is-success";
      window.setTimeout(() => { window.location.href = "mapa.html"; }, 900);
    } catch {
      feedback.textContent = "Não foi possível salvar neste navegador. Verifique o armazenamento disponível.";
      feedback.className = "form-feedback is-error";
    }
  });
});
