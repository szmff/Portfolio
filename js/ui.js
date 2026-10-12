/**
 * UI Interaction & Accessibility Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initScrollspy();
    initTypewriter();
});

/**
 * Adds backdrop blur and scrolled background styling to fixed Navbar
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }, { passive: true });
}

/**
 * Mobile Hamburger Menu Drawer Handler
 */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navDrawer = document.querySelector('.nav-links');
    const overlay = document.querySelector('.mobile-overlay');

    if (!toggleBtn || !navDrawer) return;

    function openMenu() {
        toggleBtn.setAttribute('aria-expanded', 'true');
        navDrawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navDrawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close when clicking any nav link
    const links = navDrawer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
            closeMenu();
        }
    });

    // Reset drawer state on screen resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navDrawer.classList.contains('active')) {
            closeMenu();
        }
    });
}

/**
 * Scrollspy for active Navigation link highlighting
 */
function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/**
 * Typewriter effect for Hero section
 */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const phrases = [
        "I am a Web Developer",
        "I am a Frontend Developer",
        "I am a UI/UX Enthusiast",
        "I am a Problem Solver"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 1800; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }

    type();
}
