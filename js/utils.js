/**
 * Portfolio & CMS Utility Helpers
 */

/**
 * Escapes raw strings to prevent XSS vulnerability when inserting into HTML.
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Validates URLs ensuring strict http/https protocols.
 * Blocks dangerous scripts like javascript:, data:, vbscript:
 * @param {string} urlString 
 * @returns {boolean}
 */
function isValidURL(urlString) {
    if (!urlString || typeof urlString !== 'string') return false;
    const trimmed = urlString.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
        return false;
    }
    try {
        const parsed = new URL(urlString);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

/**
 * Generates skeleton placeholder cards during asynchronous loading.
 * @param {number} count 
 * @returns {string} HTML markup
 */
function renderSkeletonCards(count = 6) {
    let skeletons = '';
    for (let i = 0; i < count; i++) {
        skeletons += `
            <div class="project-card skeleton-card" aria-hidden="true">
                <div class="skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton-line skeleton-badge"></div>
                    <div class="skeleton-line skeleton-title"></div>
                    <div class="skeleton-line skeleton-text"></div>
                    <div class="skeleton-line skeleton-text short"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton-btn"></div>
                        <div class="skeleton-btn"></div>
                    </div>
                </div>
            </div>
        `;
    }
    return skeletons;
}

/**
 * Displays a Toast notification alert without emojis.
 * @param {string} message 
 * @param {'success'|'error'|'info'} type 
 */
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} toast-icon"></i>
        <span class="toast-message">${escapeHTML(message)}</span>
        <button class="toast-close" aria-label="Close message">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const removeToast = () => {
        toast.classList.add('toast-hiding');
        toast.addEventListener('animationend', () => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        });
    };

    toast.querySelector('.toast-close').addEventListener('click', removeToast);
    setTimeout(removeToast, 4500);
}
