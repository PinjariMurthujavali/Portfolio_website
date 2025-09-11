/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(!toggle || !nav) return

    // Ensure accessible attributes
    toggle.setAttribute('aria-controls', navId)
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('role', 'button')

    const icon = toggle.querySelector('i')

    toggle.addEventListener('click', ()=>{
        const opened = nav.classList.toggle('show')
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false')

        // Swap the icon if present (menu <-> x)
        if(icon){
            if(opened){
                icon.classList.remove('bx-menu')
                icon.classList.add('bx-x')
            } else {
                icon.classList.remove('bx-x')
                icon.classList.add('bx-menu')
            }
        }
    })
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    const toggle = document.getElementById('nav-toggle')
    const icon = toggle ? toggle.querySelector('i') : null
    if(navMenu && navMenu.classList.contains('show')){
        navMenu.classList.remove('show')
        if(toggle){ toggle.setAttribute('aria-expanded', 'false') }
        if(icon){ icon.classList.remove('bx-x'); icon.classList.add('bx-menu') }
    }
}
navLink.forEach(n => n.addEventListener('click', linkAction))

// Close mobile menu when resizing to desktop width
window.addEventListener('resize', ()=>{
    const navMenu = document.getElementById('nav-menu')
    const toggle = document.getElementById('nav-toggle')
    const icon = toggle ? toggle.querySelector('i') : null
    if(window.innerWidth >= 768 && navMenu && navMenu.classList.contains('show')){
        navMenu.classList.remove('show')
        if(toggle) toggle.setAttribute('aria-expanded', 'false')
        if(icon){ icon.classList.remove('bx-x'); icon.classList.add('bx-menu') }
    }
})

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/* ====== Portfolio 3D Mode & Pointer Tilt ====== */
// Enable 3D interactions only on pointer-capable devices and when user permits motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enablePortfolio3D(enable = true){
    if(enable) document.body.classList.add('portfolio-3d');
    else document.body.classList.remove('portfolio-3d');
}

// Pointer-driven tilt for elements with .tilt
function attachTilt(root = document){
    if(prefersReducedMotion) return;
    if(window.matchMedia('(hover: none)').matches) return; // skip touch-first devices

    const tiltEls = root.querySelectorAll('.tilt');
    tiltEls.forEach(el => {
        let rect = null;
        function onMove(e){
            rect = rect || el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rx = (-y) * 8; // rotateX
            const ry = (x) * 12; // rotateY
            el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
            el.setAttribute('data-tilt','active');
        }
        function onLeave(){ el.style.transform = ''; el.removeAttribute('data-tilt'); rect = null; }
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('touchstart', onLeave, {passive:true});
    });
}

// Auto-enable 3D mode on wide screens by default
document.addEventListener('DOMContentLoaded', ()=>{
    const can3D = window.innerWidth >= 900 && !prefersReducedMotion;
    if(can3D) enablePortfolio3D(true);
    attachTilt(document);
});

// Expose toggle for devs/console
window.portfolio3D = { enable: enablePortfolio3D, attachTilt };

/* ===== Palette rotation for animated gradients ===== */
(function paletteRotator(){
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(prefersReducedMotion) return; // don't auto-rotate for reduced motion

    const palettes = [
        { a: getComputedStyle(document.documentElement).getPropertyValue('--pal-a-0').trim() || '#0b66d1', b: getComputedStyle(document.documentElement).getPropertyValue('--pal-b-0').trim() || '#00a896', c: getComputedStyle(document.documentElement).getPropertyValue('--pal-c-0').trim() || '#08306b' },
        { a: getComputedStyle(document.documentElement).getPropertyValue('--pal-a-1').trim() || '#ff6b6b', b: getComputedStyle(document.documentElement).getPropertyValue('--pal-b-1').trim() || '#ffd166', c: getComputedStyle(document.documentElement).getPropertyValue('--pal-c-1').trim() || '#845ec2' },
        { a: getComputedStyle(document.documentElement).getPropertyValue('--pal-a-2').trim() || '#00c2ff', b: getComputedStyle(document.documentElement).getPropertyValue('--pal-b-2').trim() || '#7b61ff', c: getComputedStyle(document.documentElement).getPropertyValue('--pal-c-2').trim() || '#00a896' }
    ];

    let idx = 0;
    function hexToRgbVars(hex, prefix){
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(!res) return;
        const r = parseInt(res[1],16), g = parseInt(res[2],16), b = parseInt(res[3],16);
        document.documentElement.style.setProperty(`--${prefix}-r`, r);
        document.documentElement.style.setProperty(`--${prefix}-g`, g);
        document.documentElement.style.setProperty(`--${prefix}-b`, b);
    }

    function applyPalette(i){
        const p = palettes[i % palettes.length];
        hexToRgbVars(p.a, 'pal-a');
        hexToRgbVars(p.b, 'pal-b');
        hexToRgbVars(p.c, 'pal-c');
        // also set hero grad fallbacks
        document.documentElement.style.setProperty('--hero-grad-b', p.a);
        document.documentElement.style.setProperty('--hero-grad-c', p.b);
    }

    // initial apply
    applyPalette(idx);

    const interval = 9000; // 9s per palette
    const timer = setInterval(()=>{ idx = (idx+1) % palettes.length; applyPalette(idx); }, interval);

    // expose control
    window.paletteRotator = { stop: ()=> clearInterval(timer), start: ()=> {/*noop*/} };
})();
