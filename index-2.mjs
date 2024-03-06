import puppeteer from 'puppeteer';

(async () => {
  // Lancer le navigateur et ouvrir une nouvelle page vide
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Naviguer vers une URL
  await page.goto('https://developer.chrome.com/');

  // Définir la taille de l'écran
  await page.setViewport({width: 1080, height: 1024});

  // Saisir du texte dans la barre de recherche
  await page.type('.devsite-search-field', 'automate beyond recorder');

  // Attendre et cliquer sur le premier résultat
  const searchResultSelector = '.devsite-result-item-link';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);

  // Localiser le titre complet avec une chaîne unique
  const textSelector = await page.waitForSelector(
    'text/Customize and automate'
  );
  const fullTitle = await textSelector?.evaluate(el => el.textContent);

  // Afficher le titre complet
  console.log('Le titre de cet article de blog est "%s".', fullTitle);

  await browser.close();
})();
