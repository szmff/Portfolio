/* onepage.js — Portfolio functionality / وظائف الموقع */
(()=>{'use strict';

/* ===== DOM REFERENCES / مراجع عناصر الصفحة ===== */
const root=document.documentElement, reduced=matchMedia('(prefers-reduced-motion: reduce)');
const theme=null,lang=document.querySelector('[data-lang]');
const nav=document.querySelector('#navigation'),menu=document.querySelector('.menu-btn'),top=document.querySelector('.top');
let language=localStorage.getItem('zn-language')==='ar'?'ar':'en';

/* ===== LANGUAGE SWITCHING / تبديل اللغة عربي وإنجليزي ===== */
function applyLang(){root.lang=language;root.dir=language==='ar'?'rtl':'ltr';document.title=language==='ar'?'زياد نور | مطور ويب متكامل':'Zeyad Nour | Full-Stack Developer';document.querySelectorAll('[data-en][data-ar]').forEach(el=>{el.textContent=el.dataset[language]});lang.textContent=language==='ar'?'English':'العربية';lang.setAttribute('aria-label',language==='ar'?'Switch to English':'التبديل إلى العربية');}
applyLang();lang.addEventListener('click',()=>{language=language==='ar'?'en':'ar';localStorage.setItem('zn-language',language);applyLang();updateReading();});
root.dataset.theme='dark';try{localStorage.removeItem('zn-theme')}catch{}

/* ===== MOBILE NAVIGATION / قائمة الموبايل ===== */
top.dataset.ready='';const compact=matchMedia('(max-width:770px)');function close(){top.classList.remove('menu-is-open');delete nav.dataset.open;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',language==='ar'?'فتح القائمة':'Open navigation menu')};function syncMenu(){menu.hidden=!compact.matches;close()};syncMenu();compact.addEventListener('change',syncMenu);menu.addEventListener('click',()=>{if(nav.hasAttribute('data-open'))close();else{top.classList.add('menu-is-open');nav.dataset.open='';menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label',language==='ar'?'إغلاق القائمة':'Close navigation menu')}});nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});document.addEventListener('pointerdown',e=>{if(compact.matches&&!top.contains(e.target))close()});
const reader=document.querySelector('.reader-body'),paras=[...document.querySelectorAll('[data-reading]')];
// Text appears word by word as its paragraph moves through the viewport. Without JS text remains visible.
paras.forEach(p=>{p.dataset.en=p.dataset.en||p.textContent;p.dataset.ar=p.dataset.ar||p.dataset.en;});
function buildWords(){paras.forEach(p=>{const content=p.dataset[language];p.replaceChildren();content.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){p.append(document.createTextNode(part));return;}const s=document.createElement('span');s.className='read-word';s.textContent=part;p.append(s)})})}

/* ===== SCROLL READING EFFECT / تأثير القراءة مع النزول ===== */
function updateReading(){const h=innerHeight;paras.forEach(p=>{const rect=p.getBoundingClientRect(),words=p.querySelectorAll('.read-word');const progress=Math.min(1,Math.max(0,(h*.88-rect.top)/(h*.55)));const shown=Math.round(words.length*progress);words.forEach((w,i)=>w.classList.toggle('visible',reduced.matches||i<shown));});}
buildWords();const previousLang=lang.onclick;lang.addEventListener('click',()=>{buildWords();updateReading()});
const folder=document.querySelector('[data-folder]'),sections=[...document.querySelectorAll('main section[id]')],links=[...nav.querySelectorAll('a')];let scheduled=false;
function frame(){scheduled=false;const y=scrollY,h=innerHeight;top.style.setProperty('--page',Math.min(1,y/Math.max(1,root.scrollHeight-h)));let active='';for(const s of sections)if(s.getBoundingClientRect().top<=h*.36)active=s.id;links.forEach(a=>a.toggleAttribute('aria-current',a.hash==='#'+active));updateReading();if(folder&&!reduced.matches){const b=folder.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(h*.94-b.top)/(h*.58)));folder.style.setProperty('--open',String(progress*progress*(3-2*progress)))}}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);schedule();
const copy=document.querySelector('[data-copy]');if(copy){copy.hidden=false;copy.addEventListener('click',async()=>{const status=document.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText(copy.dataset.copy);status.textContent=language==='ar'?'تم النسخ':'Copied';}catch{status.textContent=language==='ar'?'تعذر النسخ':'Copy failed';}})}
})();