import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const dsPath = 'src/styles/modules/07-design-system.css';

function colorLuminance(hex) {
  assert.match(hex, /^#[0-9a-f]{6}$/i);
  const [r, g, b] = hex.slice(1).match(/.{2}/g).map(part => parseInt(part, 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return r * .2126 + g * .7152 + b * .0722;
}

function contrast(foreground, background) {
  const a = colorLuminance(foreground);
  const b = colorLuminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

function token(css, name) {
  const matches = [...css.matchAll(/--([a-z\d-]+)\s*:\s*([^;}\n]+)/gi)];
  return matches.find(entry => entry[1] === name)?.[2].trim();
}

test('todas as seis páginas usam apenas as famílias aprovadas e já carregadas', async () => {
  for (const slug of ['index', 'a-chroma', 'nosso-trabalho', 'projetos-e-parcerias', 'unidades', 'contato']) {
    const html = await read('dist/' + slug + '.html');
    assert.match(html, /fonts\.googleapis\.com\/css2\?family=Montserrat/);
    assert.match(html, /family=Poppins/);
    assert.equal((html.match(/fonts\.googleapis\.com\/css2\?/g) || []).length, 1);
  }
  const css = await read(dsPath);
  assert.equal(token(css, 'ds-font-display'), '"Montserrat", Arial, sans-serif');
  assert.equal(token(css, 'ds-font-body'), '"Poppins", Arial, sans-serif');
  assert.equal(token(css, 'font'), 'var(--ds-font-display)');
  assert.equal(token(css, 'body'), 'var(--ds-font-body)');
});

test('textos pequenos cumprem contraste WCAG AA nas superfícies utilizadas', async () => {
  const css = await read(dsPath);
  const muted = token(css, 'ds-muted-text');
  const secondaryBlue = token(css, 'ds-brand-deep');
  const surface = token(css, 'ds-surface');
  const soft = token(css, 'ds-surface-soft');
  assert.ok(contrast(muted, surface) >= 4.5, 'Texto secundário insuficiente em branco');
  assert.ok(contrast(muted, soft) >= 4.5, 'Texto secundário insuficiente no fundo suave');
  assert.ok(contrast(secondaryBlue, surface) >= 4.5, 'Azul institucional insuficiente');
  assert.match(css, /\.v3-whatsapp-form small/);
  assert.match(css, /\.v3-unit dt/);
  assert.match(css, /\.v3-story-meta/);
  assert.match(css, /\.v3-note/);
  assert.match(css, /\.v3-source/);
});

test('notas e fontes de informação não dependem mais de overrides important legados', async () => {
  const layout = await read('src/styles/modules/02-institutional-layout.css');
  const interactions = await read('src/styles/modules/04-interaction-system.css');
  const note = layout.match(/\.chroma-v3 \.v3-note\{([^}]*)\}/)?.[1];
  const source = layout.match(/\.chroma-v3 \.v3-source\{([^}]*)\}/)?.[1];
  const laterNote = interactions.match(/\.chroma-v33 \.v3-note\{([^}]*)\}/)?.[1];
  assert.ok(note && source && laterNote);
  for (const rule of [note, source, laterNote]) assert.doesNotMatch(rule, /!important/);
});

test('o Design System mantém alturas de toque e preserva titulares do hero', async () => {
  const css = await read(dsPath);
  assert.equal(token(css, 'ds-min-touch'), '44px');
  assert.ok(css.includes('.v3-whatsapp-form label'));
  assert.doesNotMatch(css, /\.v3-hero h1\s*\{/);
  assert.doesNotMatch(css, /\.gallery-tilt\s*\{/);
});
