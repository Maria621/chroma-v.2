import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato'];
const load=relative=>readFile(path.join(root,relative),'utf8');
const exists=async relative=>{try{return (await stat(path.join(root,relative))).isFile()}catch{return false}};
const relativeURL=url=>!(/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(url));

test('build estático: 6 páginas, CSS único e JavaScript modular',async()=>{
 for(const page of pages){
  const html=await load(`dist/${page}.html`);
  assert.equal((html.match(/<h1\b/gi)||[]).length,1,`${page} precisa ter um h1`);
  assert.equal((html.match(/<header\b/gi)||[]).length,1);
  assert.equal((html.match(/<footer\b/gi)||[]).length,1);
  assert.match(html,/assets\/css\/site\.css/);
  assert.match(html,/assets\/js\/main\.js/);
  assert.doesNotMatch(html,/(?:href="(?:styles|v3|v33|v34)\.css"|src="(?:site|v33)\.js")/);
  assert.match(html,/name="robots"/);
 }
});

test('links relativos e âncoras internas existentes',async()=>{
 for(const page of pages){
  const html=await load(`dist/${page}.html`);
  for(const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)){
   const href=match[1].replace(/&amp;/g,'&');
   if(!relativeURL(href))continue;
   const [base,fragment]=href.split('#');
   const target=base||`${page}.html`;
   assert.ok(await exists(`dist/${target}`),`Link de ${page}: ${href} sem página`);
   if(fragment){
    const dest=await load(`dist/${target}`);
    assert.ok(dest.includes(`id="${fragment}"`),`Âncora ausente em ${page}: ${href}`);
   }
  }
 }
});

test('imagens, dados e arquivos de módulos têm destinos íntegros',async()=>{
 for(const page of pages){
  const html=await load(`dist/${page}.html`);
  for(const match of html.matchAll(/<(?:img|script)\b[^>]*\bsrc="([^"]+)"/gi)){
   const src=match[1];
   if(relativeURL(src))assert.ok(await exists(`dist/${src}`),`${page} utiliza recurso ausente: ${src}`);
  }
 }
 const jsFiles=['main.js','components/navigation.js','components/carousel.js','components/timeline.js','components/lightbox.js','components/units.js','components/contact.js','components/news.js'];
 for(const name of jsFiles)assert.ok(await exists(`dist/assets/js/${name}`));
 assert.ok(await exists('dist/assets/data/timeline.js'));
 assert.ok(await exists('dist/conteudo/novidades.json'));
});

test('correções P0/P1: contraste, destino do Nexus, CTA e controles de toque',async()=>{
 const css=await load('dist/assets/css/site.css');
 const work=await load('dist/nosso-trabalho.html');
 const contact=await load('dist/contato.html');
 assert.match(css,/\.chroma-v3 \.v32-visit h2\{color:#fff\}/);
 assert.match(css,/\.v33-gallery-dots button\{min-width:44px;min-height:44px/);
 assert.doesNotMatch(work,/projetos-e-parcerias\.html#nexus/);
 assert.match(work,/id="nexus"/);
 assert.match(contact,/href="#chromaContactForm"/);
 assert.match(contact,/id="whatsappFallback"/);
});

test('menu, rodapé e CTA compartilham estrutura',async()=>{
 const htmls=await Promise.all(pages.map(x=>load(`dist/${x}.html`)));
 const footerRe=/<footer\b[\s\S]*?<\/footer>/i;
 const first=htmls[0].match(footerRe)?.[0];
 assert.ok(first);
 for(const h of htmls)assert.equal(h.match(footerRe)?.[0],first);
 for(let i=0;i<htmls.length;i++){
  const current=pages[i]+'.html';
  assert.ok(htmls[i].includes(`href="${current}" aria-current="page"`)||htmls[i].includes(`aria-current="page" href="${current}"`),`aria-current ausente para ${current}`);
 }
});
