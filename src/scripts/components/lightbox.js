/** Ampliação com botão semântico, diálogo modal e foco restaurado. */
export function initLightbox() {
  const buttons=[...document.querySelectorAll('.media-zoom-button')];
  if(!buttons.length || typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');
  dialog.className='v32-art-dialog';
  dialog.setAttribute('aria-label','Imagem ampliada');
  dialog.setAttribute('aria-modal','true');
  const close=document.createElement('button'); close.type='button'; close.className='v32-art-close';
  close.textContent='×';close.setAttribute('aria-label','Fechar imagem ampliada');
  const preview=document.createElement('img');preview.alt='';
  dialog.append(close,preview);document.body.append(dialog);
  let source=null;
  const finish=()=>{ if(dialog.open)dialog.close(); };
  close.addEventListener('click',finish);
  dialog.addEventListener('click',e=>{if(e.target===dialog)finish()});
  dialog.addEventListener('close',()=>{preview.removeAttribute('src');source?.focus();source=null;});
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const image=button.querySelector('img');if(!image)return;
    source=button;preview.src=image.currentSrc||image.src;preview.alt=image.alt||'Imagem ampliada';
    dialog.showModal();close.focus();
  }));
}
