// ============================================
// DATA MODULE - Initial Data & Data Management
// ============================================
        
const DataManager = (function() {
    'use strict';

    // API Configuration
    const API_URL = 'https://sheetdb.io/api/v1/ie3ev71kg046h';
    
    // Initial sample data (fallback jika API tidak tersedia)
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
    let assets = [];
    let isLoading = false;
    let errorMessage = null;

    // ============ API FUNCTIONS ============
    
    // Load data from API
    async function loadDataFromAPI() {
        isLoading = true;
        errorMessage = null;
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (data && Array.isArray(data) && data.length > 0) {
                // Pastikan setiap item memiliki field yang diperlukan
                assets = data.map(item => ({
                    id: item.id || String(Date.now() + Math.random()),
                    entity: item.entity || "",
                    unit: item.unit || "",
                    kelas: item.kelas || "",
                    nomorAset: item.nomorAset || "",
                    nib: item.nib || "",
                    tglPerolehan: item.tglPerolehan || "",
                    aging: parseInt(item.aging) || 0,
                    range: item.range || "",
                    ket1: item.ket1 || "",
                    ket2: item.ket2 || "",
                    ket3: item.ket3 || "",
                    lokasi: item.lokasi || "",
                    wilayah: item.wilayah || "",
                    hargaPerolehan: parseInt(item.hargaPerolehan) || 0,
                    perusahaan: item.perusahaan || "",
                    jenisAset: item.jenisAset || "",
                    statusProyek: item.statusProyek || "",
                    timeline: item.timeline || "",
                    kategoriAkuntansi: item.kategoriAkuntansi || "",
                    keteranganTindakLanjut: item.keteranganTindakLanjut || "",
                    isConfirmed: item.isConfirmed === true || item.isConfirmed === "true"
                }));
                
                Utils.showToast("Data berhasil dimuat dari server");
                return true;
            } else {
                // Jika data kosong, gunakan data awal
                console.warn("Data dari API kosong, menggunakan data awal");
                assets = Utils.deepClone(INITIAL_ASSETS);
                Utils.showToast("Data awal digunakan (tidak ada data dari server)");
                return false;
            }
        } catch (error) {
            console.error("Error loading data from API:", error);
            errorMessage = error.message;
            // Fallback ke data awal jika API gagal
            assets = Utils.deepClone(INITIAL_ASSETS);
            Utils.showToast("Gagal memuat data dari server, menggunakan data lokal");
            return false;
        } finally {
            isLoading = false;
        }
    }

    // Save single asset to API
    async function saveAssetToAPI(asset) {
        try {
            // Cari berdasarkan ID
            const searchUrl = `${API_URL}/id/${asset.id}`;
            const checkResponse = await fetch(searchUrl);
            const existingData = await checkResponse.json();
            
            if (existingData && existingData.length > 0) {
                // Update existing record
                const updateUrl = `${API_URL}/id/${asset.id}`;
                const updateResponse = await fetch(updateUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(asset)
                });
                
                if (!updateResponse.ok) {
                    throw new Error(`Update failed: ${updateResponse.status}`);
                }
                return true;
            } else {
                // Create new record
                const createResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(asset)
                });
                
                if (!createResponse.ok) {
                    throw new Error(`Create failed: ${createResponse.status}`);
                }
                return true;
            }
        } catch (error) {
            console.error("Error saving asset to API:", error);
            Utils.showToast(`Gagal menyimpan ke server: ${error.message}`);
            return false;
        }
    }

    // Save all assets to API (bulk operation)
    async function saveAllAssetsToAPI() {
        isLoading = true;
        try {
            // SheetDB bulk update
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assets)
            });
            
            if (!response.ok) {
                throw new Error(`Bulk update failed: ${response.status}`);
            }
            
            Utils.showToast("Semua perubahan telah disimpan ke server");
            return true;
        } catch (error) {
            console.error("Error saving all assets to API:", error);
            Utils.showToast(`Gagal menyimpan ke server: ${error.message}`);
            return false;
        } finally {
            isLoading = false;
        }
    }

    // Initialize - load data from API when app starts
    async function initialize() {
        await loadDataFromAPI();
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
        return assets;
    }

    // Get all assets
    function getAssets() {
        return assets;
    }

    // Get asset by ID
    function getAssetById(id) {
        return assets.find(a => a.id === id);
    }

    // Update asset (sync with API)
    async function updateAsset(id, updates) {
        const index = assets.findIndex(a => a.id === id);
        if (index !== -1) {
            const updatedAsset = { ...assets[index], ...updates, isConfirmed: true };
            assets[index] = updatedAsset;
            
            // Save to API (async, tidak blocking UI)
            saveAssetToAPI(updatedAsset).then(success => {
                if (!success) {
                    console.warn(`Failed to sync asset ${id} to server`);
                }
            });
            
            return updatedAsset;
        }
        return null;
    }

    // Bulk update assets (sync with API)
    async function bulkUpdate(ids, updates) {
        const updatedAssets = [];
        assets = assets.map(asset => {
            if (ids.includes(asset.id)) {
                const updated = { ...asset, ...updates, isConfirmed: true };
                updatedAssets.push(updated);
                return updated;
            }
            return asset;
        });
        
        // Save all changes to API (async)
        if (updatedAssets.length > 0) {
            // Untuk bulk update, kita update setiap aset yang berubah
            const promises = updatedAssets.map(asset => saveAssetToAPI(asset));
            const results = await Promise.all(promises);
            const allSuccess = results.every(r => r === true);
            
            if (!allSuccess) {
                Utils.showToast("Beberapa perubahan gagal disimpan ke server");
            }
        }
    }

    // Set assets (for CSV import) - also sync to API
    async function setAssets(newAssets) {
        assets = newAssets;
        await saveAllAssetsToAPI();
    }

    // Restore initial data
    async function restoreInitialData() {
        if (confirm("Ingin merestore contoh data bawaan?")) {
            assets = Utils.deepClone(INITIAL_ASSETS);
            await saveAllAssetsToAPI();
            Utils.showToast("Kembali ke data contoh bawaan dan tersimpan di server.");
            if (typeof App !== 'undefined' && App.refreshAppUI) {
                App.refreshAppUI();
            }
        }
    }

    // Refresh data from API
    async function refreshFromAPI() {
        await loadDataFromAPI();
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
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

    // Get loading status
    function getIsLoading() {
        return isLoading;
    }

    // Get error message
    function getErrorMessage() {
        return errorMessage;
    }

    // Public API
    return {
        initialize,          // New: initialize and load data
        refreshFromAPI,      // New: manually refresh from API
        getAssets,
        getAssetById,
        updateAsset,         // Updated: async, syncs to API
        bulkUpdate,          // Updated: async, syncs to API
        setAssets,           // Updated: async, syncs to API
        restoreInitialData,  // Updated: async, syncs to API
        getUniqueRegions,
        getUniqueTypes,
        getIsLoading,
        getErrorMessage,
        INITIAL_ASSETS
    };
})();
