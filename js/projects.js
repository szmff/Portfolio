/**
 * Projects Data Service & UI Renderer
 * Single Source of Truth for projects, project_images, and project_technologies tables.
 */

/**
 * Fetches published projects from Supabase with relational Category details.
 * Orders by sort_order ASC, then created_at DESC.
 */
/* Static project content for the public GitHub Pages edition.
   No Supabase SDK, database URL, or API key is used. */
const PORTFOLIO_PROJECTS = [
  {
    "id": "p1",
    "title": "Breeqal Al Asimah",
    "slug": "breeqal-asimah",
    "short_description": "A website for furniture moving and storage services.",
    "description": "A business website designed to present furniture moving and storage services with a clear, professional user experience.",
    "category_id": "web",
    "website_url": "https://breeqal-asimah.com/",
    "github_url": "",
    "cover_image": "assets/projects/breeqal-asimah.png",
    "featured": true,
    "status": "published",
    "sort_order": 1,
    "year": "2026",
    "categories": {
      "id": "web",
      "name": "Web Development",
      "slug": "web-development"
    },
    "project_technologies": [
      {
        "technology_name": "HTML"
      },
      {
        "technology_name": "CSS"
      },
      {
        "technology_name": "JavaScript"
      }
    ],
    "project_images": []
  },
  {
    "id": "p2",
    "title": "OVERPOWER",
    "slug": "overpower",
    "short_description": "An online store for gaming devices and professional PC components.",
    "description": "An e-commerce experience focused on gaming devices and PC components, with product discovery and a modern storefront design.",
    "category_id": "commerce",
    "website_url": "https://overpower.gt.tc/",
    "github_url": "",
    "cover_image": "assets/projects/overpower.png",
    "featured": true,
    "status": "published",
    "sort_order": 2,
    "year": "2026",
    "categories": {
      "id": "commerce",
      "name": "E-commerce",
      "slug": "e-commerce"
    },
    "project_technologies": [
      {
        "technology_name": "HTML"
      },
      {
        "technology_name": "CSS"
      },
      {
        "technology_name": "JavaScript"
      }
    ],
    "project_images": []
  },
  {
    "id": "p3",
    "title": "Edress Estate",
    "slug": "edress-estate",
    "short_description": "A real-estate website presenting premium properties in Cairo.",
    "description": "A real-estate web experience built to showcase properties with a polished layout and straightforward browsing.",
    "category_id": "web",
    "website_url": "https://edressestate.rf.gd/",
    "github_url": "",
    "cover_image": "assets/projects/edress-estate.png",
    "featured": true,
    "status": "published",
    "sort_order": 3,
    "year": "2026",
    "categories": {
      "id": "web",
      "name": "Web Development",
      "slug": "web-development"
    },
    "project_technologies": [
      {
        "technology_name": "HTML"
      },
      {
        "technology_name": "CSS"
      },
      {
        "technology_name": "JavaScript"
      }
    ],
    "project_images": []
  }
];

async function getProjects() {
    return PORTFOLIO_PROJECTS.slice().sort((a, b) => a.sort_order - b.sort_order);
}

async function getProjectBySlug(slug) {
    return PORTFOLIO_PROJECTS.find(project => project.slug === slug) || null;
}

/**
 * Main Portfolio Page Projects Renderer
 */
