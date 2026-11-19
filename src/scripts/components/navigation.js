export function initNavigation() {
  const menu = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-nav');
  const header = document.querySelector('.site-header');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (menu && mobile) {
    const backdrop = document.createElement('div');
    backdrop.className = 'v33-menu-backdrop';
    backdrop.hidden = true;
    document.body.append(backdrop);
    let previousFocus = null;
    const background = [document.querySelector("main"), document.querySelector("footer")].filter(Boolean);
    const setOpen = (open, restoreFocus = false) => {
      mobile.hidden = !open;
      backdrop.hidden = !open;
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('v33-menu-open', open);
      background.forEach(element => { element.inert = open; });
      if (open) { previousFocus = document.activeElement; mobile.querySelector('a')?.focus(); }
      else if (restoreFocus) (previousFocus && previousFocus.isConnected ? previousFocus : menu).focus();
    };
    menu.addEventListener('click', () => setOpen(mobile.hidden));
    backdrop.addEventListener('click', () => setOpen(false, true));
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
      if (mobile.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
      if (event.key !== 'Tab') return;
      const focusables = [...mobile.querySelectorAll('a[href]')];
      const first = menu, last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1000 && !mobile.hidden) setOpen(false, true); });
  }
  const scrollTop = document.createElement('button');
  scrollTop.type = 'button'; scrollTop.className = 'v33-scrolltop';
  scrollTop.textContent = '↑'; scrollTop.setAttribute('aria-label','Voltar ao início da página');
  document.body.append(scrollTop);
  scrollTop.addEventListener('click', () => window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const y = window.scrollY;
      const full = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      header?.style.setProperty('--c33-scroll', Math.round(y/full*100)+'%');
      header?.classList.toggle('v33-scrolled', y>48);
      scrollTop.classList.toggle('show', y>750);
    });
  };
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
}
