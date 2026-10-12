/**
 * =========================================================
 * SITE SETTINGS SERVICE
 * =========================================================
 */

async function getSiteSettings() {
    return {
        site_name: 'Zeyad Nour (ZEYADNOUR) | Web Developer Portfolio',
        site_description: 'Portfolio of Zeyad Nour, showcasing web development projects and digital experiences.',
        hero_title: 'WEB DEVELOPER',
        about_eyebrow: 'ABOUT ME',
        about_title: 'Crafting Modern Digital Experiences',
        skills_eyebrow: 'TECHNICAL PROFICIENCY',
        skills_title: 'Skills & Technologies',
        skills_description: 'Core technical competencies and modern development stack.',
        contact_eyebrow: 'GET IN TOUCH',
        contact_title: "Let's Work Together",
        contact_description: 'Have an upcoming project or web app idea? Reach out directly.',
        footer_text: '© 2026 Zeyad Nour. All rights reserved.'
    };
}


/**
 * Set text safely.
 */
function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    if (value !== null && value !== undefined) {
        element.textContent = value;
    }
}


/**
 * Render all public site settings.
 */
async function renderSiteSettings() {

    try {

        const settings =
            await getSiteSettings();

        if (!settings) {
            console.warn(
                "[SiteSettings] No settings found."
            );

            return;
        }


        /*
         * Document title
         */
        if (settings.site_name) {
            document.title =
                settings.site_name;
        }


        /*
         * SEO description
         */
        const description =
            document.querySelector(
                'meta[name="description"]'
            );

        if (
            description &&
            settings.site_description
        ) {
            description.content =
                settings.site_description;
        }


        /*
         * Open Graph title
         */
        const ogTitle =
            document.querySelector(
                'meta[property="og:title"]'
            );

        if (ogTitle && settings.site_name) {
            ogTitle.content =
                settings.site_name;
        }


        /*
         * Open Graph description
         */
        const ogDescription =
            document.querySelector(
                'meta[property="og:description"]'
            );

        if (
            ogDescription &&
            settings.site_description
        ) {
            ogDescription.content =
                settings.site_description;
        }


        /*
         * Logo
         */
        if (settings.logo_url) {

            const logo =
                document.querySelector(
                    ".nav-logo-img"
                );

            if (logo) {
                logo.src =
                    settings.logo_url;
            }
        }


        /*
         * Favicon
         */
        if (settings.favicon_url) {

            const favicon =
                document.querySelector(
                    'link[rel="icon"]'
                );

            if (favicon) {
                favicon.href =
                    settings.favicon_url;
            }
        }


        /*
         * Hero
         */
        setText(
            "hero-eyebrow-text",
            settings.hero_title
        );


        /*
         * About
         */
        setText(
            "about-eyebrow",
            settings.about_eyebrow
        );

        setText(
            "about-title",
            settings.about_title
        );


        /*
         * Skills
         */
        setText(
            "skills-eyebrow",
            settings.skills_eyebrow
        );

        setText(
            "skills-title",
            settings.skills_title
        );

        setText(
            "skills-description",
            settings.skills_description
        );


        /*
         * Contact
         */
        setText(
            "contact-eyebrow",
            settings.contact_eyebrow
        );

        setText(
            "contact-title",
            settings.contact_title
        );

        setText(
            "contact-description",
            settings.contact_description
        );


        /*
         * Footer
         */
        setText(
            "footer-text",
            settings.footer_text
        );


        console.log(
            "[SiteSettings] Settings rendered successfully."
        );

    } catch (error) {

        console.error(
            "[SiteSettings] Render error:",
            error
        );
    }
}