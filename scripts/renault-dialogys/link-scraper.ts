import { PendingXHR } from "pending-xhr-puppeteer";
import puppeteer, { ElementHandle, Page } from "puppeteer";
import fs from "fs/promises";
import { COOKIE, EMAIL, PASSWORD, VIN } from "./config.ts";

async function login(page: Page) {
  await page.locator(`[ng-model="ctrl.form.email"]`).fill(EMAIL);

  await page.locator(`[ng-model="ctrl.form.password"]`).fill(PASSWORD);

  await page.locator(`[ng-click="ctrl.gigyaLogin(gigyaForm)"]`).click();
}

async function selectCar(page: Page) {
  await page.locator(`[ng-model="vm.carSearch.vin"]`).fill(VIN);

  await page.locator(`[ng-click="vm.search()"]`).click();
}

async function getLevel1Pages(page: Page) {
  await page.waitForSelector(`.line_menu1_label`);

  const items = await page.$$(`.line_menu1_label`);

  console.log("Found level 1 pages:", items.length);

  return items;
}

async function screenshotLevel1Page(page: Page, level1PagePath: string) {
  await delay(1000);

  const expandImage = await page.$(`.btnShowExplodedView`);
  if (expandImage) {
    await expandImage.click();
    page.waitForNetworkIdle();
  }

  await fs.mkdir(level1PagePath, { recursive: true });
  await page.screenshot({
    path: `${level1PagePath}/screenshot.png`,
    fullPage: true,
  });
}

async function getLevel2Pages(page: Page) {
  await page.waitForSelector(`.linkPiece2`);

  const items = await page.$$(`.linkPiece2`);

  console.log("Found level 2 pages:", items.length);

  return items;
}

async function getLevel3Pages(page: Page, index: number) {
  const items = await page.$$(
    `.level2and3 .row.row-level:nth-child(${index + 1}) .linkPiece3`
  );

  console.log("Found level 3 pages:", items.length);

  return items;
}

async function processPage(
  page: Page,
  level23Page: ElementHandle<Element>,
  level23PagePath: string
) {
  await fs.mkdir(`${level23PagePath}/PR`, { recursive: true });
  await fs.mkdir(`${level23PagePath}/MR`, { recursive: true });
  await fs.mkdir(`${level23PagePath}/MD`, { recursive: true });

  // TODO: fetch PR, MR and MD links

  page.on("request", async (request) => {
    console.log(`request on ${level23PagePath}`, request.url());
    request.continue();
  });

  level23Page.click();
  page.waitForNetworkIdle();

  page.off("request");
}

async function getDocuments(page: Page) {
  const path = `pdfs/${VIN}`;

  for (const level1Page of await getLevel1Pages(page)) {
    const level1PageName = await level1Page.evaluate((el) => el.textContent);
    const level1PagePath = `${path}/${level1PageName}`;
    console.log("Fetching level 1 page:", level1PageName);

    await level1Page.click();
    await screenshotLevel1Page(page, level1PagePath);

    for (const [index, level2Page] of (await getLevel2Pages(page)).entries()) {
      const level2PageName = await level2Page.evaluate((el) => el.textContent);
      const level2PagePath = `${level1PagePath}/${level2PageName}`;
      console.log("Fetching level 2 page:", level2PageName);

      await processPage(page, level2Page, level2PagePath);

      for (const level3Page of await getLevel3Pages(page, index)) {
        const level3PageName = await level3Page.evaluate(
          (el) => el.textContent
        );
        const level3PagePath = `${level2PagePath}/${level3PageName}`;
        console.log("Fetching level 3 page:", level3PageName);

        await processPage(page, level3Page, level3PagePath);

        break; //TODO: remove
      }

      break; //TODO: remove
    }
  }
}

async function main() {
  const browserURL = "http://127.0.0.1:21222";
  const browser = await puppeteer.connect({ browserURL });
  const page = await browser.newPage();

  await page.goto("https://newdialogys.renault.com");
  await page.setViewport({ width: 1920, height: 1080 });

  page.setDefaultTimeout(0);
  page.setDefaultNavigationTimeout(0);

  await page.setRequestInterception(true);
  const pendingXHR = new PendingXHR(page);

  await login(page);
  await selectCar(page);
  await getDocuments(page);

  // await browser.close();
}

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

main();
