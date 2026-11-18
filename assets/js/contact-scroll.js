/* contact-scroll.js — Portfolio functionality / وظائف الموقع */
/* Progressive entrance, no sticky pinning and no invisible final state. */
(()=>{'use strict';
/* ===== CONTACT REVEAL / إظهار عناصر التواصل مع النزول ===== */
const section=document.querySelector('#contact');const intro=section?.querySelector('.contact-v5-intro');if(!section||!intro)return;
const elements=[...intro.querySelectorAll('.contact-v10-reveal')];const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0;const clamp=n=>Math.max(0,Math.min(1,n));
function update(){raf=0;if(intro.hidden)return;const top=section.getBoundingClientRect().top;const h=window.innerHeight;const progress=clamp((h*.92-top)/(h*.82));const starts=[0,.13,.28,.45,.62];const duration=.24;
elements.forEach((el,i)=>{const value=reduce.matches?1:clamp((progress-starts[i])/duration);el.style.setProperty('--reveal-progress',String(value));});}
function queue(){if(!raf)raf=requestAnimationFrame(update)}
/* CSS is fully readable without JS; enable animation only after first calculation. */
update();intro.classList.add('motion-active');
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);addEventListener('hashchange',()=>requestAnimationFrame(queue));reduce.addEventListener('change',queue);
})();
