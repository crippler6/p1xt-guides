const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width:1200, height:900, deviceScaleFactor:2 });
  const url = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(url, { waitUntil:'networkidle0' });
  const wait = ms => new Promise(r=>setTimeout(r,ms));

  // 1 hero
  await page.screenshot({ path:'01-landing.png' });

  // 2 quiz
  await page.evaluate(()=>goStage('quiz'));
  await wait(300);
  await page.screenshot({ path:'02-quiz.png' });

  // 3 result
  await page.evaluate(()=>{ Object.assign(answers,{scope:'room',size:'sm',climate:'hot',duct:'none'}); showResult(); });
  await wait(400);
  await page.screenshot({ path:'03-result.png', fullPage:true });

  // 4 photos
  await page.evaluate(()=>goStage('photos'));
  await wait(300);
  await page.screenshot({ path:'04-photos.png', fullPage:true });

  // 5 checkout
  await page.evaluate(()=>{ order.photos={'furnace-front':'a','furnace-plate':'b','furnace-clearance':'c','ac-location':'d','panel-open':'e'}; goStage('checkout'); });
  await wait(300);
  await page.screenshot({ path:'05-checkout.png', fullPage:true });

  // 6 assessment – under review
  await page.evaluate(()=>goStage('assessment'));
  await wait(500);
  await page.screenshot({ path:'06-assessment.png', fullPage:true });

  // 7 site visit (flagged path)
  await page.evaluate(()=>goStage('sitevisit'));
  await wait(300);
  await page.screenshot({ path:'07-sitevisit.png', fullPage:true });

  // 8 installers
  await page.evaluate(()=>{ order.slot='Wed 6/25 · 8–10 AM'; goStage('installers'); });
  await wait(300);
  await page.screenshot({ path:'08-installers.png', fullPage:true });

  // 9 tracking
  await page.evaluate(()=>{ pickInstaller(0); confirmInstaller(); });
  await wait(400);
  await page.screenshot({ path:'09-tracking.png', fullPage:true });

  // 10 rate
  await page.evaluate(()=>goStage('rate'));
  await wait(300);
  await page.screenshot({ path:'10-rate.png', fullPage:true });

  await browser.close();
  console.log('done');
})();
