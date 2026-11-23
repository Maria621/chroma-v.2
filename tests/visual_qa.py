import json, time, os, pathlib, mimetypes, re, base64, shutil
from bs4 import BeautifulSoup
from PIL import Image,ImageDraw
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'qa';out.mkdir(exist_ok=True)

def bundle_scripts():
    base=root/'dist/assets'
    ordered=['data/timeline.js','js/components/navigation.js','js/components/carousel.js','js/components/timeline.js','js/components/lightbox.js','js/components/units.js','js/components/contact.js','js/components/news.js','js/main.js']
    parts=[]
    for p in ordered:
        t=(base/p).read_text()
        t=re.sub(r'^import \{.*?;\s*$', '', t, flags=re.M)
        t=re.sub(r'\bexport\s+(?=(?:async\s+)?(?:function|const))','',t)
        parts.append(t)
    return '\n'.join(parts)

bundle=bundle_scripts()
def inline_page(name):
    base=root/'dist'
    soup=BeautifulSoup((base/(name+'.html')).read_text(),'html.parser')
    for link in list(soup.find_all('link')):
        if 'stylesheet' not in link.get('rel',[]): continue
        href=link.get('href','')
        if href.startswith('https:'):
            link.decompose();continue
        f=base/href
        css=f.read_text()
        def bg(match):
            val=match.group(1).strip(' \"\'')
            path=(f.parent/val).resolve()
            if path.is_file():
                mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
                return 'url(\"data:%s;base64,%s\")'%(mime,base64.b64encode(path.read_bytes()).decode())
            return match.group(0)
        css=re.sub(r'url\(([^)]+)\)',bg,css)
        style=soup.new_tag('style');style.string=css;link.replace_with(style)
    for img in soup.select('img[src]'):
        f=base/img['src']
        if f.is_file():
            mime=mimetypes.guess_type(f.name)[0] or 'image/webp'
            img['src']='data:%s;base64,%s'%(mime,base64.b64encode(f.read_bytes()).decode())
    for script in list(soup.find_all('script')):
        if script.get('src')=='assets/js/main.js': script.decompose()
    js=soup.new_tag('script');js.string=bundle.replace('</script>',r'<\/script>')
    soup.body.append(js)
    return str(soup)

