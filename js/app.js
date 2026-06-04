// ============================================
// APP MODULE - Main Application Logic
// ============================================

const App = (function() {
    'use strict';

    // Application state
    let currentRole = "NSD";
    let bulkSelection = [];
    let filterWilayah = "ALL";

    // DOM Elements cache
    const elements = {};

    // Initialize app
    function init() {
        cacheElements();
        attachEventListeners();
        handleRoleChange("NSD");
        refreshAppUI();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Cache DOM elements
    function cacheElements() {
        elements.roleSelector = document.getElementById('role-selector');
        elements.roleAlertText = document.getElementById('role-alert-text');
        elements.roleAlertBanner = document.getElementById('role-alert-banner');
        elements.navUploadBtn = document.getElementById('btn-nav-upload-csv');
        elements.sidebarUploadBtn = document.getElementById('btn-sidebar-upload');
        elements.sidebarRestoreBtn = document.getElementById('btn-sidebar-restore');
        elements.csvFileInput = document.getElementById('csv-file-input');
        elements.searchInput = document.getElementById('search-input');
        elements.filterRegion = document.getElementById('filter-region-select');
        elements.filterJenis = document.getElementById('filter-jenis-select');
        elements.filterUrgency = document.getElementById('filter-urgency-select');
        elements.filterStatus = document.getElementById('filter-status-select');
        elements.selectAllCheckbox = document.getElementById('select-all-checkbox');
        elements.bulkActionsPanel = document.getElementById('bulk-actions-panel');
        elements.selectedAssetsCount = document.getElementById('selected-assets-count');
        elements.resetFiltersBar = document.getElementById('reset-filters-bar');
        elements.tableResultsLabel = document.getElementById('table-results-label');
        elements.pendingCountBadge = document.getElementById('pending-count-badge');
        elements.progressText = document.getElementById('progress-text');
        elements.progressBar = document.getElementById('progress-bar');
        elements.completionText = document.getElementById('completion-text');
        elements.pendingItemsCount = document.getElementById('pending-items-count');
    }

    // Attach event listeners
    function attachEventListeners() {
        if (elements.roleSelector) {
            elements.roleSelector.addEventListener('change', (e) => handleRoleChange(e.target.value));
        }
        
        if (elements.csvFileInput) {
            elements.csvFileInput.addEventListener('change', handleCSVUpload);
        }
        
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', Utils.debounce(handleSearchFilterChange, 300));
        }
    }

    // Handle role change (NSD Admin vs Wilayah User)
    function handleRoleChange(role) {
        currentRole = role;
        
        if (currentRole === 'NSD') {
            elements.roleAlertBanner.className = "bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between no-print";
            elements.roleAlertText.innerHTML = "Saat ini Anda menggunakan hak akses penuh <strong>Divisi NSD (Admin)</strong>. Semua fitur diaktifkan.";
            
            if (elements.navUploadBtn) elements.navUploadBtn.classList.remove('hidden');
            if (elements.sidebarUploadBtn) elements.sidebarUploadBtn.classList.remove('hidden');
            if (elements.sidebarRestoreBtn) elements.sidebarRestoreBtn.classList.remove('hidden');
            
            Utils.showToast("Akses admin diaktifkan (Divisi NSD)");
        } else {
            elements.roleAlertBanner.className = "bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 mb-6 shadow-sm flex items-center justify-between no-print";
            elements.roleAlertText.innerHTML = "Saat ini Anda masuk sebagai <strong>Kantor Wilayah (User)</strong>. Fitur upload data & pengaturan struktur database dinonaktifkan.";
            
            if (elements.navUploadBtn) elements.navUploadBtn.classList.add('hidden');
            if (elements.sidebarUploadBtn) elements.sidebarUploadBtn.classList.add('hidden');
            if (elements.sidebarRestoreBtn) elements.sidebarRestoreBtn.classList.add('hidden');
            
            Utils.showToast("Kewenangan dibatasi (Kantor Wilayah)", "error");
        }
        
        refreshAppUI();
    }

    // Get filtered assets based on search and filter criteria
    function getFilteredAssets() {
        const searchTerm = elements.searchInput ? elements.searchInput.value.toLowerCase() : "";
        const filterJenis = elements.filterJenis ? elements.filterJenis.value : "ALL";
        const filterUrgency = elements.filterUrgency ? elements.filterUrgency.value : "ALL";
        const filterStatus = elements.filterStatus ? elements.filterStatus.value : "ALL";
        const filterRegion = elements.filterRegion ? elements.filterRegion.value : "ALL";
        
        const assets = DataManager.getAssets();
        
        const hasActiveFilters = searchTerm || filterJenis !== 'ALL' || filterUrgency !== 'ALL' || filterStatus !== 'ALL' || filterRegion !== 'ALL';
        if (elements.resetFiltersBar) {
            elements.resetFiltersBar.classList.toggle('hidden', !hasActiveFilters);
        }
        
        return assets.filter(asset => {
            const matchesSearch = 
                asset.nomorAset.toLowerCase().includes(searchTerm) ||
                asset.ket1.toLowerCase().includes(searchTerm) ||
                asset.lokasi.toLowerCase().includes(searchTerm) ||
                asset.perusahaan.toLowerCase().includes(searchTerm);
            
            const matchesJenis = filterJenis === 'ALL' || asset.jenisAset === filterJenis;
            
            const criticalState = Utils.isCritical(asset);
            const matchesUrgency = 
                filterUrgency === 'ALL' || 
                (filterUrgency === 'CRITICAL' && criticalState) || 
                (filterUrgency === 'NORMAL' && !criticalState);
            
            const matchesConfirmation = 
                filterStatus === 'ALL' ||
                (filterStatus === 'CONFIRMED' && asset.isConfirmed) ||
                (filterStatus === 'PENDING' && !asset.isConfirmed);
            
            const matchesRegion = filterRegion === 'ALL' || (asset.wilayah || "Wilayah Kerja") === filterRegion;
            
            return matchesSearch && matchesJenis && matchesUrgency && matchesConfirmation && matchesRegion;
        });
    }

    // Handle search/filter changes
    function handleSearchFilterChange() {
        filterWilayah = elements.filterRegion ? elements.filterRegion.value : "ALL";
        populateRegionCards();
        renderLedgerTable();
    }

    // Reset all filters
    function resetAllFilters() {
        if (elements.searchInput) elements.searchInput.value = "";
        if (elements.filterJenis) elements.filterJenis.value = "ALL";
        if (elements.filterUrgency) elements.filterUrgency.value = "ALL";
        if (elements.filterStatus) elements.filterStatus.value = "ALL";
        if (elements.filterRegion) elements.filterRegion.value = "ALL";
        filterWilayah = "ALL";
        refreshAppUI();
        Utils.showToast("Filter berhasil di-reset ke default.");
    }

    // Calculate metrics and update dashboard
    function calculateMetricsAndProgress() {
        const assets = DataManager.getAssets();
        let totalValue = 0;
        let buildingCriticalCount = 0;
        let buildingCriticalValue = 0;
        let inventoryCriticalCount = 0;
        let inventoryCriticalValue = 0;
        let confirmedCount = 0;
        
        assets.forEach(asset => {
            totalValue += asset.hargaPerolehan;
            const isCrit = Utils.isCritical(asset);
            
            if (asset.jenisAset === 'Bangunan') {
                if (isCrit) {
                    buildingCriticalCount++;
                    buildingCriticalValue += asset.hargaPerolehan;
                }
            } else {
                if (isCrit) {
                    inventoryCriticalCount++;
                    inventoryCriticalValue += asset.hargaPerolehan;
                }
            }
            
            if (asset.isConfirmed) confirmedCount++;
        });
        
        const completionRate = assets.length ? Math.round((confirmedCount / assets.length) * 100) : 0;
        const pendingCount = assets.length - confirmedCount;
        
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        const completionText = document.getElementById('completion-text');
        const pendingItemsCount = document.getElementById('pending-items-count');
        const pendingCountBadge = document.getElementById('pending-count-badge');
        const kpiTotalVal = document.getElementById('kpi-total-val');
        const kpiTotalCount = document.getElementById('kpi-total-count');
        const kpiBuildingCritVal = document.getElementById('kpi-building-crit-val');
        const kpiBuildingCritCount = document.getElementById('kpi-building-crit-count');
        const kpiInventoryCritVal = document.getElementById('kpi-inventory-crit-val');
        const kpiInventoryCritCount = document.getElementById('kpi-inventory-crit-count');
        
        if (progressText) progressText.textContent = `${completionRate}% Selesai`;
        if (progressBar) progressBar.style.width = `${completionRate}%`;
        if (completionText) completionText.innerHTML = `<strong>${confirmedCount}</strong> dari <strong>${assets.length}</strong> aset telah dikonfirmasi dan ditetapkan rencana tindak lanjutnya.`;
        if (pendingItemsCount) pendingItemsCount.textContent = `${pendingCount} Item`;
        if (pendingCountBadge) pendingCountBadge.textContent = pendingCount;
        if (kpiTotalVal) kpiTotalVal.textContent = Utils.formatIDR(totalValue);
        if (kpiTotalCount) kpiTotalCount.textContent = assets.length;
        if (kpiBuildingCritVal) kpiBuildingCritVal.textContent = Utils.formatIDR(buildingCriticalValue);
        if (kpiBuildingCritCount) kpiBuildingCritCount.textContent = buildingCriticalCount;
        if (kpiInventoryCritVal) kpiInventoryCritVal.textContent = Utils.formatIDR(inventoryCriticalValue);
        if (kpiInventoryCritCount) kpiInventoryCritCount.textContent = inventoryCriticalCount;
    }

    // Populate region cards in workspace
    function populateRegionCards() {
        const assets = DataManager.getAssets();
        const metricsMap = {};
        
        assets.forEach(asset => {
            const w = asset.wilayah || "Wilayah Kerja";
            if (!metricsMap[w]) {
                metricsMap[w] = { totalValue: 0, count: 0, confirmed: 0, critical: 0 };
            }
            metricsMap[w].totalValue += asset.hargaPerolehan;
            metricsMap[w].count += 1;
            if (asset.isConfirmed) metricsMap[w].confirmed += 1;
            if (Utils.isCritical(asset)) metricsMap[w].critical += 1;
        });
        
        const container = document.getElementById('regional-metrics-grid');
        if (!container) return;
        
        container.innerHTML = "";
        
        Object.keys(metricsMap).sort().forEach(wName => {
            const reg = metricsMap[wName];
            const percent = Math.round((reg.confirmed / reg.count) * 100);
            const isActive = filterWilayah === wName;
            
            const card = document.createElement('div');
            card.className = `p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive 
                    ? 'border-bni-teal bg-teal-50/50 ring-2 ring-bni-teal/20' 
                    : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100'
            }`;
            card.onclick = () => selectRegionFilter(wName);
            
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start gap-2">
                        <span class="font-bold text-xs text-slate-800 truncate block max-w-[130px]">${wName}</span>
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-750 shrink-0">${reg.count} Aset</span>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-505 block mt-1">${Utils.formatIDR(reg.totalValue)}</span>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100">
                    <div class="flex justify-between items-center text-[10px] mb-1">
                        <span class="text-slate-500">Konfirmasi (${reg.confirmed}/${reg.count})</span>
                        <span class="font-bold text-bni-teal">${percent}%</span>
                    </div>
                    <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-bni-teal h-1.5 rounded-full transition-all duration-300" style="width: ${percent}%"></div>
                    </div>
                    ${reg.critical > 0 ? `
                        <span class="text-[9px] text-red-655 font-bold block mt-1.5 flex items-center gap-0.5">
                            <i data-lucide="alert-triangle" class="w-2.5 h-2.5 shrink-0"></i> ${reg.critical} Aset Aging Kritis
                        </span>
                    ` : ''}
                </div>
            `;
            container.appendChild(card);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Populate region dropdown
    function populateRegionDropdown() {
        const regions = DataManager.getUniqueRegions();
        const select = elements.filterRegion;
        if (!select) return;
        
        const currentSelected = select.value;
        select.innerHTML = '<option value="ALL">Semua Wilayah</option>';
        regions.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w;
            opt.textContent = w;
            select.appendChild(opt);
        });
        select.value = currentSelected;
    }

    // Select region filter from card
    function selectRegionFilter(regionName) {
        filterWilayah = filterWilayah === regionName ? 'ALL' : regionName;
        if (elements.filterRegion) elements.filterRegion.value = filterWilayah;
        handleSearchFilterChange();
    }

    // Render main ledger table
    function renderLedgerTable() {
        const filtered = getFilteredAssets();
        const tbody = document.getElementById('ledger-table-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = "";
        
        if (elements.tableResultsLabel) {
            elements.tableResultsLabel.textContent = `Daftar Kerja Monitoring (Ditemukan ${filtered.length} Aset)`;
        }
        
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="py-8 text-center text-slate-400 font-medium">
                        Tidak ada aset yang cocok dengan filter yang dipilih.
                    </td>
                </tr>
            `;
            return;
        }
        
        filtered.forEach(asset => {
            const criticalState = Utils.isCritical(asset);
            const isSelected = bulkSelection.includes(asset.id);
            const disabledCheckboxAttr = (currentRole === 'Wilayah') ? 'disabled' : '';
            
            let statusBadge = `
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded-lg bg-slate-50">
                    <i data-lucide="clock" class="w-3 h-3"></i> Belum Konfirmasi
                </span>
            `;
            
            if (asset.isConfirmed) {
                let colorClass = "bg-blue-600";
                let iconName = "clock";
                if (asset.statusProyek === 'Done') { colorClass = "bg-emerald-600"; iconName = "check-circle"; }
                if (asset.statusProyek === 'Cancel') { colorClass = "bg-red-600"; iconName = "x-circle"; }
                
                statusBadge = `
                    <div class="space-y-1">
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase ${colorClass}">
                            <i data-lucide="${iconName}" class="w-3 h-3 text-white"></i>
                            ${asset.statusProyek}
                        </span>
                        ${asset.statusProyek === 'On Going' ? `<div class="text-[10px] text-slate-505 font-medium">Timeline: ${asset.timeline}</div>` : ''}
                    </div>
                `;
            }
            
            const tr = document.createElement('tr');
            tr.className = `hover:bg-slate-50 transition-all ${asset.isConfirmed ? 'bg-emerald-50/10' : ''}`;
            
            tr.innerHTML = `
                <td class="py-4 px-4 text-center">
                    <input type="checkbox" onchange="App.toggleAssetSelection('${asset.id}')" ${isSelected ? 'checked' : ''} ${disabledCheckboxAttr} class="rounded text-bni-teal focus:ring-bni-teal disabled:opacity-45 disabled:cursor-not-allowed">
                </td>
                <td class="py-4 px-4">
                    <div class="font-bold text-slate-800">${asset.nomorAset}</div>
                    <div class="text-[10px] text-slate-400 mt-0.5">NIB: ${asset.nib}</div>
                </td>
                <td class="py-4 px-4">
                    <span class="block font-medium text-slate-600">Kelas ${asset.kelas}</span>
                    <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${
                        asset.jenisAset === 'Bangunan' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }">
                        ${asset.jenisAset}
                    </span>
                </td>
                <td class="py-4 px-4 max-w-sm">
                    <div class="font-semibold text-slate-800 truncate">${asset.ket1}</div>
                    <div class="text-[10px] text-slate-505 mt-0.5 truncate">${asset.ket2}</div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">SPK: ${asset.ket3 || '-'}</div>
                </td>
                <td class="py-4 px-4">
                    <div class="font-bold text-bni-teal text-[11px] flex items-center gap-0.5 mb-0.5">
                        <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                        ${asset.wilayah || "Wilayah Kerja"}
                    </div>
                    <div class="text-slate-505 text-[10px]">${asset.lokasi}</div>
                </td>
                <td class="py-4 px-4 text-right">
                    <div class="font-bold ${criticalState ? 'text-red-600' : 'text-slate-700'}">
                        ${asset.aging} Hari
                    </div>
                    <div class="text-[10px] text-slate-400 mt-0.5">${asset.range} Hari</div>
                </td>
                <td class="py-4 px-4 text-right font-semibold text-slate-800">
                    ${Utils.formatIDR(asset.hargaPerolehan)}
                </td>
                <td class="py-4 px-4">
                    ${statusBadge}
                </td>
                <td class="py-4 px-4 text-center">
                    <button onclick="App.openConfirmationModal('${asset.id}')" class="bg-bni-teal hover:bg-bni-navy text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1 mx-auto">
                        Konfirmasi
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
        updateBulkPanelUI();
    }

    // Render quick attention table on dashboard
    function renderQuickAttentionTable() {
        const assets = DataManager.getAssets();
        const tbody = document.getElementById('quick-attention-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = "";
        
        const urgentItems = assets.filter(a => Utils.isCritical(a) && !a.isConfirmed).slice(0, 4);
        
        if (urgentItems.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-6 text-center text-slate-400 font-medium">
                        <i data-lucide="check-circle" class="w-8 h-8 text-teal-600 mx-auto mb-2"></i>
                        Hebat! Seluruh aset DPL aging kritis telah berhasil dikonfirmasi.
                    </td>
                </tr>
            `;
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        urgentItems.forEach(asset => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50 transition-all";
            tr.innerHTML = `
                <td class="py-3 px-4 font-semibold">
                    <span class="block text-slate-800">${asset.nomorAset}</span>
                    <span class="text-[10px] text-slate-400">Kelas: ${asset.kelas}</span>
                </td>
                <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        asset.jenisAset === 'Bangunan' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }">
                        ${asset.jenisAset}
                    </span>
                </td>
                <td class="py-3 px-4">
                    <div class="font-medium text-slate-700 max-w-xs truncate">${asset.ket1}</div>
                    <div class="text-[10px] text-slate-400 truncate">${asset.ket2}</div>
                </td>
                <td class="py-3 px-4">
                    <div class="text-slate-600 font-medium">${asset.lokasi}</div>
                    <div class="text-[10px] text-teal-800 font-bold flex items-center gap-0.5">
                        <i data-lucide="map-pin" class="w-3 h-3"></i> ${asset.wilayah || "Wilayah Kerja"}
                    </div>
                </td>
                <td class="py-3 px-4 text-right font-bold text-red-655">${asset.aging} Hari</td>
                <td class="py-3 px-4 text-right font-semibold text-slate-800">${Utils.formatIDR(asset.hargaPerolehan)}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="App.openConfirmationModal('${asset.id}')" class="bg-bni-teal hover:bg-bni-navy text-white font-bold py-1 px-2.5 rounded text-[11px] transition-all">
                        Konfirmasi
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Render official letter draft
    function renderOfficialLetterDraft() {
        const assets = DataManager.getAssets();
        
        const doneAssets = assets.filter(a => a.statusProyek === 'Done');
        const ongoingAssets = assets.filter(a => a.statusProyek === 'On Going');
        const cancelAssets = assets.filter(a => a.statusProyek === 'Cancel');
        const confirmedAssets = assets.filter(a => a.isConfirmed);
        
        const doneVal = doneAssets.reduce((acc, a) => acc + a.hargaPerolehan, 0);
        const ongoingVal = ongoingAssets.reduce((acc, a) => acc + a.hargaPerolehan, 0);
        const cancelVal = cancelAssets.reduce((acc, a) => acc + a.hargaPerolehan, 0);
        const confirmedVal = confirmedAssets.reduce((acc, a) => acc + a.hargaPerolehan, 0);
        
        const reportDoneCount = document.getElementById('report-done-count');
        const reportDoneVal = document.getElementById('report-done-val');
        const reportOngoingCount = document.getElementById('report-ongoing-count');
        const reportOngoingVal = document.getElementById('report-ongoing-val');
        const reportCancelCount = document.getElementById('report-cancel-count');
        const reportCancelVal = document.getElementById('report-cancel-val');
        const reportConfirmedCount = document.getElementById('report-confirmed-count');
        const reportConfirmedVal = document.getElementById('report-confirmed-val');
        const reportRateBadge = document.getElementById('report-rate-badge');
        
        if (reportDoneCount) reportDoneCount.textContent = doneAssets.length;
        if (reportDoneVal) reportDoneVal.textContent = Utils.formatIDR(doneVal);
        if (reportOngoingCount) reportOngoingCount.textContent = ongoingAssets.length;
        if (reportOngoingVal) reportOngoingVal.textContent = Utils.formatIDR(ongoingVal);
        if (reportCancelCount) reportCancelCount.textContent = cancelAssets.length;
        if (reportCancelVal) reportCancelVal.textContent = Utils.formatIDR(cancelVal);
        if (reportConfirmedCount) reportConfirmedCount.textContent = confirmedAssets.length;
        if (reportConfirmedVal) reportConfirmedVal.textContent = Utils.formatIDR(confirmedVal);
        
        const rate = assets.length ? Math.round((confirmedAssets.length / assets.length) * 100) : 0;
        if (reportRateBadge) reportRateBadge.textContent = `Progress: ${rate}% dari total target`;
        
        const tbody = document.getElementById('report-attachment-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = "";
        
        assets.forEach(a => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-55";
            tr.innerHTML = `
                <td class="p-1 border border-slate-300 font-mono font-bold">${a.nomorAset}</td>
                <td class="p-1 border border-slate-300 text-center">${a.kelas}</td>
                <td class="p-1 border border-slate-300">
                    <div class="font-bold">${a.ket1}</div>
                    <div class="text-[8px] text-slate-505">${a.ket2} - Lokasi: ${a.lokasi}</div>
                </td>
                <td class="p-1 border border-slate-300 text-right font-bold text-red-655">${a.aging} Hari</td>
                <td class="p-1 border border-slate-300 text-right font-semibold">${Utils.formatIDR(a.hargaPerolehan)}</td>
                <td class="p-1 border border-slate-300 font-bold text-slate-750">
                    ${a.statusProyek || "BELUM KONFIRMASI"}
                </td>
                <td class="p-1 border border-slate-300 font-medium">
                    ${a.statusProyek === 'On Going' ? `Timeline: ${a.timeline}` : a.keteranganTindakLanjut || "-"}
                </td>
                <td class="p-1 border border-slate-300 text-[8px] font-semibold text-slate-600">
                    ${a.kategoriAkuntansi || "-"}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Open confirmation modal
    function openConfirmationModal(assetId) {
        const asset = DataManager.getAssetById(assetId);
        if (!asset) return;
        
        const modalAssetId = document.getElementById('modal-asset-id');
        const modalTitle = document.getElementById('modal-title');
        const modalDescKet1 = document.getElementById('modal-desc-ket1');
        const modalDescKet2 = document.getElementById('modal-desc-ket2');
        const modalDescHarga = document.getElementById('modal-desc-harga');
        const modalDescAging = document.getElementById('modal-desc-aging');
        const modalDescLokasi = document.getElementById('modal-desc-lokasi');
        const modalDescVendor = document.getElementById('modal-desc-vendor');
        const modalStatusSelect = document.getElementById('modal-status-select');
        const modalTimelineInput = document.getElementById('modal-timeline-input');
        const modalAccountingSelect = document.getElementById('modal-accounting-select');
        const modalTindaklanjut = document.getElementById('modal-tindaklanjut-textarea');
        
        if (modalAssetId) modalAssetId.value = asset.id;
        if (modalTitle) modalTitle.textContent = `Aset No. ${asset.nomorAset}`;
        if (modalDescKet1) modalDescKet1.textContent = asset.ket1;
        if (modalDescKet2) modalDescKet2.textContent = asset.ket2;
        if (modalDescHarga) modalDescHarga.textContent = Utils.formatIDR(asset.hargaPerolehan);
        if (modalDescAging) modalDescAging.textContent = `${asset.aging} Hari (${asset.jenisAset})`;
        if (modalDescLokasi) modalDescLokasi.textContent = `${asset.wilayah || "Wilayah Kerja"} (${asset.lokasi})`;
        if (modalDescVendor) modalDescVendor.textContent = asset.perusahaan || '-';
        
        if (modalStatusSelect) modalStatusSelect.value = asset.statusProyek || "";
        if (modalTimelineInput) modalTimelineInput.value = asset.timeline || "";
        if (modalAccountingSelect) modalAccountingSelect.value = asset.kategoriAkuntansi || "Kapitalisasi Aset Tetap";
        if (modalTindaklanjut) modalTindaklanjut.value = asset.keteranganTindakLanjut || "";
        
        handleModalStatusChange(asset.statusProyek);
        
        const modal = document.getElementById('confirmation-modal');
        if (modal) modal.classList.remove('hidden');
    }

    // Close confirmation modal
    function closeConfirmationModal() {
        const modal = document.getElementById('confirmation-modal');
        if (modal) modal.classList.add('hidden');
    }

    // Handle modal status change
    function handleModalStatusChange(val) {
        const catInput = document.getElementById('modal-accounting-select');
        const tlInput = document.getElementById('modal-tindaklanjut-textarea');
        const timeInput = document.getElementById('modal-timeline-input');
        
        if (val === 'Done') {
            if (catInput) catInput.value = 'Kapitalisasi Aset Tetap';
            if (tlInput) tlInput.value = 'Segera berkoordinasi dengan Divisi PFA untuk mendaftarkan DPL menjadi Aset Tetap.';
            if (timeInput) {
                timeInput.value = '';
                timeInput.disabled = true;
            }
        } else if (val === 'Cancel') {
            if (catInput) catInput.value = 'Beban Opex';
            if (tlInput) tlInput.value = 'Pekerjaan dibatalkan, segera dibebankan ke Beban Operasional Kantor Wilayah (Opex).';
            if (timeInput) {
                timeInput.value = '';
                timeInput.disabled = true;
            }
        } else if (val === 'On Going') {
            if (catInput) catInput.value = 'Kapitalisasi Aset Tetap';
            if (tlInput) tlInput.value = 'Proyek masih berjalan. Melakukan monitoring berkala.';
            if (timeInput) {
                timeInput.disabled = false;
                timeInput.required = true;
            }
        } else {
            if (timeInput) {
                timeInput.disabled = false;
                timeInput.required = false;
            }
        }
    }

    // Save modal confirmation
    function saveModalConfirmation(e) {
        e.preventDefault();
        
        const id = document.getElementById('modal-asset-id').value;
        const statusProyek = document.getElementById('modal-status-select').value;
        const timeline = document.getElementById('modal-timeline-input').value;
        const kategoriAkuntansi = document.getElementById('modal-accounting-select').value;
        const keteranganTindakLanjut = document.getElementById('modal-tindaklanjut-textarea').value;
        
        DataManager.updateAsset(id, {
            statusProyek,
            timeline,
            kategoriAkuntansi,
            keteranganTindakLanjut
        });
        
        closeConfirmationModal();
        refreshAppUI();
        Utils.showToast("Konfirmasi aset berhasil disimpan!", "success");
        
        return false;
    }

    // Toggle asset selection for bulk actions
    function toggleAssetSelection(id) {
        if (bulkSelection.includes(id)) {
            bulkSelection = bulkSelection.filter(item => item !== id);
        } else {
            bulkSelection.push(id);
        }
        updateBulkPanelUI();
        renderLedgerTable();
    }

    // Handle select all checkbox
    function handleSelectAllToggle() {
        const isChecked = document.getElementById('select-all-checkbox').checked;
        const filtered = getFilteredAssets();
        if (isChecked) {
            bulkSelection = filtered.map(a => a.id);
        } else {
            bulkSelection = [];
        }
        renderLedgerTable();
    }

    // Update bulk action panel UI
    function updateBulkPanelUI() {
        const panel = elements.bulkActionsPanel;
        const countLabel = elements.selectedAssetsCount;
        
        if (bulkSelection.length > 0 && currentRole === 'NSD') {
            if (panel) panel.classList.remove('hidden');
            if (countLabel) countLabel.textContent = bulkSelection.length;
        } else {
            if (panel) panel.classList.add('hidden');
        }
        
        const filtered = getFilteredAssets();
        const allChecked = filtered.length > 0 && filtered.every(a => bulkSelection.includes(a.id));
        if (elements.selectAllCheckbox) elements.selectAllCheckbox.checked = allChecked;
    }

    // Clear bulk selection
    function clearBulkSelection() {
        bulkSelection = [];
        renderLedgerTable();
    }

    // Handle bulk update
    function handleBulkUpdate(status) {
        if (currentRole !== 'NSD') {
            Utils.showToast("Akses ditolak: Kantor Wilayah tidak diizinkan mengubah database massal.", "error");
            return;
        }
        
        const updates = {};
        
        if (status === 'Done') {
            updates.statusProyek = 'Done';
            updates.kategoriAkuntansi = 'Kapitalisasi Aset Tetap';
            updates.keteranganTindakLanjut = 'Segera berkoordinasi dengan Divisi PFA untuk mendaftarkan DPL menjadi Aset Tetap.';
            updates.timeline = '';
        } else if (status === 'Cancel') {
            updates.statusProyek = 'Cancel';
            updates.kategoriAkuntansi = 'Beban Opex';
            updates.keteranganTindakLanjut = 'Diselesaikan dan dibebankan langsung ke Beban Operasional Kantor Wilayah/Cabang (Opex).';
            updates.timeline = '';
        } else if (status === 'On Going') {
            updates.statusProyek = 'On Going';
            updates.kategoriAkuntansi = 'Kapitalisasi Aset Tetap';
            updates.keteranganTindakLanjut = 'Proyek masih berjalan. Monitor progress berkala.';
            updates.timeline = 'Estimasi Q3 2026';
        }
        
        DataManager.bulkUpdate(bulkSelection, updates);
        bulkSelection = [];
        refreshAppUI();
        Utils.showToast(`Berhasil memperbarui status ${status} untuk beberapa aset!`, "success");
    }

    // Handle CSV upload
    function handleCSVUpload(event) {
        if (currentRole !== 'NSD') {
            Utils.showToast("Akses ditolak: Kantor Wilayah tidak diizinkan mengubah database.", "error");
            return;
        }
        
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const text = e.target.result;
                const parsedAssets = parseCSV(text);
                
                if (parsedAssets.length > 0) {
                    DataManager.setAssets(parsedAssets);
                    Utils.showToast(`Berhasil mengunggah ${parsedAssets.length} aset!`, "success");
                    refreshAppUI();
                    switchTab('workspace');
                } else {
                    Utils.showToast("Gagal membaca aset. Pastikan format CSV valid.", "error");
                }
            } catch (err) {
                console.error(err);
                Utils.showToast("Gagal membaca file. Pastikan format CSV valid.", "error");
            }
        };
        reader.readAsText(file);
    }

    // Parse CSV file
    function parseCSV(text) {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) return [];
        
        let delimiter = ',';
        if (lines[0] && lines[0].toLowerCase().startsWith('sep=')) {
            const parts = lines[0].split('=');
            if (parts[1]) delimiter = parts[1].trim().charAt(0);
        } else {
            let commaCount = 0, semiCount = 0;
            for (let i = 0; i < Math.min(lines.length, 10); i++) {
                commaCount += (lines[i].match(/,/g) || []).length;
                semiCount += (lines[i].match(/;/g) || []).length;
            }
            if (semiCount > commaCount) delimiter = ';';
        }
        
        const parseCSVLine = (lineStr, delim) => {
            const result = [];
            let insideQuote = false;
            let currentField = '';
            for (let i = 0; i < lineStr.length; i++) {
                const char = lineStr[i];
                if (char === '"') {
                    insideQuote = !insideQuote;
                } else if (char === delim && !insideQuote) {
                    result.push(currentField);
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            result.push(currentField);
            return result.map(val => val.trim().replace(/^"|"$/g, ''));
        };
        
        let headerIndex = -1;
        let headers = [];
        for (let i = 0; i < Math.min(lines.length, 15); i++) {
            if (lines[i].toLowerCase().startsWith('sep=')) continue;
            const parsedLine = parseCSVLine(lines[i], delimiter);
            const hasKeyColumns = parsedLine.some(h => {
                const low = h.toLowerCase();
                return low.includes("nomor aset") || low.includes("entity") || low.includes("kelas") || low.includes("harga");
            });
            if (hasKeyColumns) {
                headerIndex = i;
                headers = parsedLine;
                break;
            }
        }
        
        if (headerIndex === -1) {
            headers = parseCSVLine(lines[0], delimiter);
            headerIndex = 0;
        }
        
        const findColIndex = (keywords, excludeKeywords = []) => {
            let idx = headers.findIndex(h => {
                const val = h.toLowerCase().trim();
                return keywords.some(kw => val === kw);
            });
            if (idx !== -1) return idx;
            return headers.findIndex(h => {
                const val = h.toLowerCase().trim();
                const matchesKeyword = keywords.some(kw => val.includes(kw));
                const hasExcluded = excludeKeywords.some(ex => val.includes(ex));
                return matchesKeyword && !hasExcluded;
            });
        };
        
        const indices = {
            entity: findColIndex(["entity", "entitas"]),
            unit: findColIndex(["unit", "cabang"]),
            kelas: findColIndex(["kelas"]),
            nomorAset: findColIndex(["nomor aset", "no aset", "nomor_aset", "id aset"]),
            nib: findColIndex(["nib"]),
            tglPerolehan: findColIndex(["tanggal perolehan", "tgl perolehan", "tgl p'olehan", "tanggal", "tgl"], ["harga", "nilai"]),
            aging: findColIndex(["aging", "umur"]),
            range: findColIndex(["range"]),
            ket1: findColIndex(["keterangan 1", "ket 1", "keterangan1"]),
            ket2: findColIndex(["keterangan 2", "ket 2", "keterangan2"]),
            ket3: findColIndex(["keterangan 3", "ket 3", "keterangan3"]),
            lokasi: findColIndex(["lokasi", "alamat"]),
            hargaPerolehan: findColIndex(["harga perolehan", "harga p'olehan", "harga", "nilai perolehan", "nilai", "harga_perolehan"], ["tanggal", "tgl"]),
            perusahaan: findColIndex(["perusahaan", "pembuat", "kontraktor", "vendor"]),
            wilayah: findColIndex(["wilayah", "kanwil", "region", "kantor wilayah"])
        };
        
        const parsedAssets = [];
        const startRow = headerIndex + 1;
        
        for (let i = startRow; i < lines.length; i++) {
            const lineStr = lines[i].trim();
            if (!lineStr) continue;
            if (lineStr.toLowerCase().startsWith('sep=')) continue;
            
            const row = parseCSVLine(lines[i], delimiter);
            if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;
            
            const getVal = (colIdx, defaultVal = "") => {
                if (colIdx === -1 || colIdx >= row.length) return defaultVal;
                return row[colIdx];
            };
            
            const nomorAset = getVal(indices.nomorAset);
            if (!nomorAset) continue;
            
            const kelas = getVal(indices.kelas);
            const ket1 = getVal(indices.ket1);
            const ket2 = getVal(indices.ket2);
            const lokasiVal = getVal(indices.lokasi);
            
            let jenis = "Inventaris";
            if (kelas === "0021" || 
                ket1.toLowerCase().includes("gedung") || 
                ket1.toLowerCase().includes("pembangunan") || 
                ket2.toLowerCase().includes("bangunan") ||
                ket1.toLowerCase().includes("renovasi")) {
                jenis = "Bangunan";
            }
            
            let mappedWilayah = getVal(indices.wilayah);
            if (!mappedWilayah) {
                const locLow = lokasiVal.toLowerCase();
                if (locLow.includes("gresik") || locLow.includes("surabaya") || locLow.includes("jatim")) {
                    mappedWilayah = "Wilayah 06 (Surabaya)";
                } else if (locLow.includes("surakarta") || locLow.includes("solo") || locLow.includes("semarang") || locLow.includes("jateng")) {
                    mappedWilayah = "Wilayah 05 (Semarang)";
                } else if (locLow.includes("kanaka") || locLow.includes("manado") || locLow.includes("sulawesi")) {
                    mappedWilayah = "Wilayah 11 (Manado)";
                } else if (locLow.includes("tangerang") || locLow.includes("serpong") || locLow.includes("banten")) {
                    mappedWilayah = "Wilayah 14 (Tangerang)";
                } else if (locLow.includes("bandung") || locLow.includes("jabar")) {
                    mappedWilayah = "Wilayah 04 (Bandung)";
                } else {
                    mappedWilayah = "Wilayah Lainnya";
                }
            }
            
            const rawHarga = getVal(indices.hargaPerolehan);
            const rawAging = getVal(indices.aging);
            const rawHargaClean = rawHarga ? parseFloat(rawHarga.replace(/[^0-9.-]+/g, "")) : 0;
            const agingVal = parseInt(rawAging) || 0;
            
            parsedAssets.push({
                id: `uploaded-${i}-${Date.now()}-${nomorAset}`,
                entity: getVal(indices.entity),
                unit: getVal(indices.unit),
                kelas: kelas,
                nomorAset: nomorAset,
                nib: getVal(indices.nib) || "-",
                tglPerolehan: getVal(indices.tglPerolehan),
                aging: agingVal,
                range: getVal(indices.range),
                ket1: ket1,
                ket2: ket2,
                ket3: getVal(indices.ket3),
                lokasi: lokasiVal,
                wilayah: mappedWilayah,
                hargaPerolehan: rawHargaClean,
                perusahaan: getVal(indices.perusahaan),
                jenisAset: jenis,
                statusProyek: "",
                timeline: "",
                kategoriAkuntansi: "",
                keteranganTindakLanjut: "",
                isConfirmed: false
            });
        }
        
        return parsedAssets;
    }

    // Handle export to CSV
    function handleExportCSV() {
        const assets = DataManager.getAssets();
        
        const csvHeaders = [
            "Entity", "Unit", "Kelas", "Nomor Aset", "NIB", "Tanggal Perolehan", "Aging", "Range",
            "Jenis Aset", "Keterangan", "Lokasi", "Wilayah", "Harga Perolehan",
            "Status Proyek BNI (On Going/Cancel/Done)", "Timeline Selesai", "Kategori Akuntansi (Aset Tetap/Opex)", "Keterangan Tindak Lanjut"
        ].join(",");
        
        const csvRows = assets.map(a => {
            return [
                a.entity,
                a.unit,
                a.kelas,
                `"${a.nomorAset}"`,
                `"${a.nib}"`,
                a.tglPerolehan,
                a.aging,
                `"${a.range}"`,
                `"${a.jenisAset}"`,
                `"${a.ket1} - ${a.ket2}"`,
                `"${a.lokasi}"`,
                `"${a.wilayah || 'Wilayah Kerja'}"`,
                a.hargaPerolehan,
                `"${a.statusProyek || 'BELUM KONFIRMASI'}"`,
                `"${a.timeline || '-'}"`,
                `"${a.kategoriAkuntansi || '-'}"`,
                `"${a.keteranganTindakLanjut || '-'}"`
            ].join(",");
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + [csvHeaders, ...csvRows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Laporan_Konfirmasi_Aset_DPL_April_2026.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Utils.showToast("File CSV Laporan akhir berhasil diekspor!");
    }

    // Activate urgent filters (critical & pending)
    function activateUrgentFilters() {
        if (elements.filterUrgency) elements.filterUrgency.value = "CRITICAL";
        if (elements.filterStatus) elements.filterStatus.value = "PENDING";
        switchTab('workspace');
        handleSearchFilterChange();
        Utils.showToast("Filter diubah ke: Aging Kritis & Belum Konfirmasi");
    }

    // Switch between tabs
    function switchTab(targetTab) {
        const tabButtons = ['dashboard', 'workspace', 'report', 'instructions'];
        
        tabButtons.forEach(tab => {
            const btn = document.getElementById(`tab-btn-${tab}`);
            if (btn) {
                btn.className = "px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center gap-2 text-slate-600 hover:text-bni-teal hover:bg-slate-50";
            }
        });
        
        const activeBtn = document.getElementById(`tab-btn-${targetTab}`);
        if (activeBtn) {
            activeBtn.className = "px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center gap-2 bg-bni-lightTeal text-bni-teal";
        }
        
        tabButtons.forEach(tab => {
            const content = document.getElementById(`tab-content-${tab}`);
            if (content) content.classList.add('hidden');
        });
        
        const targetContent = document.getElementById(`tab-content-${targetTab}`);
        if (targetContent) targetContent.classList.remove('hidden');
        
        if (targetTab === 'report') {
            renderOfficialLetterDraft();
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Refresh entire application UI
    function refreshAppUI() {
        populateRegionDropdown();
        calculateMetricsAndProgress();
        populateRegionCards();
        renderLedgerTable();
        renderQuickAttentionTable();
        renderOfficialLetterDraft();
    }

    // Public API
    return {
        init,
        refreshAppUI,
        switchTab,
        handleRoleChange,
        handleSearchFilterChange,
        resetAllFilters,
        openConfirmationModal,
        closeConfirmationModal,
        saveModalConfirmation,
        handleModalStatusChange,
        toggleAssetSelection,
        handleSelectAllToggle,
        clearBulkSelection,
        handleBulkUpdate,
        handleExportCSV,
        activateUrgentFilters
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Expose App to global scope for inline onclick handlers
window.App = App;