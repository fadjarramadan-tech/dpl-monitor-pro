// ============================================
// APP MODULE - UI Controller
// Dependencies: Utils, DataManager
// ============================================

const App = (function() {
    'use strict';

    // ========== UI State ==========
    let currentTab = 'dashboard';
    let currentFilters = { search: '', region: 'ALL', jenis: 'ALL', urgency: 'ALL', status: 'ALL' };
    let selectedAssets = new Set();
    let assetsData = [];

    // ========== Helper Functions ==========
    async function loadAssets() {
        try {
            const assets = await DataManager.getAssets();
            assetsData = assets || [];
            refreshAppUI();
            return assetsData;
        } catch (error) {
            console.error('Failed to load assets:', error);
            Utils.showToast('Gagal memuat data dari spreadsheet', 'error');
            return [];
        }
    }

    function refreshAppUI() {
        if (!assetsData.length) return;
        updateDashboardStats();
        updateQuickAttentionTable();
        updateLedgerTable();
        updateRegionalMetrics();
        updateReportTab();
        updatePendingCountBadge();
    }

    function updateDashboardStats() {
        const total = assetsData.length;
        const confirmed = assetsData.filter(a => a.isConfirmed).length;
        const progress = total > 0 ? (confirmed / total) * 100 : 0;
        
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('progress-text').innerText = `${Math.round(progress)}% Selesai`;
        document.getElementById('completion-text').innerText = `Mencatat ${confirmed} dari ${total} aset telah dikonfirmasi`;
        document.getElementById('pending-items-count').innerText = `${total - confirmed} Item`;
        
        const totalValue = assetsData.reduce((sum, a) => sum + (a.hargaPerolehan || 0), 0);
        document.getElementById('kpi-total-val').innerHTML = Utils.formatIDR(totalValue);
        document.getElementById('kpi-total-count').innerText = total;
        
        const criticalBuilding = assetsData.filter(a => 
            (a.jenisAset === 'Bangunan' || a.kelas === '0021') && a.aging > 360
        );
        const criticalBuildingVal = criticalBuilding.reduce((sum, a) => sum + (a.hargaPerolehan || 0), 0);
        document.getElementById('kpi-building-crit-val').innerHTML = Utils.formatIDR(criticalBuildingVal);
        document.getElementById('kpi-building-crit-count').innerText = criticalBuilding.length;
        
        const criticalInventory = assetsData.filter(a => 
            (a.jenisAset === 'Inventaris' || a.kelas === '0029') && a.aging > 180
        );
        const criticalInventoryVal = criticalInventory.reduce((sum, a) => sum + (a.hargaPerolehan || 0), 0);
        document.getElementById('kpi-inventory-crit-val').innerHTML = Utils.formatIDR(criticalInventoryVal);
        document.getElementById('kpi-inventory-crit-count').innerText = criticalInventory.length;
    }

    function updateQuickAttentionTable() {
        const criticalAssets = assetsData.filter(a => Utils.isCritical(a) && !a.isConfirmed).slice(0, 10);
        const tbody = document.getElementById('quick-attention-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = criticalAssets.map(asset => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4 font-mono text-[11px] font-bold text-slate-700">${asset.nomorAset || '-'}</td>
                <td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-[10px] font-bold ${asset.jenisAset === 'Bangunan' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">${asset.jenisAset || '-'}</span></td>
                <td class="py-3 px-4 max-w-[200px] truncate">${asset.ket1 || '-'}</td>
                <td class="py-3 px-4 text-xs">${asset.wilayah || '-'}<br><span class="text-[10px] text-slate-400">${asset.lokasi || ''}</span></td>
                <td class="py-3 px-4 text-right font-bold ${asset.aging > 360 ? 'text-red-600' : asset.aging > 180 ? 'text-amber-600' : 'text-slate-600'}">${asset.aging || 0} hari</td>
                <td class="py-3 px-4 text-right">${Utils.formatIDR(asset.hargaPerolehan || 0)}</td>
                <td class="py-3 px-4 text-center"><button onclick="App.openConfirmationModal('${asset.id}')" class="bg-bni-teal text-white px-3 py-1 rounded-lg text-[10px] font-bold hover:bg-bni-navy transition">Konfirmasi</button></td>
            </tr>
        `).join('');
    }

    function updateLedgerTable() {
        let filtered = [...assetsData];
        
        if (currentFilters.search) {
            const search = currentFilters.search.toLowerCase();
            filtered = filtered.filter(a => 
                (a.nomorAset || '').toLowerCase().includes(search) ||
                (a.ket1 || '').toLowerCase().includes(search) ||
                (a.lokasi || '').toLowerCase().includes(search) ||
                (a.perusahaan || '').toLowerCase().includes(search)
            );
        }
        
        if (currentFilters.region !== 'ALL') {
            filtered = filtered.filter(a => a.wilayah === currentFilters.region);
        }
        
        if (currentFilters.jenis !== 'ALL') {
            filtered = filtered.filter(a => a.jenisAset === currentFilters.jenis);
        }
        
        if (currentFilters.urgency !== 'ALL') {
            filtered = filtered.filter(a => {
                const isCrit = Utils.isCritical(a);
                return currentFilters.urgency === 'CRITICAL' ? isCrit : !isCrit;
            });
        }
        
        if (currentFilters.status !== 'ALL') {
            filtered = filtered.filter(a => 
                currentFilters.status === 'CONFIRMED' ? a.isConfirmed : !a.isConfirmed
            );
        }
        
        document.getElementById('table-results-label').innerText = `Daftar Kerja Monitoring (Ditemukan ${filtered.length} Aset)`;
        
        const tbody = document.getElementById('ledger-table-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = filtered.map(asset => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
                <td class="py-3 px-4 text-center">
                    <input type="checkbox" onchange="App.toggleSelectAsset('${asset.id}')" ${selectedAssets.has(asset.id) ? 'checked' : ''} class="rounded text-bni-teal focus:ring-bni-teal">
                </td>
                <td class="py-3 px-4 font-mono text-[11px]">${asset.nomorAset || '-'}</td>
                <td class="py-3 px-4"><span class="px-2 py-1 rounded-full text-[10px] font-bold ${asset.jenisAset === 'Bangunan' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">${asset.jenisAset || '-'}</span></td>
                <td class="py-3 px-4 max-w-[200px] truncate">${asset.ket1 || '-'}</td>
                <td class="py-3 px-4 text-xs">${asset.wilayah || '-'}</td>
                <td class="py-3 px-4 text-right font-bold ${asset.aging > 360 ? 'text-red-600' : asset.aging > 180 ? 'text-amber-600' : 'text-slate-600'}">${asset.aging || 0} hari</td>
                <td class="py-3 px-4 text-right">${Utils.formatIDR(asset.hargaPerolehan || 0)}</td>
                <td class="py-3 px-4">
                    ${asset.isConfirmed ? 
                        `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">${asset.statusProyek || 'Selesai Dikonfirmasi'}</span>` : 
                        `<span class="px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Belum Dikonfirmasi</span>`
                    }
                </td>
                <td class="py-3 px-4 text-center">
                    <button onclick="App.openConfirmationModal('${asset.id}')" class="text-bni-teal hover:text-bni-navy font-bold text-[11px] underline">Konfirmasi</button>
                </td>
            </tr>
        `).join('');
        
        document.getElementById('selected-assets-count').innerText = selectedAssets.size;
        document.getElementById('bulk-actions-panel').classList.toggle('hidden', selectedAssets.size === 0);
    }

    function updateRegionalMetrics() {
        const regions = DataManager.getUniqueRegions();
        const grid = document.getElementById('regional-metrics-grid');
        if (!grid) return;
        
        const regionStats = regions.map(region => {
            const regionAssets = assetsData.filter(a => a.wilayah === region);
            const total = regionAssets.length;
            const confirmed = regionAssets.filter(a => a.isConfirmed).length;
            const progress = total > 0 ? (confirmed / total) * 100 : 0;
            return { region, total, confirmed, progress };
        });
        
        grid.innerHTML = regionStats.map(stat => `
            <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div class="text-xs font-bold text-bni-teal">${stat.region}</div>
                <div class="text-2xl font-black text-slate-800 mt-1">${stat.confirmed}<span class="text-sm font-normal text-slate-400">/${stat.total}</span></div>
                <div class="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div class="bg-bni-teal h-1.5 rounded-full" style="width: ${stat.progress}%"></div>
                </div>
                <div class="text-[10px] text-slate-500 mt-1">${Math.round(stat.progress)}% selesai</div>
            </div>
        `).join('');
    }

    function updateReportTab() {
        const confirmed = assetsData.filter(a => a.isConfirmed);
        const done = confirmed.filter(a => a.statusProyek === 'Done');
        const ongoing = confirmed.filter(a => a.statusProyek === 'On Going');
        const cancel = confirmed.filter(a => a.statusProyek === 'Cancel');
        
        const doneVal = done.reduce((s, a) => s + (a.hargaPerolehan || 0), 0);
        const ongoingVal = ongoing.reduce((s, a) => s + (a.hargaPerolehan || 0), 0);
        const cancelVal = cancel.reduce((s, a) => s + (a.hargaPerolehan || 0), 0);
        
        document.getElementById('report-done-count').innerText = done.length;
        document.getElementById('report-done-val').innerHTML = Utils.formatIDR(doneVal);
        document.getElementById('report-ongoing-count').innerText = ongoing.length;
        document.getElementById('report-ongoing-val').innerHTML = Utils.formatIDR(ongoingVal);
        document.getElementById('report-cancel-count').innerText = cancel.length;
        document.getElementById('report-cancel-val').innerHTML = Utils.formatIDR(cancelVal);
        document.getElementById('report-confirmed-count').innerText = confirmed.length;
        document.getElementById('report-confirmed-val').innerHTML = Utils.formatIDR(doneVal + ongoingVal + cancelVal);
        
        const tbody = document.getElementById('report-attachment-tbody');
        if (tbody) {
            tbody.innerHTML = confirmed.slice(0, 50).map(a => `
                <tr>
                    <td class="p-1 border border-slate-300">${a.nomorAset || '-'}</td>
                    <td class="p-1 border border-slate-300 text-center">${a.jenisAset === 'Bangunan' ? '021' : '029'}</td>
                    <td class="p-1 border border-slate-300">${a.ket1 || '-'}</td>
                    <td class="p-1 border border-slate-300">${a.wilayah || '-'}</td>
                    <td class="p-1 border border-slate-300 text-right">${a.aging || 0}</td>
                    <td class="p-1 border border-slate-300 text-right">${Utils.formatIDR(a.hargaPerolehan || 0)}</td>
                    <td class="p-1 border border-slate-300">${a.statusProyek || '-'}</td>
                    <td class="p-1 border border-slate-300">${a.timeline || '-'}</td>
                    <td class="p-1 border border-slate-300">${a.kategoriAkuntansi || '-'}</td>
                </tr>
            `).join('');
        }
    }

    function updatePendingCountBadge() {
        const pending = assetsData.filter(a => !a.isConfirmed).length;
        const badge = document.getElementById('pending-count-badge');
        if (badge) {
            badge.innerText = pending;
            badge.classList.toggle('hidden', pending === 0);
        }
    }

    // ========== Public API ==========
    async function init() {
        await loadAssets();
        setupEventListeners();
        switchTab('dashboard');
        lucide.createIcons();
        updateRoleAccess();
    }

    function setupEventListeners() {
        document.getElementById('role-selector')?.addEventListener('change', updateRoleAccess);
        document.getElementById('csv-file-input')?.addEventListener('change', handleCSVUpload);
    }

    function updateRoleAccess() {
        const role = document.getElementById('role-selector')?.value || 'NSD';
        const alertText = document.getElementById('role-alert-text');
        if (role === 'NSD') {
            alertText.innerText = 'Saat ini Anda menggunakan hak akses penuh Divisi NSD (Admin).';
        } else {
            alertText.innerText = 'Mode Kantor Wilayah aktif - Anda hanya dapat melihat dan mengonfirmasi aset di wilayah Anda sendiri.';
        }
    }

    async function handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const text = await file.text();
        const rows = text.split('\n').slice(1);
        const newAssets = [];
        
        for (const row of rows) {
            const cols = row.split(',');
            if (cols.length < 10) continue;
            newAssets.push({
                id: Utils.generateId(),
                nomorAset: cols[0]?.trim() || '',
                jenisAset: cols[1]?.trim() === '21' ? 'Bangunan' : 'Inventaris',
                ket1: cols[2]?.trim() || '',
                wilayah: cols[3]?.trim() || '',
                hargaPerolehan: parseFloat(cols[4]?.trim() || 0),
                aging: parseInt(cols[5]?.trim() || 0),
                lokasi: cols[6]?.trim() || '',
                perusahaan: cols[7]?.trim() || '',
                isConfirmed: false,
                statusProyek: '',
                timeline: '',
                kategoriAkuntansi: '',
                keteranganTindakLanjut: ''
            });
        }
        
        await DataManager.setAssets([...assetsData, ...newAssets]);
        await loadAssets();
        Utils.showToast(`Berhasil mengimpor ${newAssets.length} aset baru!`, 'success');
    }

    function switchTab(tab) {
        currentTab = tab;
        document.getElementById('tab-content-dashboard').classList.toggle('hidden', tab !== 'dashboard');
        document.getElementById('tab-content-workspace').classList.toggle('hidden', tab !== 'workspace');
        document.getElementById('tab-content-report').classList.toggle('hidden', tab !== 'report');
        document.getElementById('tab-content-instructions').classList.toggle('hidden', tab !== 'instructions');
        
        const btns = ['dashboard', 'workspace', 'report', 'instructions'];
        btns.forEach(t => {
            const btn = document.getElementById(`tab-btn-${t}`);
            if (btn) {
                if (t === tab) {
                    btn.className = 'px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 bg-bni-lightTeal text-bni-teal';
                } else {
                    btn.className = 'px-3 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 flex items-center gap-2 text-slate-600 hover:text-bni-teal hover:bg-slate-50';
                }
            }
        });
        
        if (tab === 'workspace') updateLedgerTable();
        if (tab === 'report') updateReportTab();
    }

    async function openConfirmationModal(assetId) {
        const asset = assetsData.find(a => a.id === assetId);
        if (!asset) return;
        
        document.getElementById('modal-asset-id').value = asset.id;
        document.getElementById('modal-title').innerHTML = `Aset No. ${asset.nomorAset || '-'}`;
        document.getElementById('modal-desc-ket1').innerText = asset.ket1 || '-';
        document.getElementById('modal-desc-ket2').innerText = asset.ket2 || '-';
        document.getElementById('modal-desc-harga').innerHTML = Utils.formatIDR(asset.hargaPerolehan || 0);
        document.getElementById('modal-desc-aging').innerHTML = `${asset.aging || 0} hari (${asset.range || '-'})`;
        document.getElementById('modal-desc-lokasi').innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 shrink-0"></i> ${asset.lokasi || '-'}`;
        document.getElementById('modal-desc-vendor').innerText = asset.perusahaan || '-';
        
        document.getElementById('modal-status-select').value = asset.statusProyek || '';
        document.getElementById('modal-timeline-input').value = asset.timeline || '';
        document.getElementById('modal-accounting-select').value = asset.kategoriAkuntansi || 'Kapitalisasi Aset Tetap';
        document.getElementById('modal-tindaklanjut-textarea').value = asset.keteranganTindakLanjut || '';
        
        document.getElementById('confirmation-modal').classList.remove('hidden');
        lucide.createIcons();
    }

    async function saveModalConfirmation(event) {
        event.preventDefault();
        const assetId = document.getElementById('modal-asset-id').value;
        const status = document.getElementById('modal-status-select').value;
        const timeline = document.getElementById('modal-timeline-input').value;
        const accounting = document.getElementById('modal-accounting-select').value;
        const tindakLanjut = document.getElementById('modal-tindaklanjut-textarea').value;
        
        if (!status) {
            Utils.showToast('Silakan pilih status proyek', 'error');
            return false;
        }
        
        await DataManager.updateAsset(assetId, {
            statusProyek: status,
            timeline: timeline,
            kategoriAkuntansi: accounting,
            keteranganTindakLanjut: tindakLanjut,
            isConfirmed: true
        });
        
        closeConfirmationModal();
        await loadAssets();
        return false;
    }

    function closeConfirmationModal() {
        document.getElementById('confirmation-modal').classList.add('hidden');
    }

    function toggleSelectAsset(assetId) {
        if (selectedAssets.has(assetId)) {
            selectedAssets.delete(assetId);
        } else {
            selectedAssets.add(assetId);
        }
        updateLedgerTable();
    }

    function handleSelectAllToggle() {
        const checkbox = document.getElementById('select-all-checkbox');
        const filtered = getFilteredAssets();
        if (checkbox.checked) {
            filtered.forEach(a => selectedAssets.add(a.id));
        } else {
            selectedAssets.clear();
        }
        updateLedgerTable();
    }

    function getFilteredAssets() {
        let filtered = [...assetsData];
        if (currentFilters.search) {
            const search = currentFilters.search.toLowerCase();
            filtered = filtered.filter(a => (a.nomorAset || '').toLowerCase().includes(search));
        }
        if (currentFilters.region !== 'ALL') {
            filtered = filtered.filter(a => a.wilayah === currentFilters.region);
        }
        if (currentFilters.jenis !== 'ALL') {
            filtered = filtered.filter(a => a.jenisAset === currentFilters.jenis);
        }
        if (currentFilters.status !== 'ALL') {
            filtered = filtered.filter(a => 
                currentFilters.status === 'CONFIRMED' ? a.isConfirmed : !a.isConfirmed
            );
        }
        return filtered;
    }

    async function handleBulkUpdate(status) {
        const ids = Array.from(selectedAssets);
        if (ids.length === 0) return;
        
        let updates = { statusProyek: status, isConfirmed: true };
        if (status === 'On Going') updates.timeline = 'Dalam proses penyelesaian';
        if (status === 'Cancel') updates.kategoriAkuntansi = 'Beban Opex';
        if (status === 'Done') updates.kategoriAkuntansi = 'Kapitalisasi Aset Tetap';
        
        await DataManager.bulkUpdate(ids, updates);
        selectedAssets.clear();
        await loadAssets();
    }

    function clearBulkSelection() {
        selectedAssets.clear();
        updateLedgerTable();
    }

    function handleSearchFilterChange() {
        currentFilters.search = document.getElementById('search-input')?.value || '';
        currentFilters.region = document.getElementById('filter-region-select')?.value || 'ALL';
        currentFilters.jenis = document.getElementById('filter-jenis-select')?.value || 'ALL';
        currentFilters.urgency = document.getElementById('filter-urgency-select')?.value || 'ALL';
        currentFilters.status = document.getElementById('filter-status-select')?.value || 'ALL';
        updateLedgerTable();
    }

    function resetAllFilters() {
        if (document.getElementById('search-input')) document.getElementById('search-input').value = '';
        if (document.getElementById('filter-region-select')) document.getElementById('filter-region-select').value = 'ALL';
        if (document.getElementById('filter-jenis-select')) document.getElementById('filter-jenis-select').value = 'ALL';
        if (document.getElementById('filter-urgency-select')) document.getElementById('filter-urgency-select').value = 'ALL';
        if (document.getElementById('filter-status-select')) document.getElementById('filter-status-select').value = 'ALL';
        handleSearchFilterChange();
    }

    function activateUrgentFilters() {
        if (document.getElementById('filter-urgency-select')) document.getElementById('filter-urgency-select').value = 'CRITICAL';
        if (document.getElementById('filter-status-select')) document.getElementById('filter-status-select').value = 'PENDING';
        handleSearchFilterChange();
        switchTab('workspace');
    }

    async function handleExportCSV() {
        const headers = ['nomorAset','jenisAset','ket1','wilayah','hargaPerolehan','aging','statusProyek','timeline','kategoriAkuntansi','keteranganTindakLanjut'];
        const rows = assetsData.map(a => [
            a.nomorAset, a.jenisAset, a.ket1, a.wilayah, a.hargaPerolehan, a.aging,
            a.statusProyek || '', a.timeline || '', a.kategoriAkuntansi || '', a.keteranganTindakLanjut || ''
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `laporan_konfirmasi_dpl_${new Date().toISOString().slice(0,19)}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        Utils.showToast('Ekspor CSV berhasil!', 'success');
    }

    return {
        init,
        switchTab,
        openConfirmationModal,
        saveModalConfirmation,
        closeConfirmationModal,
        toggleSelectAsset,
        handleSelectAllToggle,
        handleBulkUpdate,
        clearBulkSelection,
        handleSearchFilterChange,
        resetAllFilters,
        activateUrgentFilters,
        handleExportCSV,
        refreshAppUI: loadAssets
    };
})();

// Initialize App when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
