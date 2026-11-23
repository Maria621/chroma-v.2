import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, access} from 'node:fs/promises';
import {PAGE_SLUGS, getPublishConfig, enhanceHtml, robotsText, sitemapText} from '../scripts/site-metadata.mjs';

const read = p => readFile(new URL('../' + p, import.meta.url), 'utf8');
const sample = '<!doctype html><html lang="pt-BR"><head><meta content="noindex,nofollow" name="robots"/></head><body><main></main></body></html>';

test('o build de prévia preserva noindex em todas as páginas', async () => {
  for (const slug of PAGE_SLUGS) {
    const page = await read('dist/' + slug + '.html');
    assert.match(page, /<meta content="noindex,nofollow" name="robots"\/>/);
    assert.match(page, /<meta content="pt_BR" property="og:locale"\/>/);
    assert.match(page, /<meta content="Instituto Chroma" property="og:site_name"\/>/);
    assert.match(page, /<meta content="summary" name="twitter:card"\/>/);
    assert.doesNotMatch(page, /rel="canonical"/);
    assert.doesNotMatch(page, /<meta content="index,follow/);
  }
  assert.match(await read('dist/robots.txt'), /Disallow: \/\n/);
  await assert.rejects(access(new URL('../dist/sitemap.xml', import.meta.url)));
});

test('não é possível indexar uma prévia ou uma URL temporária', () => {
  assert.deepEqual(getPublishConfig({}), {public: false, origin: null});
  assert.throws(() => getPublishConfig({CHROMA_PUBLISH: 'true', VERCEL_ENV: 'preview', CHROMA_PUBLIC_URL: 'https://instituto.example'}));
  for (const url of ['', 'http://instituto.example', 'https://abc.vercel.app', 'https://localhost', 'https://instituto.example/pagina', 'https://instituto.example?x=1', 'https://user:password@instituto.example']) {
    assert.throws(() => getPublishConfig({CHROMA_PUBLISH: 'true', CHROMA_PUBLIC_URL: url}));
  }
});

test('só o domínio HTTPS autorizado recebe canonical, sitemap e organização estruturada', () => {
  const config = getPublishConfig({CHROMA_PUBLISH: 'true', CHROMA_PUBLIC_URL: 'https://instituto.example/'});
  const html = enhanceHtml(sample, 'index', config);
  assert.match(html, /<meta content="index,follow,max-image-preview:large"/);
  assert.match(html, /href="https:\/\/instituto\.example\/" rel="canonical"/);
  assert.match(html, /"@type":"EducationalOrganization"/);
  assert.match(html, /property="og:image"/);
  const internal = enhanceHtml(sample, 'contato', config);
  assert.match(internal, /instituto\.example\/contato\.html/);
  assert.doesNotMatch(internal, /EducationalOrganization/);
  const sitemap = sitemapText(config);
  assert.equal((sitemap.match(/<url>/g) || []).length, PAGE_SLUGS.length);
  assert.match(robotsText(config), /Sitemap: https:\/\/instituto\.example\/sitemap\.xml/);
  assert.equal(sitemapText(getPublishConfig({})), null);
  assert.throws(() => enhanceHtml(sample, '../secret', config));
});

test('regras de cabeçalhos essenciais permanecem no Vercel', async () => {
  const config = JSON.parse(await read('vercel.json'));
  const names = new Set(config.headers.flatMap(item => item.headers.map(header => header.key)));
  assert.ok(names.has('X-Content-Type-Options'));
  assert.ok(names.has('Referrer-Policy'));
  assert.ok(names.has('X-Frame-Options'));
  assert.ok(names.has('Permissions-Policy'));
});
