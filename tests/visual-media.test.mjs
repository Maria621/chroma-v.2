import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {CSS_MODULES} from '../src/styles/manifest.mjs';

const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const visual = 'src/styles/modules/08-visual-refinement.css';
const allPages = ['index', 'a-chroma', 'nosso-trabalho', 'projetos-e-parcerias', 'unidades', 'contato'];

test('a revisão visual acrescenta um módulo ordenado sem substituir o Design System', async () => {
  assert.equal(CSS_MODULES.at(-1), '08-visual-refinement.css');
  assert.equal(CSS_MODULES.at(-2), '07-design-system.css');
  const css = await read('dist/assets/css/site.css');
  const source = await read(visual);
  assert.ok(css.endsWith(source));
  assert.match(source, /Etapa 05: refinamento visual e mídia/);
});

test('hero principal limita a altura e preserva a imagem inteira em desktop e celular', async () => {
  const css = await read(visual);
  assert.match(css, /\.chroma-v33 \.v3-hero\s*\{[^}]*min-height:\s*clamp\(520px, 42vw, 600px\)/);
  assert.match(css, /\.chroma-v33 \.v3-home-hero \.v3-hero-photo\s*\{[^}]*object-fit:\s*contain/);
  assert.match(css, /@media \(max-width: 1000px\)/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 460px\)/);
  for (const page of ['index', 'nosso-trabalho', 'projetos-e-parcerias']) {
    const html = await read('dist/' + page + '.html');
    const hero = html.match(/<img\b[^>]*class="v3-hero-photo"[^>]*>/)?.[0];
    assert.ok(hero, 'Hero ausente: ' + page);
    assert.match(hero, /fetchpriority="high"/);
    assert.match(hero, /loading="eager"/);
    assert.match(hero, /decoding="async"/);
  }
});

test('fotografias ilustrativas, cards das unidades e campanhas priorizam conteúdo inteiro', async () => {
  const css = await read(visual);
  assert.match(css, /\.chroma-v33 \.v3-photo img\s*\{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.chroma-v33 \.v3-unit \.v32-unit-image\s*\{[^}]*aspect-ratio:\s*16 \/ 10/);
  assert.match(css, /\.chroma-v33 \.v32-unit-image \.media-zoom-button img\s*\{[^}]*object-fit:\s*contain/);
  assert.match(css, /\.chroma-v33 \.v3-update-grid \.v3-update-img\s*\{[^}]*aspect-ratio:\s*1896 \/ 829/);
  assert.match(css, /\.chroma-v33 \.v3-update-grid \.v3-update-img img,[\s\S]*?object-fit:\s*contain/);
  assert.match(css, /\.chroma-v33 \.v3-gallery-section \.gallery-tilt\s*\{[^}]*margin-left:\s*6px/);
});

test('imagens são decodificadas de forma assíncrona e a legenda ilustrativa permanece', async () => {
  for (const page of allPages) {
    const html = await read('dist/' + page + '.html');
    for (const image of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = image[0];
      if (tag.includes('chroma-logo-oficial.png')) continue;
      assert.match(tag, /decoding="async"/, 'Decoding indefinido: ' + page);
    }
  }
  const units = await read('dist/unidades.html');
  assert.match(units, /não é fotografia da unidade real/);
  const about = await read('dist/a-chroma.html');
  assert.match(about, /Imagem ilustrativa/);
});

test('rodapé continua compacto e reage a telas pequenas sem conteúdo duplicado', async () => {
  const css = await read(visual);
  assert.match(css, /\.chroma-v34 \.site-footer\.v34-footer \.v34-footer-main/);
  assert.match(css, /\.chroma-v34 \.site-footer\.v34-footer \.v34-footer-meta\s*\{[^}]*flex-wrap:\s*wrap/);
  assert.match(css, /flex-direction:\s*column/);
  for (const page of allPages) {
    const html = await read('dist/' + page + '.html');
    assert.equal((html.match(/<footer\b/g) || []).length, 1);
  }
});