async function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const categoryContainer = document.getElementById('category-filters');

    if (!projectsGrid) return;

    // 1. Render Loading Skeleton
    projectsGrid.innerHTML = renderSkeletonCards(6);

    try {
        // Fetch Categories and Projects in parallel
        const [categories, projects] = await Promise.all([
            getCategories(),
            getProjects()
        ]);

        // Render Category Filter Pills
        if (categoryContainer) {
            renderCategoryFiltersUI(categories, (selectedSlug) => {
                filterProjectCards(selectedSlug);
            });
        }

        // Check if database returned empty projects array
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open"></i>
                    <h3>No projects available</h3>
                    <p>Project details will be added here soon.</p>
                </div>
            `;
            return;
        }

        // Render Projects Grid using DOM elements to prevent XSS
        renderProjectsListUI(projects, projectsGrid);

    } catch (err) {
        console.error('[Projects] Database connection failure:', err);
        projectsGrid.innerHTML = `
            <div class="empty-state error-state">
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--color-error);"></i>
                <h3>Unable to load projects</h3>
                <p>Please refresh the page and try again.</p>
                <button type="button" id="retry-load-projects-btn" class="btn btn-primary btn-sm" style="margin-top: 1rem;">
                    <i class="fa-solid fa-rotate-right"></i> Retry Connection
                </button>
            </div>
        `;

        const retryBtn = document.getElementById('retry-load-projects-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => loadProjects());
        }
    }
}

/**
 * Renders Projects Grid into container
 * @param {Array} projects 
 * @param {HTMLElement} container 
 */
function renderProjectsListUI(projects, container) {
    container.innerHTML = ''; // Clear skeleton

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card card-visible';
        
        const catSlug = project.categories ? project.categories.slug : 'uncategorized';
        const catName = project.categories ? project.categories.name : 'General';
        card.setAttribute('data-category', catSlug);

        // Image Wrapper
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'project-image-wrapper';

        if (project.cover_image) {
            const img = document.createElement('img');
            img.src = project.cover_image;
            img.alt = project.title || 'Project Preview';
            img.loading = 'lazy';
            img.width = 600;
            img.height = 375;
            imgWrapper.appendChild(img);
        } else {
            const noImg = document.createElement('div');
            noImg.className = 'no-preview-placeholder';
            noImg.innerHTML = `<i class="fa-solid fa-image"></i><span>No preview available</span>`;
            imgWrapper.appendChild(noImg);
        }

        if (project.featured) {
            const featuredBadge = document.createElement('span');
            featuredBadge.className = 'featured-badge';
            featuredBadge.innerHTML = `<i class="fa-solid fa-star"></i> Featured`;
            imgWrapper.appendChild(featuredBadge);
        }

        // Card Content Body
        const content = document.createElement('div');
        content.className = 'project-content';

        const catBadge = document.createElement('span');
        catBadge.className = 'project-category-badge';
        catBadge.textContent = catName;

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title || 'Untitled Project';

        const desc = document.createElement('p');
        desc.className = 'project-description';
        desc.textContent = project.short_description || '';

        // Card Actions
        const actions = document.createElement('div');
        actions.className = 'project-actions';

        const detailsBtn = document.createElement('a');
        detailsBtn.href = `project.html?slug=${encodeURIComponent(project.slug)}`;
        detailsBtn.className = 'btn btn-outline btn-sm';
        detailsBtn.innerHTML = `<i class="fa-solid fa-arrow-right"></i> View Details`;
        actions.appendChild(detailsBtn);

        if (project.website_url && isValidURL(project.website_url)) {
            const visitBtn = document.createElement('a');
            visitBtn.href = project.website_url;
            visitBtn.target = '_blank';
            visitBtn.rel = 'noopener noreferrer';
            visitBtn.className = 'btn btn-primary btn-sm';
            visitBtn.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website`;
            actions.appendChild(visitBtn);
        }

        content.appendChild(catBadge);
        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(actions);

        card.appendChild(imgWrapper);
        card.appendChild(content);

        container.appendChild(card);
    });
}

/**
 * Category Filter UI rendering helper
 */
function renderCategoryFiltersUI(categories, onFilterChange) {
    const container = document.getElementById('category-filters');
    if (!container) return;

    let categoriesList = [{ id: 'all', name: 'All', slug: 'all' }, ...categories];

    container.innerHTML = '';
    categoriesList.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `filter-pill ${cat.slug === activeCategorySlug ? 'active' : ''}`;
        btn.setAttribute('data-slug', cat.slug);
        btn.setAttribute('aria-pressed', cat.slug === activeCategorySlug ? 'true' : 'false');
        btn.textContent = cat.name;

        btn.addEventListener('click', (e) => {
            const targetSlug = e.currentTarget.getAttribute('data-slug');
            if (targetSlug === activeCategorySlug) return;

            activeCategorySlug = targetSlug;

            container.querySelectorAll('.filter-pill').forEach(b => {
                const isActive = b.getAttribute('data-slug') === activeCategorySlug;
                b.classList.toggle('active', isActive);
                b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            if (typeof onFilterChange === 'function') {
                onFilterChange(activeCategorySlug);
            }
        });

        container.appendChild(btn);
    });
}

/**
 * Project Details Page Loader (project.html?slug=...)
 */
