import readline from 'readline';
import fetchBookingInfo from './booking.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Posez une question à l'utilisateur et utilisez la réponse.
rl.question('Veuillez entrer le nom de la ville pour la recherche : ', async (city) => {
  try {
    const bookingInfo = await fetchBookingInfo(city);
    console.log(bookingInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations :', error);
  }

  rl.close(); 
});
