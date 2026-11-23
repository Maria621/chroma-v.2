import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {dimensionsFromBuffer} from '../scripts/image-dimensions.mjs';

const read = file => readFile(new URL('../' + file, import.meta.url), 'utf8');

test('parser lê PNG e variantes WebP usando cabeçalhos originais', () => {
  const png = Buffer.alloc(24);
  Buffer.from([137,80,78,71,13,10,26,10]).copy(png);
  png.write('IHDR',12);
  png.writeUInt32BE(1200,16); png.writeUInt32BE(630,20);
  assert.deepEqual(dimensionsFromBuffer(png), {width:1200,height:630});

  const vp8x = Buffer.alloc(30);
  vp8x.write('RIFF',0);vp8x.write('WEBP',8);vp8x.write('VP8X',12);
  vp8x.writeUIntLE(899,24,3);vp8x.writeUIntLE(499,27,3);
  assert.deepEqual(dimensionsFromBuffer(vp8x),{width:900,height:500});

  const vp8 = Buffer.alloc(30);
  vp8.write('RIFF',0);vp8.write('WEBP',8);vp8.write('VP8 ',12);
  vp8.set([0x9d,0x01,0x2a],23);
  vp8.writeUInt16LE(640,26);vp8.writeUInt16LE(480,28);
  assert.deepEqual(dimensionsFromBuffer(vp8),{width:640,height:480});

  const vp8l = Buffer.alloc(30);
  vp8l.write('RIFF',0);vp8l.write('WEBP',8);vp8l.write('VP8L',12);
  vp8l[20]=0x2f;
  vp8l.writeUInt32LE((320-1)|((240-1)<<14),21);
  assert.deepEqual(dimensionsFromBuffer(vp8l),{width:320,height:240});
  assert.equal(dimensionsFromBuffer(Buffer.alloc(30)),null);
});

test('imagens locais carregam largura e altura intrínsecas sem alteração visual do CSS', async () => {
  for (const slug of ['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato']) {
    const html = await read('dist/' + slug + '.html');
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]);
    for (const tag of imgs) {
      if (!/src="assets\//.test(tag)) continue;
      const width = Number(tag.match(/\bwidth="(\d+)"/)?.[1]);
      const height = Number(tag.match(/\bheight="(\d+)"/)?.[1]);
      assert.ok(width > 0 && height > 0 && width < 32768 && height < 32768,
        slug + ': faltam dimensões reais na imagem ' + tag.slice(0,180));
    }
  }
});
