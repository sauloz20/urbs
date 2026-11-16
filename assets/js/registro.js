document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("picker-map");
  const form = document.getElementById("report-form");
  const feedback = document.getElementById("form-feedback");
  const latitudeInput = document.getElementById("latitude");
  const longitudeInput = document.getElementById("longitude");
  const coordinates = document.getElementById("coordinates");
  const useLocation = document.getElementById("use-location");
  const description = document.getElementById("description");
  const descriptionCount = document.getElementById("description-count");
  const categorySelect = document.getElementById("category");
  if (!mapElement || !form || !window.UrbsData) return;

  if (!window.L) {
    coordinates.textContent = "O mapa não carregou. Você pode tentar novamente após recarregar a página.";
    feedback.textContent = "Para salvar, a localização precisa ser selecionada em um mapa disponível.";
    feedback.className = "form-feedback is-error";
    if (useLocation) useLocation.disabled = true;
    return;
  }

  const defaultCenter = [-16.7286, -43.8578];
  const map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: false }).setView(defaultCenter, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  let marker = null;
  function setPoint(latlng) {
    if (marker) marker.setLatLng(latlng);
    else marker = L.marker(latlng, { draggable: true, title: "Localização da ocorrência" }).addTo(map);
    latitudeInput.value = Number(latlng.lat).toFixed(6);
    longitudeInput.value = Number(latlng.lng).toFixed(6);
    coordinates.textContent = `Ponto selecionado: ${latitudeInput.value}, ${longitudeInput.value}`;
    marker.off("dragend").on("dragend", () => setPoint(marker.getLatLng()));
    feedback.textContent = "";
    feedback.className = "form-feedback";
  }

  map.on("click", (event) => setPoint(event.latlng));
  window.setTimeout(() => map.invalidateSize(), 120);

  const requestedCategory = new URLSearchParams(window.location.search).get("categoria");
  if (requestedCategory && [...categorySelect.options].some((option) => option.value === requestedCategory)) {
    categorySelect.value = requestedCategory;
  }

  description?.addEventListener("input", () => {
    if (descriptionCount) descriptionCount.textContent = String(description.value.length);
  });

  useLocation?.addEventListener("click", () => {
    if (!navigator.geolocation) {
      feedback.textContent = "A geolocalização não está disponível neste dispositivo. Selecione um ponto no mapa.";
      feedback.className = "form-feedback is-error";
      return;
    }
    useLocation.disabled = true;
    useLocation.setAttribute("aria-busy", "true");
    feedback.textContent = "Buscando sua localização…";
    feedback.className = "form-feedback";
    navigator.geolocation.getCurrentPosition((position) => {
      const point = L.latLng(position.coords.latitude, position.coords.longitude);
      map.setView(point, 16);
      setPoint(point);
      feedback.textContent = "Localização selecionada. Confira o ponto no mapa antes de salvar.";
      useLocation.disabled = false;
      useLocation.removeAttribute("aria-busy");
    }, () => {
      feedback.textContent = "Não foi possível acessar sua localização. Confira as permissões do dispositivo ou marque o ponto no mapa.";
      feedback.className = "form-feedback is-error";
      useLocation.disabled = false;
      useLocation.removeAttribute("aria-busy");
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!latitudeInput.value || !longitudeInput.value) {
      feedback.textContent = "Selecione um ponto no mapa antes de salvar.";
      feedback.className = "form-feedback is-error";
      coordinates.setAttribute("tabindex", "-1");
      coordinates.focus();
      return;
    }

    const formData = new FormData(form);
    const result = window.UrbsData.saveReport({
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || "Outro"),
      address: String(formData.get("address") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      lat: Number(formData.get("latitude")),
      lng: Number(formData.get("longitude"))
    });

    if (!result.ok) {
      feedback.textContent = result.reason === "storage"
        ? "Não foi possível salvar neste navegador. Verifique o espaço disponível ou as permissões de armazenamento."
        : "Confira o conteúdo do formulário e selecione um ponto válido no mapa.";
      feedback.className = "form-feedback is-error";
      return;
    }

    feedback.textContent = "Registro salvo somente neste navegador. Abrindo o mapa…";
    feedback.className = "form-feedback is-success";
    window.setTimeout(() => { window.location.href = "mapa.html?novo=1"; }, 700);
  });
});
