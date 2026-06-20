const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  const url = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(url, { waitUntil: 'networkidle0' });

  const wait = ms => new Promise(r => setTimeout(r, ms));

  // 1. Landing / hero
  await page.screenshot({ path: '01-landing.png' });

  // Walk the quiz via injected JS to reach each stage
  // 2. Quiz
  await page.evaluate(() => goStage('quiz'));
  await wait(400);
  await page.screenshot({ path: '02-quiz.png' });

  // Fill answers and show result
  await page.evaluate(() => {
    Object.assign(answers, { scope:'room', size:'sm', climate:'hot', duct:'none' });
    showResult();
  });
  await wait(500);
  await page.screenshot({ path: '03-result.png', fullPage: true });

  // 3. Photos
  await page.evaluate(() => goStage('photos'));
  await wait(400);
  await page.screenshot({ path: '04-photos.png', fullPage: true });

  // 4. Deposit
  await page.evaluate(() => { order.photos = {furnace:'a.jpg', location:'b.jpg'}; goStage('deposit'); });
  await wait(400);
  await page.screenshot({ path: '05-deposit.png', fullPage: true });

  // 5. Site visit
  await page.evaluate(() => goStage('sitevisit'));
  await wait(400);
  await page.screenshot({ path: '06-sitevisit.png', fullPage: true });

  // 6. Installers
  await page.evaluate(() => { order.slot = 'Wed 6/24 · 8–10 AM'; goStage('installers'); });
  await wait(400);
  await page.screenshot({ path: '07-installers.png', fullPage: true });

  // 7. Assigned (uber-style)
  await page.evaluate(() => { pickInstaller(0); assignInstaller(); });
  await wait(500);
  await page.screenshot({ path: '08-assigned.png', fullPage: true });

  await browser.close();
  console.log('Screenshots done.');
})();
