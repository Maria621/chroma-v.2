export async function initNews() {
  if(location.protocol==='file:')return;
  try{
    const r=await fetch('conteudo/novidades.json',{cache:'no-store'});
    if(!r.ok)return;
    const data=await r.json();
    if(!Array.isArray(data.campanhas))return;
    const safeImage=url=>typeof url==='string'&&/^assets\/[a-z0-9._-]+\.(webp|jpg|jpeg|png)$/i.test(url);
    for(const item of data.campanhas){
      if(!item||!['principal','lateral-1','lateral-2'].includes(item.slot))continue;
      const slot=document.querySelector(`[data-campaign-slot="${item.slot}"]`);
      if(!slot)continue;
      const pairs=[[slot.querySelector('h3'),item.titulo],[slot.querySelector('.news-type'),item.tipo],[slot.querySelector('h3+p'),item.resumo]];
      pairs.forEach(([target,value])=>{if(target&&typeof value==='string')target.textContent=value});
      const image=slot.querySelector('img');if(image&&safeImage(item.imagem)){image.src=item.imagem;if(typeof item.alt==='string')image.alt=item.alt}
    }
  }catch{ /* O conteúdo estático aprovado permanece sempre legível. */ }
}
