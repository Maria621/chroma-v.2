/** Build estático multipágina sem dependências. A origem é /src e a publicação é /dist. */
import {readFile,writeFile,mkdir,cp,rm,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read = relative => readFile(path.join(root,relative),'utf8');
const pages=['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato'];
const dist=path.join(root,'dist');
await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
const headerTemplate=await read('src/partials/header.html');
const footer=await read('src/partials/footer.html');
for(const slug of pages){
 const file=`${slug}.html`;
 let head=headerTemplate.replaceAll(' aria-current="page"','');
 head=head.replace(/(<a\b[^>]*href="([^"]+)"[^>]*)(>)/g,(full,start,href,end)=>{
   // A marca é sempre um link; marcação de página atual apenas nos menus.
   return href===file && !start.includes('logo-link')?`${start} aria-current="page"${end}`:full;
 });
 const source=await read(`src/pages/${file}`);
 if(!source.includes('<!-- CHROMA_HEADER -->')||!source.includes('<!-- CHROMA_FOOTER -->'))throw Error('Placeholder ausente: '+file);
 const rendered=source.replace('<!-- CHROMA_HEADER -->',head).replace('<!-- CHROMA_FOOTER -->',footer);
 await writeFile(path.join(dist,file),rendered,'utf8');
}
// A pasta assets/ original é a referência da marca; public/ é fallback portátil do pacote.
const canAccess=async folder=>{try{await access(folder);return true}catch{return false}};
const brandAssets=(await canAccess(path.join(root,'assets')))?path.join(root,'assets'):path.join(root,'public/assets');
const contentAssets=(await canAccess(path.join(root,'conteudo')))?path.join(root,'conteudo'):path.join(root,'public/conteudo');
await cp(brandAssets,path.join(dist,'assets'),{recursive:true});
await cp(contentAssets,path.join(dist,'conteudo'),{recursive:true});
await mkdir(path.join(dist,'assets','css'),{recursive:true});
await mkdir(path.join(dist,'assets','js'),{recursive:true});
await mkdir(path.join(dist,'assets','data'),{recursive:true});
const css=(await read('src/styles/site.css')).replace(/url\((['"]?)assets\//g,'url($1../');
await writeFile(path.join(dist,'assets/css/site.css'),css,'utf8');
await cp(path.join(root,'src/scripts'),path.join(dist,'assets/js'),{recursive:true});
await cp(path.join(root,'src/data'),path.join(dist,'assets/data'),{recursive:true});
console.log('Build Chroma: 6 páginas; 1 CSS; componentes JS; assets. Saída: dist/');
