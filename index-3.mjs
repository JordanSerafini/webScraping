import puppeteer from 'puppeteer';

(async () => {
  // Lancez Puppeteer
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Allez sur Google.fr
  await page.goto('https://www.google.fr');

  // Acceptez les cookies
  try {
    const consentButtonSelector = '[id="L2AGLb"]';
    await page.waitForSelector(consentButtonSelector, { visible: true, timeout: 5000 });
    await page.click(consentButtonSelector);
  } catch (error) {
    console.log("Le bouton de consentement des cookies n'a pas été trouvé ou une autre erreur s'est produite.");
  }

  // Tapez la requête de recherche et simulez la touche Entrée
  await page.type('textarea[name="q"]', 'appartement annecy');
  await page.keyboard.press('Enter');

  // Attendez que les résultats soient chargés
  await page.waitForSelector('div[id="search"]'); 

  // Récupérez tous les titres des résultats de recherche
  const titles = await page.evaluate(() => {
    const titleElements = Array.from(document.querySelectorAll('div[id="search"] h3'));
    return titleElements.map(el => el.innerText);
  });

  // Affichez les titres dans la console
  console.log(titles);

  await browser.close();
})();
