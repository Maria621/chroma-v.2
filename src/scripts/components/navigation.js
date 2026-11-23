/** Navegação acessível: menu móvel com foco controlado, fundo inerte e retorno seguro. */
export function initNavigation() {
  const menu = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-nav');
  const header = document.querySelector('.site-header');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (menu && mobile && header) {
    const backdrop = document.createElement('div');
    backdrop.className = 'v33-menu-backdrop';
    backdrop.hidden = true;
    document.body.append(backdrop);

    const logo = header.querySelector('.logo-link');
    const otherHeaderItems = [
      logo,
      header.querySelector('.desktop-nav'),
      header.querySelector('.header-cta'),
    ].filter(Boolean);
    const background = [
      document.querySelector('.skip-link'),
      document.querySelector('main'),
      document.querySelector('footer'),
      ...otherHeaderItems,
    ].filter(Boolean);

    const getFocusables = () => [...mobile.querySelectorAll('a[href]:not([aria-disabled="true"])')];

    function setOpen(open, restoreFocus = false) {
      mobile.hidden = !open;
      backdrop.hidden = !open;
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('v33-menu-open', open);
      background.forEach(element => { element.inert = open; });

      if (open) {
        (getFocusables()[0] || menu).focus();
      } else if (restoreFocus) {
        // O botão hambúrguer deixa de ser exibido no desktop.
        const target = window.innerWidth > 1000 ? (logo || menu) : menu;
        target.focus();
      }
    }

    menu.addEventListener('click', () => setOpen(mobile.hidden, !mobile.hidden));
    backdrop.addEventListener('click', () => setOpen(false, true));
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', event => {
      if (mobile.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false, true);
        return;
      }
      if (event.key !== 'Tab') return;

      const links = getFocusables();
      const last = links.at(-1);
      if (!last) return;

      if (event.shiftKey && document.activeElement === menu) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        menu.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000 && !mobile.hidden) setOpen(false, true);
    });
  }

  const scrollTop = document.createElement('button');
  scrollTop.type = 'button';
  scrollTop.className = 'v33-scrolltop';
  scrollTop.textContent = '↑';
  scrollTop.setAttribute('aria-label', 'Voltar ao início da página');
  document.body.append(scrollTop);
  scrollTop.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: reduced ? 'auto' : 'smooth'});
  });

  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const y = window.scrollY;
      const full = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      header?.style.setProperty('--c33-scroll', Math.round(y / full * 100) + '%');
      header?.classList.toggle('v33-scrolled', y > 48);
      scrollTop.classList.toggle('show', y > 750);
      // Não permitir que um botão invisível seja focado pelo teclado.
      scrollTop.tabIndex = y > 750 ? 0 : -1;
      scrollTop.setAttribute('aria-hidden', String(y <= 750));
    });
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();
}
