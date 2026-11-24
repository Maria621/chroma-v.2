import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('indicadores da galeria conservam a forma editorial e alvo de toque', async () => {
  const css = await readFile(new URL('../dist/assets/css/site.css', import.meta.url), 'utf8');
  assert.match(css, /\.v33-gallery-dots button\{min-width:44px;min-height:44px/);
  assert.match(css, /\.v33-gallery-dots button,\s*\.v33-gallery-dots button\.is-active\s*\{\s*background: transparent;\s*border: 0;/);
  assert.match(css, /\.v33-gallery-dots button::after\s*\{\s*width: 27px;\s*height: 9px;/);
  assert.match(css, /\.v33-gallery-dots button\.is-active::after\s*\{\s*width: 52px;\s*border-color: #ffdd28;\s*background: #ffdd28;/);
});
