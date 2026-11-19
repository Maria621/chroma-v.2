export function initContactForm() {
  const form=document.getElementById('chromaContactForm');if(!form)return;
  form.addEventListener('submit', e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const find=id=>document.getElementById(id);
    const unit=find('contactUnit');
    const phone=unit.value==='sorocaba'?'5515974035244':'5511947108867';
    const lines=['Olá, equipe Chroma!',`Meu nome: ${find('contactName').value.trim()}`,`Unidade: ${unit.selectedOptions[0].textContent}`,`Assunto: ${find('contactSubject').value}`,`Mensagem: ${find('contactMessage').value.trim()}`];
    const href=`https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
    // A mensagem é apenas preparada; o visitante confirma o envio no WhatsApp.
    const popup=window.open(href,'_blank','noopener,noreferrer');
    if(!popup){
      const feedback=document.getElementById('whatsappFallback');
      if(feedback){feedback.href=href;feedback.hidden=false;feedback.focus();}
    }
  });
}
