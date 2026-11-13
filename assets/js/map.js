document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement || !window.L) return;
  const center = [-16.7286, -43.8578];
  const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: false }).setView(center, 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  const colors = {
    "Iluminação pública": "#c7f36b", "Pavimentação": "#e9a35d",
    "Acessibilidade": "#7fc8c2", "Drenagem": "#80a9df",
    "Sinalização": "#d6a5e8", "Outro": "#d6ddd5"
  };
  const records = (() => {
    try { return JSON.parse(localStorage.getItem("urbs:reports") || "[]"); }
    catch { return []; }
  })();
  const layer = L.layerGroup().addTo(map);
  const count = document.getElementById("report-count");
  const empty = document.getElementById("empty-state");
  const filter = document.getElementById("category-filter");

  function render() {
    layer.clearLayers();
    const selected = filter.value;
    const visible = records.filter(item => selected === "all" || item.category === selected);
    visible.forEach(item => {
      const color = colors[item.category] || colors.Outro;
      const marker = L.circleMarker([Number(item.lat), Number(item.lng)], {
        radius: 9, color: "#071710", weight: 2, fillColor: color, fillOpacity: .95
      }).addTo(layer);
      const safe = value => String(value || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
      marker.bindPopup(`<div class="map-popup"><small>${safe(item.category)}</small><strong>${safe(item.title)}</strong><p>${safe(item.description)}</p><span>Registro local · ${new Date(item.createdAt).toLocaleDateString("pt-BR")}</span></div>`);
    });
    count.textContent = records.length;
    empty.hidden = records.length > 0;
    if (records.length && visible.length) {
      const bounds = layer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(.22), { maxZoom: 15 });
    }
  }
  filter.addEventListener("change", render);
  render();
});
