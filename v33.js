/* Instituto Chroma V3.3 – interações discretas, inclusivas e orientadas à navegação */
(()=>{
'use strict';
const ready=()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const header=document.querySelector('.site-header');
 const goTop=document.createElement('button');goTop.type='button';goTop.className='v33-scrolltop';goTop.textContent='↑';goTop.setAttribute('aria-label','Voltar ao início da página');document.body.append(goTop);
 goTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
 let scheduled=false;
 const onScroll=()=>{
  if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;
   const y=window.scrollY;const full=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   header?.style.setProperty('--c33-scroll',Math.min(100,Math.max(0,100*y/full)).toFixed(2)+'%');
   header?.classList.toggle('v33-scrolled',y>48);
   goTop.classList.toggle('show',y>750);
  });
 };
 window.addEventListener('scroll',onScroll,{passive:true});onScroll();
 // Mobile navigation: existing functional toggle retained; backdrop and outside-close added.
 const menu=document.querySelector('.menu-toggle');const mobile=document.querySelector('.mobile-nav');
 if(menu && mobile){
  const backdrop=document.createElement('div');backdrop.className='v33-menu-backdrop';backdrop.hidden=true;document.body.append(backdrop);
  function sync(){backdrop.hidden=mobile.hidden;document.body.classList.toggle('v33-menu-open',!mobile.hidden)}
  function close(){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');sync()}
  menu.addEventListener('click',()=>queueMicrotask(sync));
  backdrop.addEventListener('click',close);
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  window.addEventListener('resize',()=>{if(window.innerWidth>1000)close()});sync();
 }
 // Carousel: clickable indicators, touch swipe and mouse dragging, no autoplay.
 const gallery=document.querySelector('.angled-gallery');const slides=[...document.querySelectorAll('.gallery-slide')];
 if(gallery&&slides.length){
  const dots=document.createElement('div');dots.className='v33-gallery-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Escolher imagem do carrossel');
  const panel=document.querySelector('.gallery-side');panel?.append(dots);
  const slideProgress=document.createElement('div');slideProgress.className='v33-slide-progress';slideProgress.innerHTML='<span></span>';gallery.append(slideProgress);
  let index=0;
  function getIndex(){const active=slides.findIndex(s=>s.classList.contains('is-active'));return active===-1?0:active}
  function refresh(){index=getIndex();[...dots.children].forEach((b,i)=>{b.classList.toggle('is-active',i===index);b.setAttribute('aria-pressed',String(index===i))});slideProgress.firstElementChild.style.transform=`translateX(${index*100}%)`}
  function seek(i){if(i===index)return;let dir=i>index?'.gallery-next':'.gallery-prev';let steps=(i-index+slides.length)%slides.length;if(dir==='.gallery-prev')steps=(index-i+slides.length)%slides.length;for(let n=0;n<steps;n++)document.querySelector(dir)?.click();refresh()}
  slides.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver imagem ${i+1} de ${slides.length}`);b.addEventListener('click',()=>seek(i));dots.append(b)});
  document.querySelectorAll('.gallery-prev,.gallery-next').forEach(b=>b.addEventListener('click',()=>queueMicrotask(refresh)));
  gallery.addEventListener('keydown',()=>queueMicrotask(refresh));
  let x=0,y=0;
  gallery.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;x=e.clientX;y=e.clientY},{passive:true});
  gallery.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-x)>55 && Math.abs(e.clientY-y)<90){const dir=e.clientX<x?'.gallery-next':'.gallery-prev';document.querySelector(dir)?.click();refresh()}},{passive:true});
  refresh();
 }
 // Timeline progress line always matches the selected year; keep the original descriptions and keyboard controls.
 const timeline=document.querySelector('.timeline-widget');
 if(timeline){
  const axis=timeline.querySelector('.timeline-axis');const tabs=[...timeline.querySelectorAll('[role=tab]')];
  const refresh=()=>{const i=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');axis?.style.setProperty('--v33-progress',((Math.max(0,i)/(tabs.length-1))*100).toFixed(2)+'%');const active=tabs[Math.max(0,i)];if(active&&window.matchMedia('(max-width:760px)').matches){const box=axis.getBoundingClientRect();const rect=active.getBoundingClientRect();if(rect.right>box.right||rect.left<box.left)active.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest',inline:'center'})}};
  tabs.forEach(t=>t.addEventListener('click',()=>queueMicrotask(refresh)));
  timeline.querySelectorAll('.tm-next,.tm-prev').forEach(t=>t.addEventListener('click',()=>queueMicrotask(refresh)));
  timeline.addEventListener('keyup',()=>queueMicrotask(refresh));refresh();
 }
 // Lightbox for photos used as visual references, without implying they document real facilities.
 let dialog=document.querySelector('.v32-art-dialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.className='v32-art-dialog';dialog.setAttribute('aria-label','Ver imagem ampliada');dialog.innerHTML='<button class="v32-art-close" aria-label="Fechar imagem ampliada" type="button">×</button><img alt="" src="">';document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()})}
 document.querySelectorAll('.gallery-slide img,.v32-unit-image img').forEach(img=>{
   img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar imagem: '+(img.alt||'imagem da Chroma'));
   img.style.cursor='zoom-in';
   const show=()=>{const preview=dialog.querySelector('img');preview.src=img.currentSrc||img.src;preview.alt=img.alt;dialog.showModal()};
   img.addEventListener('click',show);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}});
 });
 // Copyable addresses on the units page; the original map links and address text are unchanged.
 let toastTimeout;
 const toast=document.createElement('div');toast.className='v33-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.append(toast);
 function notify(message){clearTimeout(toastTimeout);toast.textContent=message;toast.classList.add('on');toastTimeout=setTimeout(()=>toast.classList.remove('on'),2800)}
 document.querySelectorAll('.v3-unit').forEach(card=>{
  const address=card.querySelector(':scope > p');const link=card.querySelector('.v3-link');if(!address||!link)return;
  const copy=document.createElement('button');copy.type='button';copy.className='v33-copy-address';copy.textContent='Copiar endereço';copy.setAttribute('aria-label','Copiar endereço de '+(card.querySelector('h3')?.textContent||'unidade'));
  link.insertAdjacentElement('afterend',copy);
  copy.addEventListener('click',async()=>{
   const value=address.textContent.trim();let copied=false;
   try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);copied=true}}catch{}
   if(!copied){
    const area=document.createElement('textarea');area.value=value;area.style.cssText='position:fixed;opacity:0;pointer-events:none;top:-100px';document.body.append(area);area.select();
    try{copied=document.execCommand('copy')}catch{}area.remove();
   }
   notify(copied?'Endereço copiado para a área de transferência.':'Selecione o endereço acima para copiar.');
  });
 });
 // Scroll-triggered reveal only for below-the-fold elements and only when motion is allowed.
 if(!reduced&&'IntersectionObserver' in window){
  const items=[...document.querySelectorAll('.v3-section h2,.v3-feature-visual,.v3-card-grid article,.v3-unit,.v3-update-grid article,.v32-partner-cta .container')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('v33-visible');e.target.classList.remove('v33-before');observer.unobserve(e.target)}}),{threshold:.04,rootMargin:'0px 0px 60px 0px'});
  items.forEach((el,i)=>{if(el.getBoundingClientRect().top<window.innerHeight-20)return;el.classList.add('v33-reveal','v33-before');observer.observe(el)});
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
