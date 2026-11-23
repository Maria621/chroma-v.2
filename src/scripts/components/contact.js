/** Canais do site V3.5; revalidação dos números ainda pendente. */
export const WHATSAPP_BY_UNIT = Object.freeze({
  diadema: '5511947108867',
  itavuvu: '5515974035244',
  pannunzio: '5515974035244',
});

/** Unidades sem número validado nunca são encaminhadas a outra unidade por padrão. */
export function buildWhatsAppUrl(unit, fields) {
  if (!Object.hasOwn(WHATSAPP_BY_UNIT, unit)) return null;

  const name = String(fields.name ?? '').trim();
  const subject = String(fields.subject ?? '').trim();
  const message = String(fields.message ?? '').trim();
  const unitLabel = String(fields.unitLabel ?? '').trim();
  if (!name || !message || !unitLabel || !subject) return null;

  const lines = [
    'Olá, equipe Chroma!',
    `Meu nome: ${name}`,
    `Unidade de interesse: ${unitLabel}`,
    `Assunto: ${subject}`,
    `Mensagem: ${message}`,
  ];
  return `https://wa.me/${WHATSAPP_BY_UNIT[unit]}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function initContactForm() {
  const form = document.getElementById('chromaContactForm');
  if (!form) return;
  const nameInput = form.querySelector('#contactName');
  const messageInput = form.querySelector('#contactMessage');
  const unitSelect = form.querySelector('#contactUnit');
  const subjectSelect = form.querySelector('#contactSubject');
  const fallback = document.getElementById('whatsappFallback');
  const status = document.getElementById('contactStatus');
  if (!nameInput || !messageInput || !unitSelect || !subjectSelect) return;
  // Evita envio GET do formulário quando o script não está disponível.
  const submitButton = form.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = false;

  const clearFeedback = () => {
    if (fallback) fallback.hidden = true;
    if (status) { status.hidden = true; status.textContent = ''; }
  };

  const validateRequiredText = input => {
    input.setCustomValidity(input.value.trim() ? '' : 'Preencha este campo com um texto válido.');
    return input.checkValidity();
  };

  nameInput.addEventListener('input', () => { nameInput.setCustomValidity(''); clearFeedback(); });
  messageInput.addEventListener('input', () => { messageInput.setCustomValidity(''); clearFeedback(); });
  unitSelect.addEventListener('change', clearFeedback);
  subjectSelect.addEventListener('change', clearFeedback);

  form.addEventListener('submit', event => {
    event.preventDefault();
    validateRequiredText(nameInput);
    validateRequiredText(messageInput);
    if (!form.reportValidity()) return;

    const href = buildWhatsAppUrl(unitSelect.value, {
      name: nameInput.value,
      subject: subjectSelect.value,
      message: messageInput.value,
      unitLabel: unitSelect.selectedOptions[0]?.textContent ?? '',
    });

    if (!href) {
      if (status) {
        status.textContent = 'Não há um canal de WhatsApp confirmado para esta unidade.';
        status.hidden = false;
      }
      return;
    }

    // Com "noopener", o retorno de window.open não indica com segurança se a aba abriu.
    // O link de recuperação permanece disponível para quem estiver com pop-ups bloqueados.
    if (fallback) { fallback.href = href; fallback.hidden = false; }
    if (status) {
      status.textContent = 'Mensagem preparada. Confirme o envio no WhatsApp. Se a nova aba não abrir, use o link abaixo.';
      status.hidden = false;
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  });
}
