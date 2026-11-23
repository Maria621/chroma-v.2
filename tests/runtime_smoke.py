"""Validação real do JavaScript modular em Chromium, servindo dist/ por HTTP local."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from shutil import which
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
PAGES = ('index', 'a-chroma', 'nosso-trabalho', 'projetos-e-parcerias', 'unidades', 'contato')

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT / 'dist')))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
BASE = f'http://127.0.0.1:{server.server_address[1]}'

def require(condition, message):
    if not condition:
        raise AssertionError(message)

try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=which('google-chrome') or which('google-chrome-stable') or which('chromium'),
            headless=True, args=['--no-sandbox'])
        for slug in PAGES:
            page = browser.new_page(viewport={'width': 1440, 'height': 900}, reduced_motion='reduce')
            errors = []
            page.on('pageerror', lambda err: errors.append(str(err)))
            response = page.goto(BASE + '/' + slug + '.html', wait_until='domcontentloaded', timeout=45000)
            require(response and response.status == 200, slug + ': página indisponível')
            page.locator('.v33-scrolltop').wait_for(timeout=15000)
            require(page.locator('main h1').count() == 1, slug + ': h1 incorreto')
            require(page.locator('header').count() == 1, slug + ': cabeçalho incorreto')
            require(page.locator('footer').count() == 1, slug + ': rodapé incorreto')
            require(not errors, slug + ': erro JavaScript: ' + str(errors))
            require(not page.evaluate("document.documentElement.scrollWidth > innerWidth + 5"),
                    slug + ': overflow horizontal em 1440px')

            if slug == 'index':
                require(page.locator('.v33-gallery-dots button').count() == 4, 'Carrossel sem quatro imagens')
                before = page.locator('.gallery-count').inner_text()
                page.locator('.gallery-next').click()
                require(page.locator('.gallery-count').inner_text() != before, 'Avançar do carrossel falhou')
                page.locator('.gallery-slide.is-active .media-zoom-button').click()
                require(page.locator('dialog.v32-art-dialog').evaluate('(e) => e.open'), 'Lightbox não abriu')
                page.keyboard.press('Escape')
                require(not page.locator('dialog.v32-art-dialog').evaluate('(e) => e.open'), 'Lightbox não fechou')

            elif slug == 'a-chroma':
                page.locator('.timeline-widget [role="tab"]').nth(2).click()
                require('2022' in page.locator('.timeline-date').inner_text(), 'Timeline não selecionou 2022')
                require(page.locator('#tm-panel').get_attribute('aria-labelledby') ==
                        page.locator('[role="tab"][aria-selected="true"]').get_attribute('id'),
                        'Timeline sem vínculo com a aba selecionada')

            elif slug == 'contato':
                page.evaluate('window.open = (url) => { window.__openedContact = url; return null; }')
                page.locator('#contactUnit').select_option('pannunzio')
                page.locator('#contactName').fill('Pessoa QA')
                page.locator('#contactMessage').fill('Quero conhecer a escola.')
                page.locator('#chromaContactForm button[type="submit"]').click()
                link = page.evaluate('window.__openedContact')
                require(link is not None and '/5515974035244' in link, 'WhatsApp de Pannunzio incorreto')
                require(page.locator('#whatsappFallback').is_visible(), 'Link alternativo indisponível')
                require(page.locator('#contactUnit option[value="valinhos"]').is_disabled(),
                        'Valinhos não pode usar canal não confirmado')

            page.close()

        mobile = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
        mobile.goto(BASE + '/index.html', wait_until='domcontentloaded', timeout=45000)
        mobile.locator('.v33-scrolltop').wait_for(timeout=15000)
        mobile.locator('.menu-toggle').click()
        require(mobile.locator('.mobile-nav').is_visible(), 'Menu móvel não abriu')
        require(mobile.locator('main').evaluate('(e) => e.inert'), 'Conteúdo não está inerte')
        mobile.keyboard.press('Escape')
        require(not mobile.locator('.mobile-nav').is_visible(), 'Escape não fechou o menu')
        require(not mobile.locator('main').evaluate('(e) => e.inert'), 'Conteúdo não foi restaurado')
        require('menu-toggle' in mobile.evaluate('document.activeElement.className'),
                'Foco não retornou ao botão do menu')
        mobile.locator('.menu-toggle').click()
        mobile.set_viewport_size({'width': 1440, 'height': 900})
        mobile.wait_for_function("document.querySelector('.mobile-nav').hidden", timeout=5000)
        require('logo-link' in mobile.evaluate('document.activeElement.className'),
                'Ao mudar para desktop, o foco precisa retornar ao logo visível')
        mobile.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()

print('QA em navegador HTTP: seis páginas, carrossel, modal, timeline, formulário e menu móvel aprovados.')
