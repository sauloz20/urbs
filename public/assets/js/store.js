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
    function readStoredReports() {
        const value = localStorage.getItem(STORAGE_KEY);
        if (value === null)
            return [];
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed))
            throw new Error("Formato de registros locais inválido.");
        return parsed.map((raw, index) => raw && typeof raw === "object"
            ? normalizeReport({ ...raw, id: raw.id || `legacy-${index}` })
            : null).filter(Boolean);
    }
    function getStoredReports() {
        try {
            return readStoredReports();
        }
        catch (error) {
            console.warn("Não foi possível ler os registros locais do URBS.", error);
            return [];
        }
    }
    function getAllReports() {
        return [...DEMO_REPORTS, ...getStoredReports()];
    }
    function getReport(id) {
        return getStoredReports().find((report) => report.id === id) || null;
    }
    function changeStoredReports(change) {
        try {
            const reports = readStoredReports();
            const result = change(reports);
            if (result.ok)
                localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
            return result;
        }
        catch (error) {
            console.warn("Não foi possível alterar os registros locais do URBS.", error);
            return { ok: false, reason: "storage" };
        }
    }
    function saveReport(raw) {
        const report = normalizeReport({ ...raw, status: "Novo", createdAt: new Date().toISOString() });
        if (!report)
            return { ok: false, reason: "invalid" };
        return changeStoredReports((reports) => {
            reports.unshift(report);
            return { ok: true, report };
        });
    }
    function updateReport(id, { title, category, address, description, lat, lng }) {
        return changeStoredReports((reports) => {
            const index = reports.findIndex((report) => report.id === id);
            if (index < 0)
                return { ok: false, reason: "missing" };
            const report = normalizeReport({ ...reports[index], title, category, address, description, lat, lng });
            if (!report)
                return { ok: false, reason: "invalid" };
            reports[index] = report;
            return { ok: true, report };
        });
    }
    function deleteReport(id) {
        return changeStoredReports((reports) => {
            const index = reports.findIndex((report) => report.id === id);
            if (index < 0)
                return { ok: false, reason: "missing" };
            const [report] = reports.splice(index, 1);
            return { ok: true, report };
        });
    }
    function updateStatus(id, status) {
        if (!STATUSES.includes(status))
            return false;
        return changeStoredReports((reports) => {
            const report = reports.find((item) => item.id === id);
            if (!report)
                return { ok: false, reason: "missing" };
            report.status = status;
            return { ok: true, report };
        }).ok;
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
        getReport,
        saveReport,
        updateReport,
        deleteReport,
        updateStatus,
        formatDate
    });
})();

