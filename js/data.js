// ============================================
// DATA MODULE - SheetDB API Integration
// Data tersimpan otomatis ke Google Spreadsheet via SheetDB
// ============================================

const DataManager = (function() {
    'use strict';

    // Konfigurasi SheetDB
    const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/ie3ev71kg046h';
    
    // Initial sample data (fallback jika API gagal)
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

    // Current assets state (cache lokal)
    let assets = [];

    // Status loading
    let isLoading = false;
    let lastError = null;

    // ========== FUNGSI API SHEETDB ==========

    /**
     * Load data dari SheetDB
     */
    async function loadFromSheetDB() {
        isLoading = true;
        lastError = null;
        
        try {
            const response = await fetch(SHEETDB_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data && Array.isArray(data) && data.length > 0) {
                // Konversi data dari SheetDB ke format asset
                // Perhatikan: nama kolom di spreadsheet harus sesuai!
                assets = data.map(row => normalizeAssetData(row));
                console.log(`✅ Loaded ${assets.length} assets from SheetDB`);
                return true;
            } else {
                // Jika spreadsheet kosong, gunakan data awal
                console.log('SheetDB kosong, menggunakan data awal');
                assets = Utils.deepClone(INITIAL_ASSETS);
                await syncAllToSheetDB(); // Upload data awal ke SheetDB
                return true;
            }
        } catch (error) {
            console.error('Failed to load from SheetDB:', error);
            lastError = error.message;
            
            // Fallback: gunakan data awal
            assets = Utils.deepClone(INITIAL_ASSETS);
            Utils.showToast('Gagal koneksi ke server. Data disimpan sementara di browser.', 'error');
            return false;
        } finally {
            isLoading = false;
        }
    }

    /**
     * Normalisasi data dari SheetDB ke format asset internal
     * SESUAIKAN nama kolom ini dengan spreadsheet Anda!
     */
    function normalizeAssetData(row) {
        return {
            id: row.id || row.ID || Utils.generateId(),
            entity: row.entity || row.Entity || "",
            unit: row.unit || row.Unit || "",
            kelas: row.kelas || row.Kelas || "",
            nomorAset: row.nomorAset || row.NomorAset || row["nomor aset"] || "",
            nib: row.nib || row.NIB || "-",
            tglPerolehan: row.tglPerolehan || row.TglPerolehan || row["tanggal perolehan"] || "",
            aging: parseInt(row.aging || row.Aging || 0),
            range: row.range || row.Range || "",
            ket1: row.ket1 || row.Ket1 || row["keterangan 1"] || "",
            ket2: row.ket2 || row.Ket2 || row["keterangan 2"] || "",
            ket3: row.ket3 || row.Ket3 || row["keterangan 3"] || "",
            lokasi: row.lokasi || row.Lokasi || "",
            wilayah: row.wilayah || row.Wilayah || "Wilayah Kerja",
            hargaPerolehan: parseFloat(row.hargaPerolehan || row.HargaPerolehan || row["harga perolehan"] || 0),
            perusahaan: row.perusahaan || row.Perusahaan || "",
            jenisAset: row.jenisAset || row.JenisAset || row["jenis aset"] || "Inventaris",
            statusProyek: row.statusProyek || row.StatusProyek || row["status proyek"] || "",
            timeline: row.timeline || row.Timeline || "",
            kategoriAkuntansi: row.kategoriAkuntansi || row.KategoriAkuntansi || row["kategori akuntansi"] || "",
            keteranganTindakLanjut: row.keteranganTindakLanjut || row.KeteranganTindakLanjut || row["keterangan tindak lanjut"] || "",
            isConfirmed: row.isConfirmed === true || row.isConfirmed === "true" || row.IsConfirmed === true || false
        };
    }

    /**
     * Sinkronkan SELURUH data ke SheetDB (replace)
     */
    async function syncAllToSheetDB() {
        try {
            // SheetDB menggunakan method POST untuk menulis data
            // Perhatikan: Anda mungkin perlu API key jika sheet diproteksi
            const response = await fetch(SHEETDB_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assets)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            console.log('✅ All data synced to SheetDB');
            return true;
        } catch (error) {
            console.error('Failed to sync to SheetDB:', error);
            Utils.showToast('Gagal menyimpan ke spreadsheet! Periksa koneksi.', 'error');
            return false;
        }
    }

    /**
     * Update single asset di SheetDB (berdasarkan ID)
     * SheetDB mendukung PATCH berdasarkan query parameter
     */
    async function updateAssetInSheetDB(id, updatedAsset) {
        try {
            // Method PATCH dengan query ?id=xxx
            const url = `${SHEETDB_API_URL}/id/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAsset)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            console.log(`✅ Asset ${id} updated in SheetDB`);
            return true;
        } catch (error) {
            console.error(`Failed to update asset ${id}:`, error);
            // Fallback: sync all data
            await syncAllToSheetDB();
            return false;
        }
    }

    /**
     * Tambah asset baru ke SheetDB
     */
    async function addAssetToSheetDB(newAsset) {
        try {
            const response = await fetch(SHEETDB_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAsset)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            console.log(`✅ New asset added to SheetDB`);
            return true;
        } catch (error) {
            console.error('Failed to add asset:', error);
            return false;
        }
    }

    // ========== FUNGSI PUBLIC (Sama seperti sebelumnya, tapi dengan sync ke SheetDB) ==========

    // Get all assets (load from SheetDB if needed)
    async function getAssets() {
        if (assets.length === 0) {
            await loadFromSheetDB();
        }
        return assets;
    }

    // Get asset by ID
    function getAssetById(id) {
        return assets.find(a => a.id === id);
    }

    // Update asset (lokal + sync ke SheetDB)
    async function updateAsset(id, updates) {
        // Update lokal
        let updatedAsset = null;
        assets = assets.map(asset => {
            if (asset.id === id) {
                updatedAsset = { ...asset, ...updates, isConfirmed: true };
                return updatedAsset;
            }
            return asset;
        });
        
        // Sinkronkan ke SheetDB
        if (updatedAsset) {
            await updateAssetInSheetDB(id, updatedAsset);
            Utils.showToast('Konfirmasi aset berhasil disimpan!', 'success');
        }
        
        // Trigger refresh UI
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
        
        return updatedAsset;
    }

    // Bulk update assets
    async function bulkUpdate(ids, updates) {
        // Update lokal
        const updatedAssets = [];
        assets = assets.map(asset => {
            if (ids.includes(asset.id)) {
                const updated = { ...asset, ...updates, isConfirmed: true };
                updatedAssets.push(updated);
                return updated;
            }
            return asset;
        });
        
        // Sinkronkan seluruh data ke SheetDB (lebih efisien daripada update satu per satu)
        await syncAllToSheetDB();
        Utils.showToast(`Berhasil memperbarui ${updatedAssets.length} aset!`, 'success');
        
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
    }

    // Set assets (for CSV import)
    async function setAssets(newAssets) {
        assets = newAssets;
        await syncAllToSheetDB();
        Utils.showToast(`Berhasil mengunggah ${assets.length} aset ke spreadsheet!`, 'success');
        
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
    }

    // Restore initial data
    async function restoreInitialData() {
        if (confirm("Ingin merestore contoh data bawaan? Data di spreadsheet akan ditimpa!")) {
            assets = Utils.deepClone(INITIAL_ASSETS);
            await syncAllToSheetDB();
            Utils.showToast("Kembali ke data contoh bawaan dan tersimpan di spreadsheet.");
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
    
    // Get loading status
    function isLoadingData() {
        return isLoading;
    }
    
    // Get last error
    function getLastError() {
        return lastError;
    }
    
    // Manual sync
    async function manualSync() {
        Utils.showToast('Menyinkronkan data...', 'success');
        await syncAllToSheetDB();
        await loadFromSheetDB();
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
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
        isLoadingData,
        getLastError,
        manualSync,
        INITIAL_ASSETS
    };
})();