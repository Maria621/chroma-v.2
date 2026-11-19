import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CSS_MODULES} from '../src/styles/manifest.mjs';

const read = relative => readFile(new URL('../' + relative, import.meta.url), 'utf8');
// A Etapa 03 preservou estas quatro partes integralmente.
// As Etapas 04+ alteram somente os módulos documentados no changelog.
const preservedModuleHashes = Object.freeze({
  '01-foundation.css': 'd88cfe73',
  '03-page-components.css': '58b3ace6',
  '05-quality-accessibility.css': 'c6109c23',
  '06-reviewed-fixes.css': '6d6e1dae',
});

/** FNV-1a over UTF-16 code units; stable across Node versions for this source. */
function fnv1a32(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(hash ^ value.charCodeAt(i), 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

test('módulos da Etapa 03 preservados e cascata de produção idêntica ao manifesto', async () => {
  assert.deepEqual(CSS_MODULES, [
    '01-foundation.css',
    '02-institutional-layout.css',
    '03-page-components.css',
    '04-interaction-system.css',
    '05-quality-accessibility.css',
    '06-reviewed-fixes.css',
    '07-design-system.css',
  ]);

  const fragments = await Promise.all(CSS_MODULES.map(async file => ({
    file,
    content: await read('src/styles/modules/' + file),
  })));

  for (const {file, content} of fragments) {
    assert.ok(content, 'Módulo vazio: ' + file);
    if (Object.hasOwn(preservedModuleHashes, file)) {
      assert.equal(fnv1a32(content), preservedModuleHashes[file],
        'Parte histórica alterada fora do escopo: ' + file);
    }
  }

  const compiledSource = fragments.map(fragment => fragment.content).join('');
  const output = await read('dist/assets/css/site.css');
  assert.equal(output, compiledSource.replace(/url\((['"]?)assets\//g, 'url($1../'));
  assert.ok(output.endsWith(fragments.at(-1).content),
    'Design System precisa permanecer ao final da cascata');
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
