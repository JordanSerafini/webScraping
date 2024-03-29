import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Modifier le User Agent pour éviter d'être détecté comme un bot.
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

  await page.goto('https://www.booking.com/searchresults.fr.html?ss=annecy');

  // Attendez que les titres des établissements soient visibles
  await page.waitForSelector('[data-testid="title"]');

  // Récupérez les titres des établissements
  const titles = await page.evaluate(() => {
    const titleElements = Array.from(document.querySelectorAll('[data-testid="title"]'));
    return titleElements.map(el => el.innerText);
  });
  console.log(titles);

  const descriptions = await page.evaluate(() => {
    const descriptionElements = Array.from(document.querySelectorAll('[class="abf093bdfe"]'));
    return descriptionElements.map(el => el.innerText);
  });
  console.log(descriptions);

  await browser.close();
})();

