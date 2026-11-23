/** Metadados reais de imagens: usa apenas Node.js, sem ferramentas de edição ou compressão. */
import {readFile} from 'node:fs/promises';
import path from 'node:path';

export function dimensionsFromBuffer(buffer) {
  if (!buffer || buffer.length < 24) return null;
  // PNG IHDR
  if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) &&
      buffer.toString('ascii', 12, 16) === 'IHDR') {
    const width = buffer.readUInt32BE(16), height = buffer.readUInt32BE(20);
    return width > 0 && height > 0 ? {width, height} : null;
  }
  // WebP RIFF: VP8X (extended), VP8 (lossy) ou VP8L (lossless).
  if (buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP' && buffer.length >= 30) {
    const type = buffer.toString('ascii', 12, 16);
    let width, height;
    if (type === 'VP8X') {
      width = buffer.readUIntLE(24, 3) + 1;
      height = buffer.readUIntLE(27, 3) + 1;
    } else if (type === 'VP8 ' && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
      width = buffer.readUInt16LE(26) & 0x3fff;
      height = buffer.readUInt16LE(28) & 0x3fff;
    } else if (type === 'VP8L' && buffer[20] === 0x2f) {
      const dimensions = buffer.readUInt32LE(21);
      width = (dimensions & 0x3fff) + 1;
      height = ((dimensions >>> 14) & 0x3fff) + 1;
    }
    return width > 0 && height > 0 ? {width, height} : null;
  }
  // JPEG: procura um dos marcadores Start of Frame.
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    const frames = new Set([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]);
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue; }
      const marker = buffer[offset + 1];
      if (marker === 0xd9 || marker === 0xda) break;
      if (marker === 0xff || marker === 0x00 || (marker >= 0xd0 && marker <= 0xd7)) {
        offset += 2;
        continue;
      }
      const size = buffer.readUInt16BE(offset + 2);
      if (size < 2 || offset + 2 + size > buffer.length) break;
      if (frames.has(marker)) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return width > 0 && height > 0 ? {width, height} : null;
      }
      offset += 2 + size;
    }
  }
  return null;
}

const safeAsset = /^assets\/[a-z0-9/_-]+\.(?:webp|png|jpe?g)$/i;

/** Injeta largura/altura reais apenas quando não existem; preserva a marcação fonte. */
export async function addIntrinsicImageSizes(html, assetsDirectory) {
  const tags = [...html.matchAll(/<img\b[^>]*>/gi)];
  const cache = new Map();
  let output = html;
  for (let i = tags.length - 1; i >= 0; i--) {
    const {0: tag, index: start} = tags[i];
    if (/\bwidth\s*=/.test(tag) || /\bheight\s*=/.test(tag)) continue;
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src || !safeAsset.test(src) || src.includes('..')) continue;

    const rel = src.slice('assets/'.length);
    if (!cache.has(rel)) {
      cache.set(rel, readFile(path.join(assetsDirectory, rel))
        .then(dimensionsFromBuffer)
        .catch(() => null));
    }
    const dims = await cache.get(rel);
    if (!dims) continue;
    const suffix = tag.endsWith('/>') ? '/>' : '>';
    const updated = tag.slice(0, -suffix.length) +
      ' width="' + dims.width + '" height="' + dims.height + '"' + suffix;
    output = output.slice(0, start) + updated + output.slice(start + tag.length);
  }
  return output;
}
