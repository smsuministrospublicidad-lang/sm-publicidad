const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file:///' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  for (let i = 0; i < 5; i++) {
    await p.evaluate((idx) => {
      document.querySelectorAll('.hero-dot')[idx].click();
    }, i);
    await p.waitForTimeout(1600);
    await p.screenshot({ path: path.join(__dirname, 'slide-' + i + '.png') });
  }
  await b.close();
})();
