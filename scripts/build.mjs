/** Build estático multipágina, sem dependências externas. Origem: src/. Saída: dist/. */
import {readFile, writeFile, mkdir, cp, rm, access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {CSS_MODULES} from '../src/styles/manifest.mjs';
import {PAGE_SLUGS, getPublishConfig, enhanceHtml, robotsText, sitemapText} from './site-metadata.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = PAGE_SLUGS;
const publishConfig = getPublishConfig();
const dist = path.join(root, 'dist');

const read = relative => readFile(path.join(root, relative), 'utf8');
const canAccess = async folder => {
  try {
    await access(folder);
    return true;
  } catch {
    return false;
  }
};

function buildHeader(template, filename) {
  const base = template.replaceAll(' aria-current="page"', '');
  return base.replace(/(<a\b[^>]*href="([^"]+)"[^>]*)(>)/g, (full, opening, href, close) => {
    const isLogo = opening.includes('logo-link');
    return href === filename && !isLogo
      ? `${opening} aria-current="page"${close}`
      : full;
  });
}

/** Remove apenas quebras de linha acrescentadas entre tags na formatação do fonte. */
export function compactHtmlSource(html) {
  return html.replace(/>\n[ \t]*</g, '><');
}

await rm(dist, {recursive: true, force: true});
await mkdir(dist, {recursive: true});

const [headerTemplate, footer] = await Promise.all([
  read('src/partials/header.html'),
  read('src/partials/footer.html'),
]);

for (const slug of pages) {
  const filename = `${slug}.html`;
  const source = await read(`src/pages/${filename}`);
  if (!source.includes('<!-- CHROMA_HEADER -->') || !source.includes('<!-- CHROMA_FOOTER -->')) {
    throw new Error(`Placeholder ausente: ${filename}`);
  }

  const html = enhanceHtml(compactHtmlSource(source)
    .replace('<!-- CHROMA_HEADER -->', buildHeader(headerTemplate, filename))
    .replace('<!-- CHROMA_FOOTER -->', footer), slug, publishConfig);
  await writeFile(path.join(dist, filename), html, 'utf8');
}

const brandAssets = (await canAccess(path.join(root, 'assets')))
  ? path.join(root, 'assets')
  : path.join(root, 'public/assets');
const contentAssets = (await canAccess(path.join(root, 'conteudo')))
  ? path.join(root, 'conteudo')
  : path.join(root, 'public/conteudo');

await Promise.all([
  cp(brandAssets, path.join(dist, 'assets'), {recursive: true}),
  cp(contentAssets, path.join(dist, 'conteudo'), {recursive: true}),
]);

const cssSource = (await Promise.all(
  CSS_MODULES.map(moduleName => read(`src/styles/modules/${moduleName}`)),
)).join('');

const compiledCss = cssSource.replace(/url\((['"]?)assets\//g, 'url($1../');
await mkdir(path.join(dist, 'assets', 'css'), {recursive: true});
await writeFile(path.join(dist, 'assets', 'css', 'site.css'), compiledCss, 'utf8');

await writeFile(path.join(dist, 'robots.txt'), robotsText(publishConfig), 'utf8');
const sitemap = sitemapText(publishConfig);
if (sitemap) await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');

await cp(path.join(root, 'src/scripts'), path.join(dist, 'assets/js'), {recursive: true});
await cp(path.join(root, 'src/data'), path.join(dist, 'assets/data'), {recursive: true});

console.log(`Build Chroma: ${pages.length} páginas, ${CSS_MODULES.length} módulos CSS concatenados, JavaScript modular, SEO: ${publishConfig.public ? 'público autorizado' : 'prévia sem indexação'}. Saída: dist/`);
