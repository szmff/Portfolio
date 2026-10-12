/**
 * =========================================================
 * SKILLS SERVICE
 * =========================================================
 */

async function getSkills() {
    return [
        { name: 'HTML5', category: 'Frontend', icon: 'fa-brands fa-html5' },
        { name: 'CSS3', category: 'Frontend', icon: 'fa-brands fa-css3-alt' },
        { name: 'JavaScript', category: 'Frontend', icon: 'fa-brands fa-js' },
        { name: 'Responsive Design', category: 'UI / UX', icon: 'fa-solid fa-mobile-screen' },
        { name: 'Git & GitHub', category: 'Tools', icon: 'fa-brands fa-github' },
        { name: 'Supabase', category: 'Backend Services', icon: 'fa-solid fa-database' }
    ];
}


/**
 * Build one skill card.
 */
function createSkillCard(skill, index) {

    const icon =
        escapeHTML(
            skill.icon ||
            "fa-solid fa-code"
        );

    const name =
        escapeHTML(
            skill.name || "Technology"
        );

    const category =
        escapeHTML(
            skill.category ||
            "Technology"
        );

    const number =
        String(index + 1)
            .padStart(2, "0");


    return `
        <article class="skill-card">

            <div class="skill-card-top">
                <span class="skill-index">
                    ${number}
                </span>

                <div class="skill-icon">
                    <i class="${icon}"></i>
                </div>
            </div>

            <div class="skill-meta">

                <h3 class="skill-name">
                    ${name}
                </h3>

                <span class="skill-category">
                    ${category}
                </span>

            </div>

            <span class="skill-arrow">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </span>

        </article>
    `;
}


/**
 * Render skills.
 */
async function renderSkills() {

    const container =
        document.getElementById(
            "skills-grid"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="skills-loading">
            Loading skills...
        </div>
    `;


    try {

        const skills =
            await getSkills();


        if (!skills.length) {

            container.innerHTML = `
                <p class="empty-text">
                    No active skills registered.
                </p>
            `;

            return;
        }


        container.innerHTML =
            skills
                .map(createSkillCard)
                .join("");


        console.log(
            `[Skills] Loaded ${skills.length} skills.`
        );

    } catch (error) {

        console.error(
            "[Skills] Render error:",
            error
        );

        container.innerHTML = `
            <p class="error-text">
                Unable to load skills.
            </p>
        `;
    }
}