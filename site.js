'use strict';
(()=>{
  const menu=document.querySelector('.menu-toggle');
  const mobile=document.querySelector('.mobile-nav');
  if(menu&&mobile){
    function close(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');mobile.hidden=true;}
    menu.addEventListener('click',()=>{
      const open=menu.getAttribute('aria-expanded')==='true';
      menu.setAttribute('aria-expanded',String(!open));
      menu.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');
      mobile.hidden=open;
    });
    mobile.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    window.addEventListener('resize',()=>{if(window.innerWidth>1000)close()});
  }
  const slideButtons=[...document.querySelectorAll('.gallery-slide')];
  const gallery=document.querySelector('.angled-gallery');
  if(gallery&&slideButtons.length){
    let index=0;
    const count=document.querySelector('.gallery-count');
    const show=(n)=>{
      index=(n+slideButtons.length)%slideButtons.length;
      slideButtons.forEach((slide,i)=>{
        slide.classList.toggle('is-active',i===index);
        slide.setAttribute('aria-hidden',String(i!==index));
        slide.querySelectorAll('img').forEach(img=>img.tabIndex=i===index?0:-1);
      });
      if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+String(slideButtons.length).padStart(2,'0');
    };
    document.querySelector('.gallery-prev')?.addEventListener('click',()=>show(index-1));
    document.querySelector('.gallery-next')?.addEventListener('click',()=>show(index+1));
    gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(index+1);if(e.key==='ArrowLeft')show(index-1)});
    show(0);
  }
  const timelineData=[
    {date:'SETEMBRO / 2026',title:'Empreender é também aprender.',description:'Um projeto de empresa desenvolvido em equipe convida os estudantes a pensar em setores, responsabilidades e a aplicação de conhecimentos na prática.',graphic:'IDEIAS<br>QUE SE<br>REALIZAM',year:'2026.'},
    {date:'OUTUBRO / 2026',title:'Projetos digitais ganham forma.',description:'Atividades práticas de programação e games envolveram a criação de sites com HTML, CSS e JavaScript e experiências no Roblox Studio.',graphic:'CRIAR.<br>TESTAR.<br>EVOLUIR.',year:'2026.'},
    {date:'NOVEMBRO / 2026',title:'Do texto à apresentação profissional.',description:'Uma atividade prática de Word reuniu produção de texto, construção de conclusões próprias e preparação para a etapa de formatação.',graphic:'ESCREVER.<br>FORMATAR.<br>COMPARTILHAR.',year:'2026.'},
    {date:'NOVEMBRO / 2026',title:'Participar também é conquistar.',description:'A campanha Presença Premiada destaca frequência, compromisso e participação dos estudantes no cotidiano escolar.',img:'assets/banner-presenca-premiada.webp',alt:'Cartaz oficial da campanha Presença Premiada'}
  ];
  const timeline=document.querySelector('.timeline-widget');
  if(timeline){
    const tabs=[...timeline.querySelectorAll('[role="tab"]')];
    const panel=timeline.querySelector('#tm-panel');
    let current=0;
    const render=(i,focus=false)=>{
      current=(i+timelineData.length)%timelineData.length;
      let d=timelineData[current];
      tabs.forEach((tab,k)=>{tab.setAttribute('aria-selected',String(k===current));tab.tabIndex=k===current?0:-1});
      panel.querySelector('.timeline-date').textContent=d.date;
      panel.querySelector('h3').textContent=d.title;
      panel.querySelector('.timeline-content p').textContent=d.description;
      panel.querySelector('.tm-counter').textContent=String(current+1).padStart(2,'0')+' / 04';
      const visual=panel.querySelector('.timeline-visual');
      visual.replaceChildren();
      const graphic=document.createElement('div');
      graphic.className='timeline-graphic'+(d.img?' poster':'');
      if(d.img){let img=document.createElement('img');img.src=d.img;img.alt=d.alt;img.loading='lazy';graphic.append(img)}
      else{let span=document.createElement('span');span.innerHTML=d.graphic;let strong=document.createElement('strong');strong.textContent=d.year;graphic.append(span,strong)}
      visual.append(graphic);
      if(focus)tabs[current].focus();
    };
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',()=>render(i));
      tab.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();render(i-1,true)}if(e.key==='ArrowRight'){e.preventDefault();render(i+1,true)}if(e.key==='Home'){e.preventDefault();render(0,true)}if(e.key==='End'){e.preventDefault();render(timelineData.length-1,true)}});
    });
    panel.querySelector('.tm-prev').addEventListener('click',()=>render(current-1));
    panel.querySelector('.tm-next').addEventListener('click',()=>render(current+1));
    render(0);
  }
  // progressive enhancement without hiding essential content when JavaScript is disabled
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&'IntersectionObserver' in window){
    let targets=document.querySelectorAll('.pillar,.experience-tile,.project-rows article,.unit-item');
    let observer=new IntersectionObserver((entries)=>{
      for(let entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    },{threshold:.04});
    targets.forEach(el=>{el.classList.add('reveal');observer.observe(el)});
  }
})();

/* V2: optional hosted-site news registry. Static HTML remains legible without JS/offline. */
(()=>{
  if(!window.fetch || location.protocol==='file:') return;
  fetch('conteudo/novidades.json',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw Error('News data unavailable');return r.json()})
    .then(data=>{
      if(!Array.isArray(data.campanhas))return;
      const safeImage=(url)=>typeof url==='string' && /^assets\/[a-z0-9._-]+\.(?:webp|jpg|jpeg|png)$/i.test(url);
      for(const item of data.campanhas){
        if(!item || !['principal','lateral-1','lateral-2'].includes(item.slot))continue;
        const slot=document.querySelector('[data-campaign-slot="'+item.slot+'"]');
        if(!slot)continue;
        const title=slot.querySelector('h3');
        const type=slot.querySelector('.news-type');
        const desc=slot.querySelector('h3+p');
        const img=slot.querySelector('img');
        if(title&&typeof item.titulo==='string')title.textContent=item.titulo;
        if(type&&typeof item.tipo==='string')type.textContent=item.tipo;
        if(desc&&typeof item.resumo==='string')desc.textContent=item.resumo;
        if(img&&safeImage(item.imagem)){img.src=item.imagem;if(typeof item.alt==='string')img.alt=item.alt}
      }
    }).catch(()=>{/* Static content is the intentional fallback. */});
})();
