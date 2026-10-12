/**
 * ZEYAD NOUR PORTFOLIO
 * Main Application Orchestrator
 * Target Domain: https://zeyadnour.kesug.com/
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[App] Starting portfolio data initialization sequence...');

    try {
        await Promise.all([
            renderSiteSettings(),
            renderProfile(),
            renderSkills(),
            renderSocialLinks()
        ]);

        await loadProjects();

        console.log('[App] Public portfolio dynamic data initialization complete.');
    } catch (error) {
        console.error('[App] Initialization sequence error:', error);
    }

    initSmoothScroll();
});

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const targetId = anchor.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}