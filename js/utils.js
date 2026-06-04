// ============================================
// UTILITIES MODULE - Helper Functions
// ============================================

const Utils = (function() {
    'use strict';

    /**
     * Format number to Indonesian Rupiah currency format
     * @param {number} num - Number to format
     * @returns {string} Formatted currency string
     */
    function formatIDR(num) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    /**
     * Parse currency string back to number
     * @param {string} currencyStr - Currency string (e.g., "Rp 1.000.000")
     * @returns {number} Parsed number
     */
    function parseIDR(currencyStr) {
        if (!currencyStr) return 0;
        const numericStr = currencyStr.replace(/[^0-9,-]/g, '').replace(',', '.');
        return parseFloat(numericStr) || 0;
    }

    /**
     * Format date to local Indonesian format
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @returns {string} Formatted date
     */
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = document.getElementById('toast-icon');
        
        toastMessage.textContent = message;
        
        if (type === 'error') {
            toast.className = "fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border text-white transition-all duration-300 transform translate-y-0 opacity-100 bg-red-600 border-red-500";
            toastIcon.innerHTML = `<i data-lucide="alert-triangle" class="w-5 h-5 shrink-0"></i>`;
        } else {
            toast.className = "fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border text-white transition-all duration-300 transform translate-y-0 opacity-100 bg-bni-teal border-teal-700";
            toastIcon.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 shrink-0"></i>`;
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            toast.className = "fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-xl shadow-lg border text-white transition-all duration-300 transform translate-y-[-150%] opacity-0";
        }, 3500);
    }

    /**
     * Debounce function for search/filter inputs
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(func, delay = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Deep clone object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Download JSON as file
     * @param {Object} data - Data to download
     * @param {string} filename - File name
     */
    function downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Get asset criticality status
     * @param {Object} asset - Asset object
     * @returns {boolean} True if critical
     */
    function isCritical(asset) {
        if (asset.jenisAset === 'Bangunan' || asset.kelas === '0021') {
            return asset.aging > 360;
        } else {
            return asset.aging > 180;
        }
    }

    // Public API
    return {
        formatIDR,
        parseIDR,
        formatDate,
        showToast,
        debounce,
        generateId,
        deepClone,
        downloadJSON,
        isCritical
    };
})();