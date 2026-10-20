// Locali scelti dalla classifica Italia 2025; menu consultati il 20/10/2026.
// La prima evidenza definisce la ricetta; la seconda conferma il nome/abbinamento.
export const topPizzaResearchDate = '2026-10-20';
export const rankingUrl = 'https://www.50toppizza.it/50-top-pizza-italia-2025/';
const source = (operator, url, rank2025 = null, officialPage = url) => ({
  operator, url, officialPage, rank2025, checkedAt: topPizzaResearchDate,
});

export const topPizzaSources = {
  kalo: source('50 Kalò, Napoli', 'https://www.50kalo.it/download/menu_napoli_2023.pdf', 6, 'https://www.50kalo.it/le_pizze.php'),
  notizia: source('La Notizia 94, Napoli', 'https://www.pizzarialanotizia.com/wp-content/uploads/2026/06/La-Notizia-94-menu-260609.pdf', 9, 'https://www.pizzarialanotizia.com/'),
  confine: source('Confine, Milano', 'https://confinemilano.it/pizza/degustazione/', 2),
  seu: source('Seu Pizza Illuminati, Roma', 'https://www.seupizza.com/menu.pdf', 3, 'https://www.seupizza.com/'),
  mafaldina: source('La Mafaldina, Monselice', 'https://www.lamafaldina.it/menu/menu-pizzeria-monselice/'),
  vesuvia: source('Pizzeria Vesuvia', 'https://www.pizzeria-vesuvia.it/app/download/35268450/MENU%2BA4%2B-%2BINGLESE-%2BPIZZERIA%2BVESUVIA%2B-.pdf'),
  toledo: source('Pizzeria Toledo', 'https://pizzeriatoledo.com/menu/'),
  bufalotta: source('La Bufalotta', 'https://www.labufalotta.it/it'),
  stua: source('Atmosfere La Stüa', 'https://www.atmosferelastua.it/smartmenu/delivery.html'),
  pomodori: source('Pizzeria Pomodorì', 'https://www.pizzeriapomodori.it/menu/'),
};

function recipe(slug, name, ingredients, evidence, variantNote) {
  return { id: `pizza-${slug}`, name, ingredients, checkedAt: topPizzaResearchDate,
    evidence: evidence.map(([sourceId, menuName]) => ({ sourceId, menuName })), variantNote };
}

export const topPizzaRecipes = [
  recipe('marinara-rinforzata', 'Marinara rinforzata',
    ['Pomodoro', 'Aglio', 'Origano', 'Capperi', 'Olive nere', 'Basilico', 'Acciughe', 'Pomodori confit'],
    [['kalo', 'Marinara rinforzata'], ['mafaldina', 'Marinara rinforzata']],
    'Versione 50 Kalò. La Mafaldina usa olive taggiasche e alici marinate, senza pomodori confit.'),
  recipe('provola-e-pepe', 'Provola e pepe',
    ['Pomodoro', 'Provola di bufala', 'Pepe nero', 'Basilico'],
    [['kalo', 'La mia provola di bufala e pepe'], ['notizia', 'Dop provola e pepe']],
    'Versione 50 Kalò con provola di bufala; La Notizia aggiunge pecorino. Provola generica, di bufala e affumicata restano distinte.'),
  recipe('scarpariello', 'Scarpariello',
    ['Pomodoro', 'Pomodorini del Piennolo', 'Pecorino', 'Peperoncino', 'Basilico'],
    [['notizia', 'Scarpariello'], ['kalo', 'Margherita Scarpariello']],
    'Versione La Notizia, senza mozzarella. La Margherita Scarpariello di 50 Kalò usa sugo di datterini, fior di latte, pecorino e parmigiano.'),
  recipe('filetto', 'Filetto',
    ['Pomodoro fresco', 'Provola di bufala', 'Grana Padano', 'Basilico'],
    [['notizia', 'Filetto'], ['vesuvia', 'Filetto di pomodorini freschi']],
    'Versione La Notizia: pomodorini tagliati a filetto. Vesuvia conferma il nome esteso con fior di latte e pomodorini, senza grana o basilico dichiarati.'),
  recipe('piennolo', 'Piennolo',
    ['Pomodorini del Piennolo gialli', 'Pomodorini del Piennolo rossi', 'Mozzarella bufala', 'Pecorino', 'Basilico'],
    [['notizia', 'Piennolo'], ['toledo', 'Piennolo']],
    'Versione La Notizia con i due colori espliciti e pecorino. Toledo indica pomodorini del Piennolo senza colore e non dichiara pecorino.'),
  recipe('nerano', 'Nerano',
    ['Crema di zucchine', 'Zucchine', 'Mozzarella', 'Provolone del Monaco', 'Basilico'],
    [['notizia', 'Nerano'], ['kalo', 'Nerano']],
    'Versione La Notizia con zucchine fritte e basilico. 50 Kalò conferma crema di zucchine, zucchine, fior di latte e provolone del Monaco; non dichiara basilico.'),
  recipe('bufala-e-crudo', 'Bufala e crudo',
    ['Mozzarella bufala', 'Prosciutto crudo'],
    [['kalo', 'Bufala e fiocco di crudo'], ['bufalotta', 'Bufala e crudo']],
    'Versione bianca di 50 Kalò. La Bufalotta conferma il nome, ma propone una base con pomodoro.'),
  recipe('san-daniele', 'San Daniele',
    ['Mozzarella bufala', 'Prosciutto crudo', 'Parmigiano', 'Basilico'],
    [['notizia', 'San Daniele'], ['stua', 'San Daniele']],
    'Versione La Notizia con crudo San Daniele e parmigiano in scaglie. La Stüa serve una pizza in pala con mozzarella, bufala e pomodorini, senza parmigiano o basilico dichiarati.'),
  recipe('cilentana', 'Cilentana',
    ['Pomodorini del Piennolo', 'Pomodoro', 'Cacioricotta', 'Pepe nero', 'Basilico'],
    [['notizia', 'Cilentana'], ['pomodori', 'Cilentana, la tradizionale cotta nel ruoto']],
    'Interpretazione La Notizia con piennolo, San Marzano e cacioricotta del Cilento. Pomodorì conferma il nome con pomodoro cotto e cacioricotta, nel ruoto. Non è una ricetta unica codificata.'),
  recipe('peperone-tonnato', 'Peperone tonnato',
    ['Peperoni', 'Provola affumicata', 'Uovo', 'Tonno', 'Glassa di peperone', 'Olio alla menta', 'Olio al peperoncino', 'Capperi', 'Bottarga di tonno', 'Prezzemolo'],
    [['confine', 'Peperone tonnato (napoletana)'], ['seu', 'Peperone tonnato']],
    'Versione Confine: peperone arrosto, battuto di uova e tonno rosso, glassa di peperone arrosto e bottarga di tonno rosso. Seu conferma il nome con fior di latte e salsa tonnata, olive taggiasche, peperone crusco e altre finiture; non se ne mescolano gli ingredienti.'),
];
