import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const executablePath = [process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(candidate => candidate && existsSync(candidate));
if (!executablePath) throw new Error('Browser non trovato: impostare CHROME_PATH su Chrome o Edge.');

const port = 8124;
const url = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: root, env: { ...process.env, PORT: String(port) }, windowsHide: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;
const checks = [];
const pageErrors = [];
const failedLocalResponses = [];
const record = name => { checks.push(name); console.log(`OK ${name}`); };
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server locale non pronto')), 10000);
    server.stdout.on('data', data => { if (data.toString().includes('Local:')) { clearTimeout(timeout); resolve(); } });
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Server terminato: ${code}`)); });
  });
  assert.equal((await fetch(url)).status, 200);
  browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, deviceScaleFactor: 1 });
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(url) && response.status() >= 400) failedLocalResponses.push(response.url()); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#app').waitFor({ state: 'visible' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('.result-count').innerText(), '112 pizze');
  assert.equal(await page.locator('.pizza-card').count(), 6);
  assert.equal(await page.locator('.ingredient-tile').count(), 18);
  record('avvio, catalogo completo e prima selezione editoriale');

  const ingredient = name => page.locator('.ingredients-grid').getByRole('button', { name, exact: true });
  const incompatibleIngredient = name => page.locator('.ingredients-grid').getByRole('button', { name: `${name}: non compatibile con il mix selezionato`, exact: true });
  const search = page.getByRole('searchbox', { name: 'Cerca un ingrediente' });
  const reset = async () => {
    await page.locator('.selection-panel').getByRole('button', { name: 'Svuota tutto' }).click();
  };
  await ingredient('Pomodoro').click();
  await ingredient('Mozzarella').click();
  assert.equal(await page.locator('.result-count').innerText(), '62 pizze');
  assert.equal(await page.locator('.selected-chip').count(), 2);
  // I piselli sono compatibili con il mix anche se la Tre P non è nelle prime sei pizze.
  await search.fill('piselli');
  assert.equal(await ingredient('Piselli').isEnabled(), true);
  await ingredient('Piselli').click();
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Tre P');
  await search.fill('funghi');
  assert.equal(await incompatibleIngredient('Funghi').isDisabled(), true);
  await search.fill('piselli');
  assert.equal(await ingredient('Piselli').isEnabled(), true);
  await ingredient('Piselli').click();
  await search.fill('funghi');
  assert.equal(await ingredient('Funghi').isEnabled(), true);
  await search.fill('');
  await ingredient('Mozzarella').click();
  assert.equal(await page.locator('.selected-chip').count(), 1);
  await ingredient('Pomodoro').focus();
  await page.keyboard.press('Space');
  assert.equal(await page.locator('.result-count').innerText(), '112 pizze');
  assert.equal(await ingredient('Pomodoro').getAttribute('aria-pressed'), 'false');
  record('filtro AND, deselezione e utilizzo da tastiera');

  await search.fill('cipolle');
  await ingredient('Cipolle').click();
  assert(await page.locator('.pizza-card').filter({ hasText: 'Calabrese' }).isVisible());
  await reset();
  await search.fill('crocche');
  await ingredient('Crocché').click();
  assert.equal(await page.locator('.result-count').innerText(), '1 pizza');
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Cafona');
  await reset();
  record('normalizzazione cipolle e ricerca senza accenti');

  await search.fill('maionese');
  await ingredient('Maionese').click();
  assert.equal(await page.locator('.result-count').innerText(), '2 pizze');
  assert.deepEqual((await page.locator('.pizza-info h3').allTextContents()).sort(), ['Rossiccia', 'Rossini']);
  await reset();
  await search.fill('guanciale');
  await ingredient('Guanciale').click();
  assert.deepEqual((await page.locator('.pizza-info h3').allTextContents()).sort(), ['Amatriciana', 'Gricia']);
  await reset();
  await search.fill('pinoli');
  assert.equal(await ingredient('Pinoli').isEnabled(), true);
  await ingredient('Pinoli').click();
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Pesto e patate');
  await reset();
  record('nuove ricette, ingredienti aggiunti e pinoli ora utilizzabili');

  await search.fill('crema di zucchine');
  await ingredient('Crema di zucchine').click();
  await search.fill('provolone');
  await ingredient('Provolone del Monaco').click();
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Nerano');
  await reset();
  await search.fill('provola di bufala');
  await ingredient('Provola di bufala').click();
  await search.fill('pepe nero');
  await ingredient('Pepe nero').click();
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Provola e pepe');
  await reset();
  await search.fill('prezzemolo');
  assert.equal(await ingredient('Prezzemolo').isEnabled(), true);
  await ingredient('Prezzemolo').click();
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Peperone tonnato');
  await reset();
  record('ricette dai menu ufficiali, formaggi distinti e prezzemolo utilizzabile');

  for (const [name, pizzaName] of [['Piselli', 'Tre P'], ['Pomodori secchi', 'Pomodori secchi']]) {
    await search.fill(name);
    assert.equal(await ingredient(name).isEnabled(), true);
    await ingredient(name).click();
    assert.equal(await page.locator('.result-count').innerText(), '1 pizza');
    assert.equal(await page.locator('.pizza-info h3').innerText(), pizzaName);
    await ingredient(name).click();
    assert.equal(await page.locator('.selected-chip').count(), 0);
    await search.fill('');
  }
  record('piselli e pomodori secchi selezionabili, con ricette e deselezione');

  await search.fill('ananas'); await ingredient('Ananas').click();
  await search.fill('aneto');
  const blockedAneto = incompatibleIngredient('Aneto');
  assert.equal(await blockedAneto.isDisabled(), true);
  assert.equal(await blockedAneto.locator('.unavailable-note').innerText(), 'Non compatibile');
  // Anche un click DOM non deve selezionare un pulsante disabilitato.
  await blockedAneto.evaluate(button => button.click());
  assert.equal(await page.locator('.selected-chip').count(), 1);
  assert.equal(await page.locator('.pizza-info h3').innerText(), 'Hawai');
  await search.fill('');
  await page.getByRole('button', { name: 'Extra', exact: true }).click();
  assert.equal(await incompatibleIngredient('Pistacchio').isDisabled(), true);
  assert.equal(await ingredient('Ananas').isEnabled(), true);
  await page.locator('.selection-panel').getByRole('button', { name: 'Rimuovi Ananas', exact: true }).click();
  assert.equal(await ingredient('Pistacchio').isEnabled(), true);
  await ingredient('Ananas').click();
  await reset();
  await search.fill('aneto');
  assert.equal(await ingredient('Aneto').isEnabled(), true);
  await search.fill('non-esiste');
  assert(await page.getByText('Nessun ingrediente trovato.').isVisible());
  await page.getByRole('button', { name: 'Mostra tutti gli ingredienti' }).click();
  record('ingredienti incompatibili bloccati, ricerca e categorie, riattivazione e reset');

  await page.getByRole('button', { name: 'Formaggi', exact: true }).click();
  assert.equal(await page.locator('.ingredient-tile').count(), 18);
  await page.getByRole('button', { name: 'Tutti', exact: true }).click();
  await page.getByRole('button', { name: 'Esplora tutti i 91 ingredienti' }).click();
  assert.equal(await page.locator('.ingredient-tile').count(), 91);
  assert.equal(await page.locator('.ingredient-tile:disabled').count(), 0);
  await page.getByRole('button', { name: 'Mostra meno ingredienti' }).click();
  await page.getByRole('button', { name: /Altre 12 pizze/ }).click();
  assert.equal(await page.locator('.pizza-card').count(), 18);
  await ingredient('Pomodoro').click();
  await page.getByRole('button', { name: /Indecisione da pizza/ }).click();
  assert.equal(await page.locator('.pizza-suggested').count(), 1);
  assert((await page.locator('.pizza-suggested .pizza-info p').innerText()).includes('Pomodoro'));
  await reset();
  record('categorie, espansione, tutti gli ingredienti utilizzabili e suggerimento compatibile');

  await mkdir(new URL('../out/', import.meta.url), { recursive: true });
  assert.equal(await page.locator('.footer-credit').innerText(), 'Creato da Emilie Rollandin');
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width >= 1024 ? 1050 : 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow a ${width}px`);
    const clipped = await page.locator('.ingredient-name').evaluateAll(labels => labels.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent));
    assert.deepEqual(clipped, [], `Nomi tagliati a ${width}px`);
    assert.equal(await page.locator('.footer-signature').evaluate(el => el.scrollWidth > el.clientWidth + 1), false, `Firma tagliata a ${width}px`);
    if (width === 1440 || width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: fileURLToPath(new URL(`../out/${width === 1440 ? 'desktop' : 'mobile'}.png`, import.meta.url)), fullPage: true });
    }
  }
  await page.getByRole('button', { name: 'Esplora tutti i 91 ingredienti' }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(await page.locator('.ingredient-name').evaluateAll(labels => labels.filter(el => el.scrollWidth > el.clientWidth + 1).map(el => el.textContent)), []);
  await page.getByRole('button', { name: 'Mostra meno ingredienti' }).click();
  await ingredient('Pomodoro').click();
  assert(await page.locator('.mobile-results').isVisible());
  await page.locator('.mobile-results').click();
  await page.waitForFunction(() => {
    const top = document.getElementById('results').getBoundingClientRect().top;
    return top >= -1 && top < innerHeight;
  });
  await reset();
  record('layout 320–1440px, etichette leggibili e accesso mobile ai risultati');

  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const accessibility = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
    return result.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
  });
  assert.deepEqual(accessibility, [], JSON.stringify(accessibility, null, 2));
  record('controlli automatici di accessibilità WCAG A/AA');

  const fallback = await browser.newPage();
  await fallback.route('https://cdn.jsdelivr.net/npm/vue@3.5.44/dist/vue.global.prod.js', route => route.abort());
  await fallback.goto(url);
  await fallback.locator('#app').waitFor({ state: 'visible' });
  assert.equal(await fallback.locator('.result-count').innerText(), '112 pizze');
  assert.equal(await fallback.evaluate(() => [...document.scripts].some(s => s.src.endsWith('/assets/vendor/vue.global.prod.js'))), true);
  record('copia locale Vue quando il CDN non risponde');
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(failedLocalResponses, []);
  await writeFile(new URL('../out/browser-results.json', import.meta.url), JSON.stringify({ checks, pageErrors, failedLocalResponses, accessibility }, null, 2));
  console.log(`${checks.length} gruppi di verifiche superati.`);
} finally {
  await browser?.close();
  server.kill();
}
