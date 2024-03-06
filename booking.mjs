import puppeteer from 'puppeteer';

export default async function fetchBookingInfo(city) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Modifier le User Agent pour éviter d'être détecté comme un bot.
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

  await page.goto(`https://www.booking.com/searchresults.fr.html?ss=${city}`);

  // Attendez que les titres des établissements soient visibles
  await page.waitForSelector('[data-testid="title"]');

  // Récupérez les titres des établissements et leurs descriptions
  const results = await page.evaluate(async () => {
    const titleElements = Array.from(document.querySelectorAll('[data-testid="title"]'));
    let descriptionElements = Array.from(document.querySelectorAll('[class="abf093bdfe"]'));

    // Supprimez les deux premières descriptions
    descriptionElements = descriptionElements.slice(2);

    const hotelResults = titleElements.map((titleElement, index) => {
      return {
        name: titleElement.innerText.trim(),
        // Utilisez l'index correct pour les descriptions après avoir supprimé les deux premiers éléments
        description: descriptionElements[index] ? descriptionElements[index].innerText.trim() : 'Description non disponible'
      };

    });

    return hotelResults;
  });

    const moreResultsSelector = 'button[aria-label="Afficher plus de résultats"]';
    const moreResultsButton = await page.$(moreResultsSelector);
    if (moreResultsButton) {
        await moreResultsButton.click();
        await page.waitForTimeout(2000);
    }
    



  await browser.close();

  return results;
}