import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('https://developer.chrome.com/');

  // Tapez dans le champ de recherche et appuyez sur Entrée
  await page.type('.devsite-search-field', 'Puppeteer');
  await page.keyboard.press('Enter');

  // Attendez que les résultats de recherche soient affichés
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Utilisez un sélecteur plus spécifique pour les résultats de recherche si nécessaire
  const searchResults = await page.$$('.gsc-thumbnail-inside .gs-title');
  if (searchResults.length > 0) {
    // Au lieu de waitForNavigation, écoutez 'load' ou d'autres événements qui indiquent que la page de destination est prête
    await Promise.all([
      searchResults[0].click(), // Cliquez sur le lien
      // Cette fois, nous utilisons waitForResponse ou un événement qui vous convient mieux
      page.waitForResponse(response => response.url().includes('/blog/')),
    ]);

    // Vérifiez que nous sommes sur la bonne page après le clic, inspectez l'URL actuelle
    console.log(`Current URL: ${page.url()}`);

    // Récupérez le titre en utilisant le sélecteur correct
    const titleSelector = '.article-title'; // Remplacez ceci par le sélecteur correct pour le titre
    await page.waitForSelector(titleSelector);
    const articleTitle = await page.evaluate((sel) => document.querySelector(sel).textContent.trim(), titleSelector);

    console.log(`Le titre de l'article est : "${articleTitle}"`);

    await page.screenshot({ path: 'search_result.png' });
  } else {
    console.log("Aucun résultat de recherche trouvé.");
  }

  await browser.close();
})();
