const phaseAccordions = document.querySelectorAll('details[data-accordion-group]');

function animateClose(accordion) {
    return new Promise(resolve => {
        const content = accordion.querySelector('.phase-content');
        if (!accordion.open) { resolve(); return; }

        accordion.classList.remove('is-open');
        content.style.overflow = 'hidden';
        content.style.height = content.scrollHeight + 'px';
        content.offsetHeight; // force reflow
        content.style.transition = 'height 0.3s ease';
        content.style.height = '0';

        content.addEventListener('transitionend', () => {
            accordion.open = false;
            content.style.height = '';
            content.style.overflow = '';
            content.style.transition = '';
            resolve();
        }, { once: true });
    });
}

function animateOpen(accordion) {
    accordion.open = true;
    accordion.classList.add('is-open');

    const content = accordion.querySelector('.phase-content');
    const targetHeight = content.scrollHeight;
    content.style.overflow = 'hidden';
    content.style.height = '0';
    content.offsetHeight; // force reflow
    content.style.transition = 'height 0.3s ease';
    content.style.height = targetHeight + 'px';

    content.addEventListener('transitionend', () => {
        content.style.height = '';
        content.style.overflow = '';
        content.style.transition = '';
    }, { once: true });
}

phaseAccordions.forEach(accordion => {
    if (accordion.open) accordion.classList.add('is-open');

    accordion.querySelector('.phase-summary').addEventListener('click', e => {
        e.preventDefault();

        if (accordion.open) {
            animateClose(accordion);
            return;
        }

        const group = accordion.dataset.accordionGroup;
        const toClose = [...phaseAccordions].filter(
            a => a !== accordion && a.dataset.accordionGroup === group && a.open
        );

        Promise.all(toClose.map(animateClose)).then(() => {
            accordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
            animateOpen(accordion);
        });
    });
});

if (window.mermaid) {
    window.mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        securityLevel: 'loose'
    });
}
