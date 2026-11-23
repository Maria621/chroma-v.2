export function initUnitActions() {
  const cards=[...document.querySelectorAll('.v3-unit')];
  if(!cards.length)return;
  const status=document.createElement('div');
  status.className='v33-toast';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  document.body.append(status);
  let timeout;
  const notify=(message)=>{clearTimeout(timeout);status.textContent=message;status.classList.add('on');timeout=setTimeout(()=>status.classList.remove('on'),2700);};
  cards.forEach(card=>{
    const address=card.querySelector(':scope > p');
    const map=card.querySelector('.v3-link');
    if(!address||!map)return;
    const button=document.createElement('button');
    button.type='button';button.className='v33-copy-address';button.textContent='Copiar endereço';
    button.setAttribute('aria-label','Copiar endereço de '+(card.querySelector('h3')?.textContent||'unidade'));
    map.insertAdjacentElement('afterend',button);
    button.addEventListener('click',async()=>{
      const text=address.textContent.trim();let copied=false;
      try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch{}
      if(!copied){
        const priorFocus=document.activeElement;
        const textarea=document.createElement('textarea');textarea.value=text;textarea.style.cssText='position:fixed;opacity:0;top:-100px';document.body.append(textarea);textarea.focus();textarea.select();
        try{copied=document.execCommand('copy')}catch{}
        textarea.remove();
        if(priorFocus?.isConnected)priorFocus.focus();
      }
      notify(copied?'Endereço copiado.':'Não foi possível copiar. Selecione o endereço exibido no cartão.');
    });
  });
}
