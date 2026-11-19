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
    {date:'2016 · O INÍCIO',title:'Uma ideia guiada pelo potencial das pessoas.',description:'O primeiro capítulo desta narrativa nasce de uma convicção: o conhecimento pode transformar expectativas em possibilidades. O propósito é construir uma escola em que cada aluno tenha espaço para crescer.',graphic:'UM NOVO<br>COMEÇO',year:'2016'},
    {date:'2018 · NOVOS CAMINHOS',title:'O conhecimento começa a ganhar novas formas.',description:'A proposta educacional amplia seu olhar para tecnologia, idiomas e desenvolvimento de competências, buscando aproximar estudo, curiosidade e autonomia.',graphic:'EXPANDIR<br>HORIZONTES',year:'2018'},
    {date:'2020 · CAPACIDADE DE REINVENTAR',title:'Aprender também é adaptar-se.',description:'Em uma década marcada por mudanças na educação e na tecnologia, a capacidade de buscar novos caminhos reforça a importância de experiências flexíveis e de acompanhamento.',graphic:'SEGUIR<br>APRENDENDO',year:'2020'},
    {date:'2022 · APRENDIZAGEM ATIVA',title:'Da explicação à prática em cada etapa.',description:'O aluno estuda conteúdos, experimenta ferramentas, fixa conhecimentos e, com o professor, coloca as ideias em ação na lousa e no computador.',graphic:'PRÁTICA<br>E EVOLUÇÃO',year:'2022'},
    {date:'2024 · CONEXÕES COM A COMUNIDADE',title:'A educação faz mais quando aproxima pessoas.',description:'A narrativa da Chroma passa a destacar o reconhecimento ao esforço, o trabalho colaborativo e as oportunidades de conexão com escolas e famílias.',graphic:'CONEXÕES<br>QUE IMPORTAM',year:'2024'},
    {date:'2026 · UMA DÉCADA EM CONSTRUÇÃO',title:'Novas iniciativas, o mesmo compromisso.',description:'Projetos como o Aluno Nota 10, a Nexus Corp e as atividades aplicadas ajudam a mostrar uma proposta que incentiva o protagonismo, a participação e a criação de novas possibilidades.',graphic:'PRÓXIMOS<br>CAPÍTULOS',year:'2026'}
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
      panel.querySelector('.tm-counter').textContent=String(current+1).padStart(2,'0')+' / '+String(timelineData.length).padStart(2,'0');
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

/* V3: contato por WhatsApp, sem coleta ou armazenamento em servidor. */
(()=>{const form=document.getElementById('chromaContactForm');if(!form)return;
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;
const el=id=>document.getElementById(id);
const number=el('contactUnit').value==='sorocaba'?'5515974035244':'5511947108867';
const msg=['Olá, equipe Chroma!','Meu nome: '+el('contactName').value.trim(),'Unidade: '+el('contactUnit').selectedOptions[0].textContent,'Assunto: '+el('contactSubject').value,'Mensagem: '+el('contactMessage').value.trim()].join('\n');
const href='https://wa.me/'+number+'?text='+encodeURIComponent(msg);
window.open(href,'_blank','noopener,noreferrer');
});})();

/* V3.2 — ampliar campanhas sem distorcer nem redesenhar as artes oficiais. */
(()=>{
 const images=[...document.querySelectorAll('.v3-update-img img,.v32-seasonal-banner img')];
 if(!images.length)return;
 const modal=document.createElement('dialog');modal.className='v32-art-dialog';modal.setAttribute('aria-label','Visualização ampliada da arte oficial');
 modal.innerHTML='<button class="v32-art-close" type="button" aria-label="Fechar imagem ampliada">×</button><img alt="" src="">';document.body.append(modal);
 const close=()=>modal.close();modal.querySelector('button').addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 images.forEach(img=>{img.style.cursor='zoom-in';img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Ampliar arte: '+img.alt);const open=()=>{let m=modal.querySelector('img');m.src=img.src;m.alt=img.alt;modal.showModal()};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
})();
