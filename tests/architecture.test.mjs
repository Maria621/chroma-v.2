import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CSS_MODULES} from '../src/styles/manifest.mjs';

const read = relative => readFile(new URL('../' + relative, import.meta.url), 'utf8');
const baseline = {length: 83984, fnv1a32: '1207b97a'};

/** FNV-1a over UTF-16 code units; stable across Node versions for this source. */
function fnv1a32(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

test('cascata mantém a mesma ordem e os mesmos bytes da V3.6 aprovada', async () => {
  assert.deepEqual(CSS_MODULES, [
    '01-foundation.css',
    '02-institutional-layout.css',
    '03-page-components.css',
    '04-interaction-system.css',
    '05-quality-accessibility.css',
    '06-reviewed-fixes.css',
  ]);
  const fragments = await Promise.all(
    CSS_MODULES.map(file => read('src/styles/modules/' + file))
  );
  assert.ok(fragments.every(Boolean));
  const source = fragments.join('');
  assert.equal(source.length, baseline.length);
  assert.equal(fnv1a32(source), baseline.fnv1a32);
  const output = await read('dist/assets/css/site.css');
  assert.equal(output, source.replace(/url\((['"]?)assets\//g, 'url($1../'));
});

test('páginas continuam geradas em 6 arquivos independentes', async () => {
  for (const slug of ['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato']) {
    const source = await read('src/pages/' + slug + '.html');
    const html = await read('dist/' + slug + '.html');
    assert.match(source, /<!-- CHROMA_HEADER -->/);
    assert.match(source, /<!-- CHROMA_FOOTER -->/);
    assert.ok(source.split('\n').length > 50, 'HTML fonte deve ser legível: ' + slug);
    assert.match(html, /<main id="main">/);
  }
});
