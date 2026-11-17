(function () {
    "use strict";
    const STORAGE_KEY = "urbs:reports";
    const STATUSES = ["Novo", "Em análise", "Em andamento", "Solucionado"];
    const CATEGORIES = [
        "Pavimentação",
        "Iluminação pública",
        "Acessibilidade",
        "Descarte irregular de resíduos",
        "Drenagem",
        "Sinalização",
        "Outro"
    ];
    const DEMO_REPORTS = [
        {
            id: "demo-pavimento",
            title: "Pavimentação — exemplo",
            category: "Pavimentação",
            address: "Área central · ponto demonstrativo",
            description: "Registro fictício usado apenas para apresentar a visualização do mapa.",
            lat: -16.7248,
            lng: -43.8631,
            status: "Em análise",
            createdAt: "2026-11-10T12:00:00.000Z",
            demo: true
        },
        {
            id: "demo-iluminacao",
            title: "Iluminação pública — exemplo",
            category: "Iluminação pública",
            address: "Setor urbano · ponto demonstrativo",
            description: "Exemplo fictício. Não representa uma ocorrência real nem um chamado oficial.",
            lat: -16.7315,
            lng: -43.8483,
            status: "Em andamento",
            createdAt: "2026-11-08T12:00:00.000Z",
            demo: true
        },
        {
            id: "demo-acessibilidade",
            title: "Calçada e acessibilidade — exemplo",
            category: "Acessibilidade",
            address: "Setor urbano · ponto demonstrativo",
            description: "Exemplo fictício para mostrar categoria, localização e estado de acompanhamento.",
            lat: -16.7169,
            lng: -43.8736,
            status: "Novo",
            createdAt: "2026-11-06T12:00:00.000Z",
            demo: true
        },
        {
            id: "demo-residuos",
            title: "Descarte de resíduos — exemplo",
            category: "Descarte irregular de resíduos",
            address: "Setor urbano · ponto demonstrativo",
            description: "Ponto ilustrativo. Os dados não correspondem a uma observação real.",
            lat: -16.7392,
            lng: -43.8674,
            status: "Solucionado",
            createdAt: "2026-11-03T12:00:00.000Z",
            demo: true
        },
        {
            id: "demo-drenagem",
            title: "Drenagem urbana — exemplo",
            category: "Drenagem",
            address: "Setor urbano · ponto demonstrativo",
            description: "Exemplo de demonstração para filtros e marcadores do protótipo.",
            lat: -16.7203,
            lng: -43.8408,
            status: "Novo",
            createdAt: "2026-10-30T12:00:00.000Z",
            demo: true
        }
    ];
    function normalizeReport(raw) {
        if (!raw || typeof raw !== "object")
            return null;
        const lat = Number(raw.lat ?? raw.latitude);
        const lng = Number(raw.lng ?? raw.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
            return null;
        const status = STATUSES.includes(raw.status) ? raw.status : "Novo";
        const category = CATEGORIES.includes(raw.category) ? raw.category : String(raw.category || "Outro");
        const createdAt = raw.createdAt && Number.isFinite(Date.parse(raw.createdAt))
            ? new Date(raw.createdAt).toISOString()
            : new Date().toISOString();
        return {
            id: String(raw.id || `local-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`),
            title: String(raw.title || "Ocorrência sem título").slice(0, 90),
            category,
            address: String(raw.address || "").slice(0, 140),
            description: String(raw.description || "").slice(0, 700),
            lat,
            lng,
            status,
            createdAt,
            demo: false
        };
    }
    function getStoredReports() {
        try {
            const value = localStorage.getItem(STORAGE_KEY);
            if (!value)
                return [];
            const parsed = JSON.parse(value);
            if (!Array.isArray(parsed))
                return [];
            return parsed.map(normalizeReport).filter(Boolean);
        }
        catch (error) {
            console.warn("Não foi possível ler os registros locais do URBS.", error);
            return [];
        }
    }
    function getAllReports() {
        return [...DEMO_REPORTS, ...getStoredReports()];
    }
    function saveReport(raw) {
        const report = normalizeReport({ ...raw, status: "Novo", createdAt: new Date().toISOString() });
        if (!report)
            return { ok: false, reason: "invalid" };
        const reports = getStoredReports();
        reports.unshift(report);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
            return { ok: true, report };
        }
        catch (error) {
            console.warn("Não foi possível salvar o registro local do URBS.", error);
            return { ok: false, reason: "storage" };
        }
    }
    function updateStatus(id, status) {
        if (!STATUSES.includes(status))
            return false;
        const reports = getStoredReports();
        const report = reports.find((item) => item.id === id);
        if (!report)
            return false;
        report.status = status;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
            return true;
        }
        catch (error) {
            console.warn("Não foi possível atualizar a situação local do URBS.", error);
            return false;
        }
    }
    function formatDate(value) {
        const date = new Date(value);
        if (!Number.isFinite(date.getTime()))
            return "Data indisponível";
        return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
    }
    window.UrbsData = Object.freeze({
        STORAGE_KEY,
        STATUSES: [...STATUSES],
        CATEGORIES: [...CATEGORIES],
        getStoredReports,
        getDemoReports: () => DEMO_REPORTS.map((report) => ({ ...report })),
        getAllReports,
        saveReport,
        updateStatus,
        formatDate
    });
})();
