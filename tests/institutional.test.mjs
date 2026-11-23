import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = relative => readFile(new URL('../'+relative, import.meta.url), 'utf8');

test('linha do tempo preserva somente os quatro marcos confirmados', async () => {
  const {timelineData} = await import('../src/data/timeline.js');
  assert.deepEqual(timelineData.map(item => item.year), ['2016','2019','2022','2026']);
  assert.equal(timelineData.length, 4);
  assert.match(timelineData[0].description, /Adriana/);
  assert.match(timelineData[1].description, /Itavuvu/);
  assert.match(timelineData[2].description, /Pannunzio/);
  assert.match(timelineData[3].description, /Valinhos/);
});

test('página histórica apresenta quatro abas e contador alinhado', async () => {
  const html = await read('dist/a-chroma.html');
  const axis = html.match(/<div[^>]+class="timeline-axis"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(axis);
  assert.deepEqual([...axis.matchAll(/<b>(\d{4})<\/b>/g)].map(m => m[1]), ['2016','2019','2022','2026']);
  assert.equal((axis.match(/role="tab"/g) || []).length, 4);
  assert.match(html, /class="tm-counter">01 \/ 04/);
  assert.doesNotMatch(axis, /2018|2020|2024/);
});

test('nome institucional e Valinhos aparecem sem dados inventados', async () => {
  for (const slug of ['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato']) {
    const html = await read('dist/'+slug+'.html');
    assert.match(html, /Instituto Chroma/);
    assert.match(html, /© 2026 Instituto Chroma/);
    assert.match(html, /name="robots"/);
  }
  const units = await read('dist/unidades.html');
  assert.match(units, /Sorocaba · Pannunzio/);
  assert.match(units, /04 \/ VALINHOS · SP · 2026/);
  assert.match(units, /contato específico desta unidade ainda aguardam confirmação/);
  const contact = await read('dist/contato.html');
  assert.match(contact, /atendimento específico da unidade Valinhos ainda está em confirmação/);
});
