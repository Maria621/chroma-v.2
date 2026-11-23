/** Um único controlador para o carrossel. Sem autoplay e com interação por teclado/toque. */
export function initCarousel() {
  const gallery = document.querySelector('.angled-gallery');
  if (!gallery) return;
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  gallery.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End');
  if (!slides.length) return;
  let index = 0;
  const count = document.querySelector('.gallery-count');
  const prev = document.querySelector('.gallery-prev');
  const next = document.querySelector('.gallery-next');
  const dots = document.createElement('div');
  dots.className = 'v33-gallery-dots';
  dots.setAttribute('role','group'); dots.setAttribute('aria-label','Escolher imagem do carrossel');
  document.querySelector('.gallery-side')?.append(dots);
  const progress = document.createElement('div');
  progress.className = 'v33-slide-progress';
  const bar = document.createElement('span');
  bar.style.width = `${100 / slides.length}%`;
  progress.append(bar); gallery.append(progress);
  const select = (value, focus = false) => {
    index = (value+slides.length) % slides.length;
    slides.forEach((slide,i) => {
      const active = i===index;
      slide.classList.toggle('is-active',active);
      slide.setAttribute('aria-hidden',String(!active));
      slide.inert = !active;
    });
    [...dots.children].forEach((dot,i) => {
      dot.classList.toggle('is-active',i===index);
      dot.setAttribute('aria-pressed',String(i===index));
      if (focus && i===index) dot.focus();
    });
    bar.style.transform = `translateX(${index*100}%)`;
    if(count) count.textContent = `${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  };
  slides.forEach((slide,i) => {
    slide.id = slide.id || `chroma-gallery-slide-${i+1}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'imagem');
    slide.setAttribute('aria-label', `Imagem ${i+1} de ${slides.length}`);
    const dot = document.createElement('button'); dot.type='button';
    dot.setAttribute('aria-controls', slide.id);
    dot.setAttribute('aria-label',`Ver imagem ${i+1} de ${slides.length}`);
    dot.addEventListener('click', () => select(i));
    dots.append(dot);
  });
  prev?.addEventListener('click',() => select(index-1));
  next?.addEventListener('click',() => select(index+1));
  gallery.addEventListener('keydown', e => {
    if (e.target.closest('.media-zoom-button')) return;
    if (e.key==='ArrowLeft' || e.key==='ArrowRight') {
      e.preventDefault(); select(index+(e.key==='ArrowRight'?1:-1));
    }
    if(e.key==='Home'){e.preventDefault();select(0)}
    if(e.key==='End'){e.preventDefault();select(slides.length-1)}
  });
  let start = null;
  gallery.addEventListener('pointerdown', e => {
    if(e.target.closest('button'))return;
    start = {x:e.clientX,y:e.clientY};
  },{passive:true});
  gallery.addEventListener('pointerup', e => {
    if (!start) return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    start=null;
    if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.3) select(index+(dx<0?1:-1));
  },{passive:true});
  select(0);
}
