/**
 * =========================================================
 * SEO UTILITY MODULE — js/seo.js
 * Centralized helpers for safe, duplicate-free SEO management.
 * All values from Supabase are sanitized before insertion.
 * =========================================================
 */


const SEO_BASE_URL = window.location.origin;
const SEO_SITE_NAME = 'Zeyad Nour';
const SEO_DEFAULT_IMAGE = `${SEO_BASE_URL}/assets/me.png`;


/* ----------------------------------------------------------
   Meta Tag Helpers
   ---------------------------------------------------------- */

/**
 * Safely set <meta name="..."> content.
 * Uses existing tag; never creates duplicates.
 * @param {string} name
 * @param {string} content
 */
function setMetaTag(name, content) {
    if (!content) return;
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
    }
    el.content = String(content);
}


/**
 * Safely set <meta property="..."> content (Open Graph / Twitter).
 * Uses existing tag; never creates duplicates.
 * @param {string} property
 * @param {string} content
 */
function setMetaProperty(property, content) {
    if (!content) return;
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
    }
    el.content = String(content);
}


/**
 * Safely set <link rel="canonical"> href.
 * @param {string} url
 */
function setCanonical(url) {
    if (!url) return;
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
    }
    el.href = String(url);
}


/* ----------------------------------------------------------
   Batch Page SEO Updater
   ---------------------------------------------------------- */

/**
 * Update all core SEO tags in one call.
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} [opts.canonical]
 * @param {string} [opts.ogTitle]
 * @param {string} [opts.ogDesc]
 * @param {string} [opts.ogImage]
 * @param {string} [opts.ogUrl]
 * @param {string} [opts.twitterTitle]
 * @param {string} [opts.twitterDesc]
 * @param {string} [opts.twitterImage]
 */
function setPageSEO({
    title,
    description,
    canonical,
    ogTitle,
    ogDesc,
    ogImage,
    ogUrl,
    twitterTitle,
    twitterDesc,
    twitterImage
} = {}) {

    if (title) {
        document.title = String(title);
    }

    if (description) {
        setMetaTag('description', description);
    }

    if (canonical) {
        setCanonical(canonical);
    }

    /* Open Graph */
    setMetaProperty('og:title', ogTitle || title);
    setMetaProperty('og:description', ogDesc || description);
    if (ogImage) setMetaProperty('og:image', ogImage);
    if (ogUrl) setMetaProperty('og:url', ogUrl);

    /* Twitter Card */
    setMetaTag('twitter:title', twitterTitle || ogTitle || title);
    setMetaTag('twitter:description', twitterDesc || ogDesc || description);
    if (twitterImage) setMetaTag('twitter:image', twitterImage);
}


/* ----------------------------------------------------------
   JSON-LD Helpers
   ---------------------------------------------------------- */

/**
 * Inject or replace a JSON-LD <script> block in <head>.
 * Uses a unique data-schema-id attribute to prevent duplicates.
 * @param {string} schemaId   - unique identifier attribute value
 * @param {Object} schemaObj  - plain object to serialize as JSON-LD
 */
function injectJsonLD(schemaId, schemaObj) {
    const existing = document.querySelector(`script[data-schema-id="${schemaId}"]`);
    if (existing) {
        existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', schemaId);
    script.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(script);
}


/**
 * Inject JSON-LD CreativeWork schema for a project page.
 * Only uses data actually present in the project object from Supabase.
 * @param {Object} project  - project record from Supabase
 */
function setProjectJsonLD(project) {
    if (!project || !project.slug) return;

    const pageUrl = `${SEO_BASE_URL}/project.html?slug=${encodeURIComponent(project.slug)}`;

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${pageUrl}#project`,
        name: project.title || '',
        description: project.short_description || project.description || '',
        url: pageUrl,
        author: {
            '@type': 'Person',
            '@id': `${SEO_BASE_URL}/#person`,
            name: 'Zeyad Nour'
        },
        creator: {
            '@type': 'Person',
            '@id': `${SEO_BASE_URL}/#person`,
            name: 'Zeyad Nour'
        }
    };

    if (project.cover_image) {
        schema.image = project.cover_image;
        schema.thumbnailUrl = project.cover_image;
    }

    if (project.year) {
        schema.dateCreated = String(project.year);
    }

    if (project.website_url && typeof isValidURL === 'function' && isValidURL(project.website_url)) {
        schema.sameAs = project.website_url;
    }

    const techs = (project.project_technologies || [])
        .map(t => t.technology_name)
        .filter(Boolean);

    if (techs.length > 0) {
        schema.keywords = techs.join(', ');
    }

    injectJsonLD('project-schema', schema);
}


/**
 * Apply full SEO to a dynamic project page:
 * title, description, canonical, OG, Twitter, JSON-LD.
 * @param {Object} project - Supabase project record
 */
function applyProjectPageSEO(project) {
    if (!project) return;

    const slug = project.slug || '';
    const pageUrl = `${SEO_BASE_URL}/project.html?slug=${encodeURIComponent(slug)}`;
    const title = project.title || 'Project';
    const desc = project.short_description || project.description || 'A web development project by Zeyad Nour (ZEYADNOUR).';
    const image = project.cover_image || SEO_DEFAULT_IMAGE;

    setPageSEO({
        title:        `${title} | Zeyad Nour Web Development Project`,
        description:  desc,
        canonical:    pageUrl,
        ogTitle:      `${title} | Zeyad Nour`,
        ogDesc:        desc,
        ogImage:       image,
        ogUrl:         pageUrl,
        twitterTitle: `${title} | Zeyad Nour`,
        twitterDesc:   desc,
        twitterImage:  image
    });

    setProjectJsonLD(project);
}