async function loadProjectDetailsPage() {
    const container = document.getElementById('project-details-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        window.location.href = 'index.html#projects';
        return;
    }

    container.innerHTML = `
        <div class="project-details-loading">
            <div class="spinner"></div>
            <p>Loading project details...</p>
        </div>
    `;

    try {
        const project = await getProjectBySlug(slug);

        if (!project) {
            document.title = "Project Not Found | Zeyad Nour";
            const robotsMeta = document.querySelector('meta[name="robots"]');
            if (robotsMeta) {
                robotsMeta.setAttribute('content', 'noindex, follow');
            } else {
                const meta = document.createElement('meta');
                meta.name = 'robots';
                meta.content = 'noindex, follow';
                document.head.appendChild(meta);
            }
            const oldSchema = document.querySelector('script[data-schema-id="project-schema"]');
            if (oldSchema) oldSchema.remove();

            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-circle-exclamation" style="color: var(--color-error); font-size: 3rem;"></i>
                    <h2>Project Not Found</h2>
                    <p>The requested project could not be found.</p>
                    <a href="index.html#projects" class="btn btn-primary" style="margin-top: 1.5rem;">
                        <i class="fa-solid fa-arrow-left"></i> Back to All Projects
                    </a>
                </div>
            `;
            return;
        }

        // Set Dynamic Document Title & all SEO Metadata via seo.js
        if (typeof applyProjectPageSEO === 'function') {
            applyProjectPageSEO(project);
        } else {
            // Fallback: basic title update if seo.js not loaded
            document.title = `${project.title} | Zeyad Nour Web Development Project`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && project.short_description) {
                metaDesc.setAttribute('content', project.short_description);
            }
        }

        const catName = project.categories ? project.categories.name : 'General';
        const yearStr = project.year || '2026';

        const techMarkup = (project.project_technologies || []).map(t => `
            <span class="tech-tag">${escapeHTML(t.technology_name)}</span>
        `).join('');

        const galleryImages = project.project_images || [];
        const galleryMarkup = galleryImages.length > 0 ? `
            <div class="project-gallery-section" style="margin-top: 3rem;">
                <h3 class="section-subtitle">Project Gallery</h3>
                <div class="project-gallery-grid">
                    ${galleryImages.map(img => `
                        <div class="gallery-item">
                            <img src="${escapeHTML(img.image_url)}" alt="${escapeHTML(project.title)} screenshot" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const safeWebUrl = isValidURL(project.website_url) ? escapeHTML(project.website_url) : null;
        const safeGithubUrl = isValidURL(project.github_url) ? escapeHTML(project.github_url) : null;

        container.innerHTML = `
            <div class="project-details-view">
                <div class="details-header">
                    <a href="index.html#projects" class="back-link">
                        <i class="fa-solid fa-arrow-left"></i> Back to Projects
                    </a>
                    <div class="details-meta-top">
                        <span class="project-category-badge">${escapeHTML(catName)}</span>
                        <span class="project-year-badge"><i class="fa-solid fa-calendar"></i> ${escapeHTML(yearStr)}</span>
                    </div>
                    <h1 class="details-title">${escapeHTML(project.title)}</h1>
                </div>

                ${project.cover_image ? `
                    <div class="details-cover-container">
                        <img src="${escapeHTML(project.cover_image)}" alt="${escapeHTML(project.title)}" class="details-cover-img">
                    </div>
                ` : `
                    <div class="no-preview-placeholder large">
                        <i class="fa-solid fa-image"></i>
                        <span>No preview available</span>
                    </div>
                `}

                <div class="details-grid">
                    <div class="details-main-content">
                        <h2 class="section-subtitle">Overview & Details</h2>
                        <p class="details-description">${escapeHTML(project.description || project.short_description || '')}</p>
                        ${galleryMarkup}
                    </div>
                    <div class="details-sidebar">
                        <div class="sidebar-card">
                            <h3>Project Information</h3>
                            <div class="sidebar-meta-item">
                                <strong>Category</strong>
                                <span>${escapeHTML(catName)}</span>
                            </div>
                            <div class="sidebar-meta-item">
                                <strong>Year</strong>
                                <span>${escapeHTML(yearStr)}</span>
                            </div>
                            <div class="sidebar-meta-item">
                                <strong>Status</strong>
                                <span class="badge-status-published">Published</span>
                            </div>

                            ${techMarkup ? `
                                <div class="sidebar-meta-item">
                                    <strong>Technologies</strong>
                                    <div class="tech-tags-wrapper">${techMarkup}</div>
                                </div>
                            ` : ''}

                            <div class="sidebar-actions">
                                ${safeWebUrl ? `
                                    <a href="${safeWebUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
                                        <i class="fa-solid fa-globe"></i> Visit Live Website
                                    </a>
                                ` : ''}
                                ${safeGithubUrl ? `
                                    <a href="${safeGithubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block">
                                        <i class="fa-brands fa-github"></i> View GitHub Repository
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('[Projects] Error loading project details page:', err);
        container.innerHTML = `
            <div class="empty-state error-state">
                <i class="fa-solid fa-triangle-exclamation" style="color: var(--color-error); font-size: 3rem;"></i>
                <h2>Unable to load project</h2>
                <p>Please return to the projects section and try again.</p>
                <a href="index.html#projects" class="btn btn-primary" style="margin-top: 1.5rem;">
                    <i class="fa-solid fa-arrow-left"></i> Back to All Projects
                </a>
            </div>
        `;
    }
}
