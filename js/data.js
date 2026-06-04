// ============================================
// DATA MODULE - Initial Data & Data Management
// ============================================

const DataManager = (function() {
    'use strict';

    // Initial sample data
    const INITIAL_ASSETS = [
        {
            id: "1",
            entity: "0224",
            unit: "3100",
            kelas: "0029",
            nomorAset: "921309",
            nib: "2025-224-1-1-000064",
            tglPerolehan: "2025-10-17",
            aging: 195,
            range: "181-360",
            ket1: "PENGADAAN AC CASSETTE (TERMIN 1)",
            ket2: "DAIKIN 4 PK / TYPE SCC/SDMC",
            ket3: "GRK/12/033/2025",
            lokasi: "LT 2 KC GRESIK",
            wilayah: "Wilayah 06 (Surabaya)",
            hargaPerolehan: 155400000,
            perusahaan: "DAIKIN APPLIED SOLUTIONS",
            jenisAset: "Inventaris",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "2",
            entity: "0011",
            unit: "9999",
            kelas: "0021",
            nomorAset: "903933",
            nib: "-",
            tglPerolehan: "2025-01-15",
            aging: 470,
            range: "361-1000",
            ket1: "JS KONSUL PERENCN OUTLT BRANCH TRANSFORM",
            ket2: "PBY TERMIN 1(PAKET C JATENG II)",
            ket3: "PFA/4/VIII/37/R TGL 30/08/2024",
            lokasi: "KC SURAKARTA",
            wilayah: "Wilayah 05 (Semarang)",
            hargaPerolehan: 35996400,
            perusahaan: "Cipta Mitra Dinamika",
            jenisAset: "Bangunan",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "3",
            entity: "0018",
            unit: "9999",
            kelas: "0021",
            nomorAset: "869699",
            nib: "2023-723-1-9-000055",
            tglPerolehan: "2023-12-22",
            aging: 860,
            range: "361-1000",
            ket1: "PEMBANGUNAN BNI KCP KANAKA",
            ket2: "Kons.Prcn Termin 2",
            ket3: "PFA/2.2.3/IV/102/R Tgl 30-4-2018",
            lokasi: "Gedung BNI KCP Kanaka",
            wilayah: "Wilayah 11 (Manado)",
            hargaPerolehan: 87347438,
            perusahaan: "Triprima Karya",
            jenisAset: "Bangunan",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "4",
            entity: "0018",
            unit: "9999",
            kelas: "0021",
            nomorAset: "870122",
            nib: "-",
            tglPerolehan: "2024-01-10",
            aging: 841,
            range: "361-1000",
            ket1: "Samel Pekerjaan Konsultan Perencana",
            ket2: "Pby termin 2 Proyek Pembangunan Gedung",
            ket3: "PFA/2.2.3/IV/102/R tgl 30/04/2018",
            lokasi: "BNI KCP Kanaka",
            wilayah: "Wilayah 11 (Manado)",
            hargaPerolehan: 87347438,
            perusahaan: "PT Triprima Karya Konsultan",
            jenisAset: "Bangunan",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "5",
            entity: "0018",
            unit: "9999",
            kelas: "0021",
            nomorAset: "937900",
            nib: "-",
            tglPerolehan: "2025-11-21",
            aging: 160,
            range: "<180",
            ket1: "Pek Konsultan Perenc Proyek Pembangunan",
            ket2: "Pby termin 1 thp approval desain",
            ket3: "PFA/2.2.3/IV/102/R tgl 30/04/2018",
            lokasi: "BNI KCP Kanaka",
            wilayah: "Wilayah 11 (Manado)",
            hargaPerolehan: 122700000,
            perusahaan: "PT TRIPRIMA KARYA KONSULTAN",
            jenisAset: "Bangunan",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "6",
            entity: "0056",
            unit: "1200",
            kelas: "0029",
            nomorAset: "910243",
            nib: "-",
            tglPerolehan: "2025-05-10",
            aging: 389,
            range: "361-1000",
            ket1: "PENGADAAN SEKAT & INTERIOR COUNTER TELLER",
            ket2: "RENOVASI GEDUNG KCP GADING SERPONG",
            ket3: "SPK/056/IV/2025",
            lokasi: "KC TANGERANG",
            wilayah: "Wilayah 14 (Tangerang)",
            hargaPerolehan: 198000000,
            perusahaan: "PT Jasa Konstruksi Mandiri",
            jenisAset: "Inventaris",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "7",
            entity: "0043",
            unit: "4300",
            kelas: "0029",
            nomorAset: "934211",
            nib: "2025-043-2-1-000012",
            tglPerolehan: "2025-12-05",
            aging: 180,
            range: "181-360",
            ket1: "PENGADAAN SERVER HP PROLIANT",
            ket2: "UPGRADE INFRASTRUKTUR TI CABANG",
            ket3: "SPK/PFA/043/XI/2025",
            lokasi: "KC BANDUNG",
            wilayah: "Wilayah 04 (Bandung)",
            hargaPerolehan: 320000000,
            perusahaan: "PT Computrade Indonesia",
            jenisAset: "Inventaris",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        },
        {
            id: "8",
            entity: "0022",
            unit: "2200",
            kelas: "0021",
            nomorAset: "941210",
            nib: "-",
            tglPerolehan: "2026-02-15",
            aging: 108,
            range: "<180",
            ket1: "RENOVASI GEDUNG KANTOR CABANG UTAMA",
            ket2: "PEKERJAAN ELEKTRIKAL TERMIN 1",
            ket3: "SPK/NSD/022/II/2026",
            lokasi: "KC SURABAYA",
            wilayah: "Wilayah 06 (Surabaya)",
            hargaPerolehan: 450000000,
            perusahaan: "PT Sinar Terang Abadi",
            jenisAset: "Bangunan",
            statusProyek: "",
            timeline: "",
            kategoriAkuntansi: "",
            keteranganTindakLanjut: "",
            isConfirmed: false
        }
    ];

    // Current assets state
    let assets = Utils.deepClone(INITIAL_ASSETS);

    // Get all assets
    function getAssets() {
        return assets;
    }

    // Get asset by ID
    function getAssetById(id) {
        return assets.find(a => a.id === id);
    }

    // Update asset
    function updateAsset(id, updates) {
        assets = assets.map(asset => {
            if (asset.id === id) {
                return { ...asset, ...updates, isConfirmed: true };
            }
            return asset;
        });
        return getAssetById(id);
    }

    // Bulk update assets
    function bulkUpdate(ids, updates) {
        assets = assets.map(asset => {
            if (ids.includes(asset.id)) {
                return { ...asset, ...updates, isConfirmed: true };
            }
            return asset;
        });
    }

    // Set assets (for CSV import)
    function setAssets(newAssets) {
        assets = newAssets;
    }

    // Restore initial data
    function restoreInitialData() {
        if (confirm("Ingin merestore contoh data bawaan?")) {
            assets = Utils.deepClone(INITIAL_ASSETS);
            Utils.showToast("Kembali ke data contoh bawaan.");
            if (typeof App !== 'undefined' && App.refreshAppUI) {
                App.refreshAppUI();
            }
        }
    }

    // Get unique regions from assets
    function getUniqueRegions() {
        return [...new Set(assets.map(a => a.wilayah || "Wilayah Kerja"))].sort();
    }

    // Get unique asset types
    function getUniqueTypes() {
        return [...new Set(assets.map(a => a.jenisAset))].sort();
    }

    // Public API
    return {
        getAssets,
        getAssetById,
        updateAsset,
        bulkUpdate,
        setAssets,
        restoreInitialData,
        getUniqueRegions,
        getUniqueTypes,
        INITIAL_ASSETS
    };
})();