pages=['index','a-chroma','nosso-trabalho','projetos-e-parcerias','unidades','contato']
res=[]
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=shutil.which('google-chrome') or shutil.which('google-chrome-stable') or shutil.which('chromium'),headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  for page in pages:
   for w in (320,390,768,1024,1440,1920):
    pg=browser.new_page(viewport={'width':w,'height':800 if w<500 else 900},device_scale_factor=1,reduced_motion='reduce')
    errors=[];status=[]
    pg.on('pageerror',lambda e:errors.append(str(e)))
    pg.on('response', lambda r:status.append({'status':r.status,'url':r.url}) if r.status>=400 else None)
    pg.set_content(inline_page(page),wait_until='load',timeout=60000)
    pg.wait_for_timeout(120)
    d=pg.evaluate('''() => { const vw=window.innerWidth; const els=[...document.querySelectorAll('body *')];const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity!==0&&r.width>0&&r.height>0};return {overflow:els.filter(e=>{const r=e.getBoundingClientRect();return visible(e)&&r.right>vw+4&&r.width>9&&!(()=>{let a=e.parentElement;while(a&&a!==document.body){const st=getComputedStyle(a),b=a.getBoundingClientRect();if(/hidden|clip/.test(st.overflowX)&&b.right<=vw+2)return true;a=a.parentElement;}return false})()}).slice(0,12).map(e=>({tag:e.tagName,cls:e.className.toString().slice(0,65),right:Math.round(e.getBoundingClientRect().right)})), brokenImages:[...document.images].filter(i=>i.getAttribute('src') && i.loading!=='lazy' && i.complete && i.naturalWidth===0).map(i=>(i.getAttribute('alt')||'sem descrição').slice(0,100)), buttons: [...document.querySelectorAll('button')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.width<24||r.height<24}).map(e=>({name:e.getAttribute('aria-label')||e.textContent.slice(0,25),width:Math.round(e.getBoundingClientRect().width),height:Math.round(e.getBoundingClientRect().height)})), footer: Math.round(document.querySelector('footer').getBoundingClientRect().height), header:Math.round(document.querySelector('header').getBoundingClientRect().height), main:Math.round(document.querySelector('main').getBoundingClientRect().height), h1Count:document.querySelectorAll('h1').length, stylesheets:[...document.styleSheets].map(s=>s.href).filter(Boolean) } }''')
    d['typography']=pg.evaluate("""() => {
      const root = getComputedStyle(document.documentElement);
      const heading = document.querySelector('main h1');
      const note = document.querySelector('.v3-note, .v3-source, .v3-story-meta, .v3-unit dt, .v3-whatsapp-form small');
      const muted = root.getPropertyValue('--ds-muted-text').trim();
      return {
        bodyFamily: getComputedStyle(document.body).fontFamily,
        headingFamily: heading ? getComputedStyle(heading).fontFamily : '',
        supportFontSize: note ? getComputedStyle(note).fontSize : null,
        supportColor: note ? getComputedStyle(note).color : null,
        mutedToken: muted,
      };
    }""")
    if 'Poppins' not in d['typography']['bodyFamily']:
     errors.append('Fonte do corpo não é Poppins')
    if 'Montserrat' not in d['typography']['headingFamily']:
     errors.append('Fonte de título não é Montserrat')
    d['visualMedia']=pg.evaluate("""() => {
      const get = selector => document.querySelector(selector);
      const hero = get('.v3-hero');
      const heroPhoto = get('.v3-home-hero .v3-hero-photo');
      const photo = get('.v3-photo img');
      const unit = get('.v3-unit .v32-unit-image img');
      const campaign = get('.v3-update-grid .v3-update-img img');
      const footer = get('.site-footer');
      const photoFit = element => element ? getComputedStyle(element).objectFit : null;
      const rect = element => element ? element.getBoundingClientRect() : null;
      const heroRect = rect(hero);
      const contentRect = rect(get('.v3-hero-content'));
      const footerRect = rect(footer);
      return {
        heroHeight: heroRect ? Math.round(heroRect.height) : null,
        heroContainsText: !heroRect || !contentRect || (contentRect.top >= heroRect.top-2 && contentRect.bottom <= heroRect.bottom+2),
        heroPhotoFit: photoFit(heroPhoto),
        institutionalPhotoFit: photoFit(photo),
        unitPhotoFit: photoFit(unit),
        campaignFit: photoFit(campaign),
        footerWidth: footerRect ? Math.round(footerRect.width) : null,
        viewportWidth: innerWidth,
      };
    }""")
    media=d['visualMedia']
    if page=='index' and media['heroPhotoFit']!='contain':
     errors.append('Imagem principal deve ser exibida inteira')
    if page=='unidades' and media['unitPhotoFit']!='contain':
     errors.append('Imagem da unidade está sujeita a recorte')
    if page=='index' and media['campaignFit']!='contain':
     errors.append('Campanha está sujeita a recorte')
    if not media['heroContainsText']:
     errors.append('Conteúdo do hero fora de seus limites')
    d.update({'page':page,'width':w,'errors':errors,'httpErrors':status})
    if w in (390,1440):
     pg.screenshot(path=str(out/f'{page}-{w}.png'),full_page=True)
    if page=='index' and w==1440:
     before=pg.locator('.gallery-count').inner_text();pg.locator('.gallery-next').click();d['carousel']={'before':before,'after':pg.locator('.gallery-count').inner_text(),'dots':pg.locator('.v33-gallery-dots button').count()}
     pg.locator('.v33-gallery-dots button').nth(3).click();d['carousel']['click4']=pg.locator('.gallery-count').inner_text();d['carousel']['dotRect']=pg.locator('.v33-gallery-dots button').first.bounding_box()
     pg.locator('.gallery-slide.is-active .media-zoom-button').click();d['lightboxOpen']=pg.locator('dialog.v32-art-dialog').evaluate('(d)=>d.open');pg.keyboard.press('Escape');d['lightboxClosed']=not pg.locator('dialog.v32-art-dialog').evaluate('(d)=>d.open')
    if page=='index' and w==390:
     pg.locator('.menu-toggle').click();d['mobileOpened']=pg.locator('.menu-toggle').get_attribute('aria-expanded');d['mobileVisible']=pg.locator('.mobile-nav').is_visible();d['mobileMainInert']=pg.locator('main').evaluate('(e)=>e.inert');pg.keyboard.press('Escape');d['mobileClosed']=pg.locator('.menu-toggle').get_attribute('aria-expanded');d['mainRestored']=not pg.locator('main').evaluate('(e)=>e.inert')
    if page=='a-chroma' and w==1440:
     pg.locator('.timeline-widget [role="tab"]').nth(1).click();d['timelineSecond']=pg.locator('.timeline-date').inner_text();d['timelinePanelLabel']=pg.locator('#tm-panel').get_attribute('aria-labelledby');d['timelineActiveTab']=pg.locator('.timeline-widget [aria-selected="true"]').get_attribute('id');pg.locator('.tm-next').click();d['timelineNext']=pg.locator('.timeline-date').inner_text()
    if page=='unidades' and w==1440:
     pg.locator('.v3-unit .v33-copy-address').first.click();d['unitCopyTest']=pg.locator('.v33-toast').inner_text();d['visitColor']=pg.locator('.v32-visit-section h2').evaluate('(e)=>getComputedStyle(e).color');d['visitEmColor']=pg.locator('.v32-visit-section h2 em').evaluate('(e)=>getComputedStyle(e).color');d['visitBg']=pg.locator('.v32-visit-section').evaluate('(e)=>getComputedStyle(e).backgroundImage')
    if page=='contato' and w==1440:
     d['contactCta']=pg.locator('.v3-sub-hero .v3-btn').first.get_attribute('href');d['formFound']=pg.locator('#chromaContactForm').count()>0
     d['valinhosDisabled']=pg.locator('#contactUnit option[value="valinhos"]').is_disabled()
     pg.evaluate('window.open = (href) => { window.__qaContactHref = href; return null; }')
     pg.locator('#contactUnit').select_option('pannunzio')
     pg.locator('#contactName').fill('Pessoa QA')
     pg.locator('#contactMessage').fill('Gostaria de conhecer a unidade.')
     pg.locator('#chromaContactForm button[type="submit"]').click()
     d['pannunzioHref']=pg.evaluate('window.__qaContactHref')
     d['whatsappFallbackVisible']=pg.locator('#whatsappFallback').is_visible()
     d['contactStatusVisible']=pg.locator('#contactStatus').is_visible()
    res.append(d)
    print(f'{page:22} {w:4} width_errors:{len(d["overflow"])} broken:{len(d["brokenImages"])} js:{len(errors)} badbuttons:{len(d["buttons"])} http:{len(status)}')
    pg.close()
  browser.close()
