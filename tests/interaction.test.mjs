import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {WHATSAPP_BY_UNIT, buildWhatsAppUrl} from '../src/scripts/components/contact.js';

const read = relative => readFile(new URL('../' + relative, import.meta.url), 'utf8');
const fields = {
  name: ' Pessoa QA ',
  subject: 'Conhecer a escola',
  message: ' Quero saber mais. ',
  unitLabel: 'Sorocaba · Pannunzio',
};

test('roteamento usa os números legados corretos, sem fallback automático', () => {
  assert.deepEqual(Object.keys(WHATSAPP_BY_UNIT).sort(), ['diadema','itavuvu','pannunzio']);
  assert.equal(new URL(buildWhatsAppUrl('diadema', fields)).pathname, '/5511947108867');
  assert.equal(new URL(buildWhatsAppUrl('itavuvu', fields)).pathname, '/5515974035244');
  assert.equal(new URL(buildWhatsAppUrl('pannunzio', fields)).pathname, '/5515974035244');
  assert.equal(buildWhatsAppUrl('valinhos', fields), null);
  assert.equal(buildWhatsAppUrl('inexistente', fields), null);
});

test('mensagem preparada identifica unidade e descarta campos apenas com espaços', () => {
  const url = buildWhatsAppUrl('pannunzio', fields);
  const text = new URL(url).searchParams.get('text');
  assert.match(text, /Meu nome: Pessoa QA/);
  assert.match(text, /Unidade de interesse: Sorocaba · Pannunzio/);
  assert.match(text, /Mensagem: Quero saber mais\./);
  assert.equal(buildWhatsAppUrl('diadema', {...fields, name:'  '}), null);
  assert.equal(buildWhatsAppUrl('diadema', {...fields, message:'\t '}), null);
});

test('formulário oferece Pannunzio e não roteia Valinhos sem confirmação', async () => {
  const contact = await read('dist/contato.html');
  assert.match(contact, /value="diadema"/);
  assert.match(contact, /value="itavuvu"/);
  assert.match(contact, /value="pannunzio"/);
  assert.match(contact, /<option value="valinhos" disabled>/);
  assert.match(contact, /id="contactStatus"/);
  assert.match(contact, /type="submit" disabled/);
  assert.match(contact, /id="whatsappFallback"/);
});

test('menu, timeline e âncoras têm os mecanismos de acessibilidade previstos', async () => {
  const navigation = await read('dist/assets/js/components/navigation.js');
  const timeline = await read('dist/assets/js/components/timeline.js');
  const css = await read('dist/assets/css/site.css');
  assert.match(navigation, /element\.inert = open/);
  assert.match(navigation, /setOpen\(false, true\)/);
  assert.match(timeline, /aria-labelledby/);
  assert.match(timeline, /timeline-tab-/);
  assert.match(css, /scroll-padding-top: 108px/);
});
