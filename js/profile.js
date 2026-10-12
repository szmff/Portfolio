/**
 * =========================================================
 * PROFILE SERVICE
 * =========================================================
 */

async function getProfile() {
    return {
        name: 'Zeyad Nour',
        headline: 'Web Developer specializing in modern, high-performance web applications.',
        bio: 'Zeyad Nour (ZEYADNOUR) is a Web Developer specializing in building modern, high-performance web applications and custom digital experiences.',
        email: '',
        profile_image: 'assets/me.png'
    };
}


/**
 * Convert local image paths into absolute URLs.
 */
function normalizeProfileImagePath(path) {
    if (!path) {
        return "";
    }

    const value = String(path).trim();

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    const cleanPath = value
        .replace(/^\.\/?/, "")
        .replace(/^\/+/, "");

    return `${window.location.origin}/${cleanPath}`;
}


/**
 * Render email.
 */
function renderContactEmail(email) {
    const link = document.getElementById("profile-email-link");
    const text = document.getElementById("profile-email-text");

    if (!link || !email) {
        return;
    }

    const safeEmail = String(email).trim();

    link.href = `mailto:${safeEmail}`;

    if (text) {
        text.textContent = safeEmail;
    }
}


/**
 * Render profile information.
 */
async function renderProfile() {
    try {
        const profile = await getProfile();

        if (!profile) {
            console.warn("[Profile] No profile found.");
            return;
        }

        const nameElement =
            document.getElementById("profile-name");

        const headlineElement =
            document.getElementById("profile-headline");

        const bioElement =
            document.getElementById("profile-bio");

        const avatarElement =
            document.getElementById("profile-avatar-img");


        /*
         * Name
         */
        if (nameElement) {
            nameElement.textContent =
                profile.name || "";
        }


        /*
         * Headline
         */
        if (headlineElement) {
            headlineElement.textContent =
                profile.headline || "";
        }


        /*
         * Bio
         */
        if (bioElement) {
            bioElement.textContent =
                profile.bio || "";
        }


        /*
         * Email
         */
        renderContactEmail(profile.email);


        /*
         * Profile image
         */
        if (avatarElement && profile.profile_image) {

            const imageUrl =
                normalizeProfileImagePath(
                    profile.profile_image
                );

            console.log(
                "[Profile] Profile image URL:",
                imageUrl
            );

            avatarElement.src = imageUrl;

            avatarElement.alt =
                `${profile.name || "Developer"} Profile Avatar`;

            avatarElement.onerror = () => {

                console.warn(
                    "[Profile] Profile image could not be loaded:",
                    imageUrl
                );

                avatarElement.classList.add(
                    "profile-image-error"
                );
            };
        }

    } catch (error) {

        console.error(
            "[Profile] Render error:",
            error
        );
    }
}