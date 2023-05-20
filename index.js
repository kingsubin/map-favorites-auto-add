const puppeteer = require('puppeteer');
const fsPromises = require('fs/promises')

const args = process.argv.slice(2);

const targetId = args[0];
const groupNumber = parseInt(args[1]) || 1;

const getAddresses = async () => {
  const data = await fsPromises.readFile('./data.json', 'utf8');
  return JSON.parse(data).bookmarkList.map((item) => item.address);
}

(async () => {
  const addresses = await getAddresses();

  const browser = await puppeteer.connect({
    browserWSEndpoint: `ws://127.0.0.1:9223/devtools/browser/${targetId}`,
    defaultViewport: {
      width: 1920,
      height: 1080,
    }
  });
  const page = await browser.newPage();

  await page.goto('https://map.kakao.com/?nil_profile=title&nil_src=local');

  for (const address of addresses) {
    await page.waitForSelector('#search\\.keyword\\.query');
    await page.type('#search\\.keyword\\.query', address, { delay: 50 });

    await page.waitForSelector('#search\\.keyword\\.submit');
    await page.click('#search\\.keyword\\.submit');

    try {
      await page.waitForSelector('div.toolbar > div > div.InfoWindowToolbar > a.fav.ACTIVE', { timeout: 500 });

      await page.waitForSelector('#search\\.keyword\\.query');
      await page.$eval('#search\\.keyword\\.query', (el) => el.value = '');

      console.log(`${address} 이미 등록됨.`);
      continue;
    } catch (e) {
    }

    await page.waitForSelector('div.NO-ROADVIEW > div > div.InfoWindowToolbar > a.fav');
    await page.waitForTimeout(1000);
    await page.$eval('div.NO-ROADVIEW > div > div.InfoWindowToolbar > a.fav', async (el) => {
      await el.click();
    })

    await page.waitForSelector(`div.inner_favorite_layer6 > div.layer_body > ul > li:nth-child(${groupNumber + 1}) > a.link_folder`);
    await page.waitForTimeout(1000);
    await page.$eval(`div.inner_favorite_layer6 > div.layer_body > ul > li:nth-child(${groupNumber + 1}) > a.link_folder`, async (el) => await el.click());

    await page.waitForSelector('div.layer_foot > button');
    await page.$eval('div.layer_foot > button', async (el) => await el.click());
    await page.waitForTimeout(1500);

    await page.waitForSelector('#search\\.keyword\\.query');
    await page.$eval('#search\\.keyword\\.query', (el) => el.value = '');

    console.log(`${address} 등록 완료`);
  }

  await browser.close();
})();