finally:
 pass
(out/'results.json').write_text(json.dumps(res,ensure_ascii=False,indent=2))
for w in (1440,390):
 thumbs=[]
 for page in pages:
  im=Image.open(out/f'{page}-{w}.png').convert('RGB')
  im=im.crop((0,0,im.width,min(im.height,800 if w==390 else 820)))
  im.thumbnail((380,560))
  cell=Image.new('RGB',(400,610),'white');cell.paste(im,((400-im.width)//2,30))
  ImageDraw.Draw(cell).text((10,8),page,fill=(20,45,80));thumbs.append(cell)
 sheet=Image.new('RGB',(1200,1220),'white')
 for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*400,(i//3)*610))
 sheet.save(out/f'montage-{w}.jpg',quality=88)


# Falhas críticas devem encerrar o QA com código de saída diferente de zero.
failures=[]
for result in res:
 label=f'{result["page"]}@{result["width"]}px'
 if result.get('h1Count')!=1: failures.append(label+': deve haver exatamente um h1')
 if result.get('errors'): failures.append(label+': JS/UX '+str(result['errors']))
 if result.get('brokenImages'): failures.append(label+': imagens inválidas '+str(result['brokenImages']))
 if result.get('overflow'): failures.append(label+': conteúdo fora da viewport '+str(result['overflow']))
 if result.get('httpErrors'): failures.append(label+': erros HTTP '+str(result['httpErrors']))

for result in res:
 if result['page']=='index' and result['width']==1440:
  if result.get('lightboxOpen') is not True or result.get('lightboxClosed') is not True:
   failures.append('index@1440px: lightbox falhou')
  if result.get('carousel',{}).get('before')==result.get('carousel',{}).get('after'):
   failures.append('index@1440px: navegação do carrossel falhou')
 if result['page']=='index' and result['width']==390:
  if result.get('mobileOpened')!='true' or result.get('mobileClosed')!='false' or not result.get('mainRestored'):
   failures.append('index@390px: menu móvel não abriu/fechou corretamente')
 if result['page']=='contato' and result['width']==1440:
  if not result.get('valinhosDisabled') or not result.get('whatsappFallbackVisible') or not result.get('contactStatusVisible'):
   failures.append('contato@1440px: formulário ou recuperação não funcionou')
 if result['page']=='a-chroma' and result['width']==1440:
  if result.get('timelinePanelLabel')!=result.get('timelineActiveTab'):
   failures.append('a-chroma@1440px: vínculo da timeline incorreto')

(out/'summary.json').write_text(json.dumps({
 'pages':len(pages),'viewports':[320,390,768,1024,1440,1920],
 'scenarios':len(res),'critical_failures':failures
},ensure_ascii=False,indent=2))

if failures:
 print('QA VISUAL REPROVADO: '+str(len(failures))+' falha(s) críticas')
 for failure in failures: print(' - '+failure)
 raise SystemExit(1)
print('QA visual aprovado: 36 combinações e fluxos-chave; capturas em qa/.')
