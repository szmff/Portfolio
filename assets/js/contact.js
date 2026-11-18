/* contact.js — Portfolio functionality / وظائف الموقع */

// Contact invitation — reveal channels only on user request.
(() => {
  
/* ===== CONTACT INTERACTIONS / تفاعلات وسائل التواصل ===== */
const trigger = document.getElementById('contact-reveal');
  const options = document.getElementById('contact-options');
  const close = document.getElementById('contact-close');
  const intro = document.querySelector('.contact-v5-intro');
  if (!trigger || !options || !close || !intro) return;
  trigger.addEventListener('click', () => {
    intro.hidden = true;
    intro.closest('#contact')?.classList.add('contact-options-open');
    options.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll: true });
  });
  close.addEventListener('click', () => {
    options.hidden = true;
    intro.hidden = false;
    intro.closest('#contact')?.classList.remove('contact-options-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  });
})();
