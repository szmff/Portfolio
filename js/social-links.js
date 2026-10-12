/**
 * =========================================================
 * SOCIAL LINKS SERVICE
 * =========================================================
 */

async function getSocialLinks() {
    // Add only public profile URLs you intentionally want to publish.
    return [];
}


/**
 * Validate social URL.
 */
function safeSocialUrl(url) {

    if (
        typeof isValidURL === "function" &&
        isValidURL(url)
    ) {
        return escapeHTML(url);
    }

    return "#";
}


/**
 * Determine if link is WhatsApp.
 */
function isWhatsApp(link) {

    const platform =
        String(link.platform || "");

    const url =
        String(link.url || "");

    return (
        /whatsapp/i.test(platform) ||
        /wa\.me/i.test(url) ||
        /whatsapp/i.test(url)
    );
}


/**
 * Create regular social icon.
 */
function socialMarkup(link) {

    const platform =
        escapeHTML(
            link.platform || "Social Link"
        );

    const icon =
        escapeHTML(
            link.icon ||
            "fa-solid fa-link"
        );

    const url =
        safeSocialUrl(link.url);


    return `
        <a
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="${platform}"
        >
            <i class="${icon}"></i>
        </a>
    `;
}


/**
 * Create WhatsApp contact card.
 */
function whatsappMarkup(link) {

    const url =
        safeSocialUrl(link.url);


    return `
        <a
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-channel-card whatsapp-channel-card"
            aria-label="Chat on WhatsApp"
        >

            <div class="channel-icon-box whatsapp-icon-box">
                <i class="fa-brands fa-whatsapp"></i>
            </div>

            <div class="channel-info">
                <span class="channel-label">WhatsApp</span>
                <span class="channel-value">Let's Chat on WhatsApp</span>
            </div>

            <i class="fa-solid fa-arrow-up-right-from-square channel-arrow"></i>

        </a>
    `;
}


/**
 * Render social links.
 */
async function renderSocialLinks() {

    try {

        const links =
            await getSocialLinks();


        const hero =
            document.getElementById(
                "hero-socials"
            );

        const footer =
            document.getElementById(
                "footer-socials"
            );

        const whatsappContainer =
            document.getElementById(
                "whatsapp-channel"
            );


        /*
         * WhatsApp
         */
        const whatsapp =
            links.find(isWhatsApp);


        if (
            whatsappContainer &&
            whatsapp
        ) {

            whatsappContainer.innerHTML =
                whatsappMarkup(whatsapp);

        } else if (whatsappContainer) {

            whatsappContainer.innerHTML = "";
        }


        /*
         * Regular socials
         */
        const regularLinks =
            links
                .filter(link => !isWhatsApp(link))
                .map(socialMarkup)
                .join("");


        if (hero) {
            hero.innerHTML =
                regularLinks;
        }


        if (footer) {
            footer.innerHTML =
                regularLinks;
        }


        console.log(
            `[SocialLinks] Loaded ${links.length} links.`
        );

    } catch (error) {

        console.error(
            "[SocialLinks] Render error:",
            error
        );
    }
}