// ============================================
// DATA MODULE - SheetDB API Integration
// Data otomatis tersimpan ke Google Spreadsheet via SheetDB
// ============================================
// ✅ Cegah deklarasi ganda
if (typeof window.DataManager !== 'undefined') {
    console.warn('DataManager already exists, skipping re-declaration');
} else {
    window.DataManager = (function() {
        'use strict';
        
const DataManager = (function() {
    'use strict';

    // Konfigurasi SheetDB
    const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/ie3ev71kg046h';
    
    // Initial sample data (fallback jika API gagal atau spreadsheet kosong)
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
    let isLoading = false;
    let syncInProgress = false;

    // ========== FUNGSI NORMALISASI DATA ==========
    // ⚠️ SESUAIKAN NAMA KOLOM INI DENGAN SPREADSHEET ANDA!
    // Buka URL API di browser, lihat nama key-nya, lalu sesuaikan di bawah
    
    function normalizeAssetData(row) {
        return {
            id: row.id || row.ID || generateId(),
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

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // ========== FUNGSI API SHEETDB ==========

    /**
     * Load data dari SheetDB
     */
    async function loadFromSheetDB() {
        if (isLoading) return false;
        
        isLoading = true;
        
        try {
            const response = await fetch(SHEETDB_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data && Array.isArray(data) && data.length > 0) {
                // Konversi data dari SheetDB ke format asset
                assets = data.map(row => normalizeAssetData(row));
                console.log(`✅ Loaded ${assets.length} assets from SheetDB`);
                return true;
            } else {
                // Spreadsheet kosong, upload data awal
                console.log('SheetDB kosong, mengupload data awal...');
                assets = Utils.deepClone(INITIAL_ASSETS);
                await syncAllToSheetDB();
                return true;
            }
        } catch (error) {
            console.error('Failed to load from SheetDB:', error);
            // Fallback: gunakan data awal
            assets = Utils.deepClone(INITIAL_ASSETS);
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast('Gagal koneksi ke server. Data disimpan sementara di browser.', 'error');
            }
            return false;
        } finally {
            isLoading = false;
        }
    }

    /**
     * Sinkronkan SELURUH data ke SheetDB
     * SheetDB menggunakan method POST untuk mengganti seluruh data
     */
    async function syncAllToSheetDB() {
        if (syncInProgress) return false;
        
        syncInProgress = true;
        
        try {
            // Untuk mengganti seluruh data, SheetDB menggunakan method POST
            // Jika ingin update sebagian, bisa menggunakan PATCH
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
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast('Gagal menyimpan ke spreadsheet! Periksa koneksi.', 'error');
            }
            return false;
        } finally {
            syncInProgress = false;
        }
    }

    // ========== FUNGSI PUBLIC (Async) ==========

    /**
     * Get all assets (load dari SheetDB jika perlu)
     * ⚠️ INI ASYNC - panggil dengan await!
     */
    async function getAssets() {
        if (assets.length === 0) {
            await loadFromSheetDB();
        }
        return assets;
    }

    /**
     * Get asset by ID (sync - gunakan setelah data loaded)
     */
    function getAssetById(id) {
        return assets.find(a => a.id === id);
    }

    /**
     * Update asset (lokal + sync ke SheetDB)
     */
    async function updateAsset(id, updates) {
        let updatedAsset = null;
        
        // Update lokal
        assets = assets.map(asset => {
            if (asset.id === id) {
                updatedAsset = { ...asset, ...updates, isConfirmed: true };
                return updatedAsset;
            }
            return asset;
        });
        
        // Sinkronkan ke SheetDB (kirim seluruh data)
        if (updatedAsset) {
            await syncAllToSheetDB();
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast('Konfirmasi aset berhasil disimpan ke spreadsheet!', 'success');
            }
        }
        
        // Trigger refresh UI
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
        
        return updatedAsset;
    }

    /**
     * Bulk update assets
     */
    async function bulkUpdate(ids, updates) {
        const updatedCount = [];
        
        // Update lokal
        assets = assets.map(asset => {
            if (ids.includes(asset.id)) {
                updatedCount.push(asset.id);
                return { ...asset, ...updates, isConfirmed: true };
            }
            return asset;
        });
        
        // Sinkronkan seluruh data ke SheetDB
        if (updatedCount.length > 0) {
            await syncAllToSheetDB();
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast(`Berhasil memperbarui ${updatedCount.length} aset ke spreadsheet!`, 'success');
            }
        }
        
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
    }

    /**
     * Set assets (untuk CSV import)
     */
    async function setAssets(newAssets) {
        assets = newAssets;
        await syncAllToSheetDB();
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(`Berhasil mengunggah ${assets.length} aset ke spreadsheet!`, 'success');
        }
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
    }

    /**
     * Restore initial data
     */
    async function restoreInitialData() {
        if (confirm("Ingin merestore contoh data bawaan? Data di spreadsheet akan ditimpa!")) {
            assets = Utils.deepClone(INITIAL_ASSETS);
            await syncAllToSheetDB();
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast("Kembali ke data contoh bawaan dan tersimpan di spreadsheet.");
            }
            if (typeof App !== 'undefined' && App.refreshAppUI) {
                App.refreshAppUI();
            }
        }
    }

    /**
     * Get unique regions (sync - data harus sudah loaded)
     */
    function getUniqueRegions() {
        return [...new Set(assets.map(a => a.wilayah || "Wilayah Kerja"))].sort();
    }

    /**
     * Get unique asset types (sync)
     */
    function getUniqueTypes() {
        return [...new Set(assets.map(a => a.jenisAset))].sort();
    }
    
    /**
     * Manual sync (paksa sinkronisasi)
     */
    async function manualSync() {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast('Menyinkronkan data dengan spreadsheet...', 'success');
        }
        await syncAllToSheetDB();
        await loadFromSheetDB();
        if (typeof App !== 'undefined' && App.refreshAppUI) {
            App.refreshAppUI();
        }
    }
    
    /**
     * Cek status loading
     */
    function isLoadingData() {
        return isLoading;
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
        manualSync,
        isLoadingData,
        INITIAL_ASSETS
    };
})();
