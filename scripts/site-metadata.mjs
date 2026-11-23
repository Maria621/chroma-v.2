/**
 * Metadados institucionais. Prévia permanece fora de indexação.
 * Publicação orgânica exige autorização explícita e domínio oficial confirmado.
 */
export const PAGE_SLUGS = Object.freeze([
  'index',
  'a-chroma',
  'nosso-trabalho',
  'projetos-e-parcerias',
  'unidades',
  'contato',
]);

export function getPublishConfig(env = process.env) {
  const requested = env.CHROMA_PUBLISH === 'true';
  if (!requested) return Object.freeze({public: false, origin: null});
  if (env.VERCEL_ENV === 'preview') {
    throw new Error('Não é permitido ativar indexação em um deployment de prévia.');
  }

  const candidate = String(env.CHROMA_PUBLIC_URL || '').trim();
  let url;
  try { url = new URL(candidate); }
  catch { throw new Error('CHROMA_PUBLIC_URL precisa conter uma URL HTTPS oficial.'); }

  const invalid = url.protocol !== 'https:' ||
    !url.hostname || url.username || url.password ||
    (url.pathname !== '/' && url.pathname !== '') ||
    url.search || url.hash ||
    url.hostname === 'localhost' ||
    url.hostname.endsWith('.vercel.app');
  if (invalid) throw new Error('O endereço público deve ser o domínio HTTPS oficial, sem caminhos, consultas ou credenciais.');

  return Object.freeze({public: true, origin: url.origin});
}

function staticHead() {
  return [
    '<meta content="pt_BR" property="og:locale"/>',
    '<meta content="Instituto Chroma" property="og:site_name"/>',
    '<meta content="summary" name="twitter:card"/>',
  ].join('');
}

function officialPageURL(slug, origin) {
  return slug === 'index' ? origin + '/' : origin + '/' + slug + '.html';
}

export function enhanceHtml(html, slug, config) {
  if (!PAGE_SLUGS.includes(slug)) throw new Error('Página não reconhecida: ' + slug);
  const headEnd = '</head>';
  const currentRobots = '<meta content="noindex,nofollow" name="robots"/>';
  if (!html.includes(headEnd) || !html.includes(currentRobots)) {
    throw new Error('O HTML precisa conter head e política de indexação explícita: ' + slug);
  }

  let addition = staticHead();

  if (config.public) {
    const pageURL = officialPageURL(slug, config.origin);
    const imageURL = config.origin + '/assets/chroma-logo-oficial.png';
    addition += [
      '<link href="' + pageURL + '" rel="canonical"/>',
      '<meta content="' + pageURL + '" property="og:url"/>',
      '<meta content="' + imageURL + '" property="og:image"/>',
      '<meta content="Logotipo oficial do Instituto Chroma" property="og:image:alt"/>',
      '<meta content="' + imageURL + '" name="twitter:image"/>',
    ].join('');

    html = html.replace(currentRobots,
      '<meta content="index,follow,max-image-preview:large" name="robots"/>');

    if (slug === 'index') {
      const jsonLD = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'Instituto Chroma',
        url: config.origin + '/',
        foundingDate: '2016',
        sameAs: ['https://www.instagram.com/escola_chroma/'],
      };
      addition += '<script type="application/ld+json">' + JSON.stringify(jsonLD) + '</script>';
    }
  }
  return html.replace(headEnd, addition + headEnd);
}

export function robotsText(config) {
  if (!config.public) return 'User-agent: *\nDisallow: /\n';
  return 'User-agent: *\nAllow: /\nSitemap: ' + config.origin + '/sitemap.xml\n';
}

export function sitemapText(config) {
  if (!config.public) return null;
  const entries = PAGE_SLUGS.map(slug =>
    '  <url><loc>' + officialPageURL(slug, config.origin) + '</loc></url>'
  ).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries + '\n</urlset>\n';
}
