const puppeteer = require('puppeteer');
const { URL } = require('url');
const path = require('path');
const iPhone = puppeteer.devices['iPhone 6'];
const { writeSync } = require('./utils');
(async () => {
  const pages = ['https://www.tan8.com/yuepu-21480-m.html', 'https://www.tan8.com/yuepu-21481-m.html'];
  const browser = await puppeteer.launch();
  pages.forEach(async function(p) {
    console.log(p);
    const page = await browser.newPage();
    await page.emulate(iPhone);
    page.on('response', async response => {
      const requestUrl = response.url();
      if (requestUrl.indexOf('https://oss.tan8.com/yuepuku') === 0) {
        const url = new URL(response.url());
        let filePath = path.resolve(`./output${url.pathname}`);
        // console.log(filePath);
        await writeSync(filePath, await response.buffer());
      }
    });

    await page.goto(p);
    await browser.close();
  });
})();
