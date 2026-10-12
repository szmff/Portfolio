/**
 * Dynamic Category Filtering & Tab Management
 */

let activeCategorySlug = 'all';

/**
 * Initializes Category Pills UI and binds filter click events.
 * @param {Array} categories 
 * @param {Function} onFilterChange 
 */
function renderCategoryFilters(categories, onFilterChange) {
    const container = document.getElementById('category-filters');
    if (!container) return;

    // Ensure 'All' pill exists
    let categoriesList = [...categories];
    if (!categoriesList.some(c => c.slug === 'all')) {
        categoriesList.unshift({ id: 'all', name: 'All', slug: 'all', sort_order: 0 });
    }

    container.innerHTML = categoriesList.map(cat => `
        <button 
            type="button" 
            class="filter-pill ${cat.slug === activeCategorySlug ? 'active' : ''}" 
            data-slug="${escapeHTML(cat.slug)}"
            aria-pressed="${cat.slug === activeCategorySlug ? 'true' : 'false'}"
        >
            ${escapeHTML(cat.name)}
        </button>
    `).join('');

    const buttons = container.querySelectorAll('.filter-pill');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetSlug = e.currentTarget.getAttribute('data-slug');
            if (targetSlug === activeCategorySlug) return;

            activeCategorySlug = targetSlug;

            buttons.forEach(b => {
                const isActive = b.getAttribute('data-slug') === activeCategorySlug;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            if (typeof onFilterChange === 'function') {
                onFilterChange(activeCategorySlug);
            }
        });
    });
}

/**
 * Filters visible project card elements smoothly with CSS animations.
 * @param {string} categorySlug 
 */
function filterProjectCards(categorySlug) {
    const cardElements = document.querySelectorAll('.project-card[data-category]');
    const emptyState = document.getElementById('projects-empty-state');
    let visibleCount = 0;

    cardElements.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const matches = (categorySlug === 'all' || cardCategory === categorySlug);

        if (matches) {
            visibleCount++;
            card.style.display = 'flex';
            requestAnimationFrame(() => {
                card.classList.remove('card-hidden');
                card.classList.add('card-visible');
            });
        } else {
            card.classList.remove('card-visible');
            card.classList.add('card-hidden');
            setTimeout(() => {
                if (card.classList.contains('card-hidden')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    });

    if (emptyState) {
        if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}
