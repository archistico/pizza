// Integrazione degli ingredienti rimasti senza ricette; menu ufficiali consultati.
export const ingredientResearchDate = '2026-10-20';
const source = (operator, url) => ({ operator, url, checkedAt: ingredientResearchDate });

export const ingredientRecipeSources = {
  favorita: source('La Favorita, Porto Viro', 'https://www.lafavoritaportoviro.it/menu-pizzeria/'),
  capannaBianca: source('Capanna Bianca', 'https://www.ristopizzacapannabianca.it/wp-content/uploads/MENU-PIZZE-BASSA.pdf'),
  fuata: source('La Fuata, Genova', 'https://pizzeria-la-fuata.it/'),
  spera: source('Pizzeria Spera, Firenze', 'https://www.pizzeriaspera.it/le-nostre-pizze/'),
};

export const ingredientRecipes = [
  {
    id: 'pizza-tre-p', name: 'Tre P',
    ingredients: ['Pomodoro', 'Mozzarella', 'Panna', 'Prosciutto cotto', 'Piselli'],
    checkedAt: ingredientResearchDate,
    evidence: [{ sourceId: 'favorita', menuName: 'Tre P' }, { sourceId: 'capannaBianca', menuName: 'Le tre P' }],
    variantNote: 'Versione La Favorita, confermata da Capanna Bianca con gli stessi cinque condimenti. Le tre P indicano panna, prosciutto e piselli: altre pizze con questo nome possono avere ingredienti diversi.',
  },
  {
    id: 'pizza-pomodori-secchi', name: 'Pomodori secchi',
    ingredients: ['Pomodoro', 'Mozzarella', 'Pomodori secchi', 'Rucola'],
    checkedAt: ingredientResearchDate,
    evidence: [{ sourceId: 'fuata', menuName: 'Pomodori Secchi' }, { sourceId: 'spera', menuName: 'Pomodori secchi' }],
    variantNote: 'Versione rossa di La Fuata con rucola. Spera conferma il nome in versione bianca, con pomodori secchi a fine cottura; il suo menu dichiara basilico su tutte le pizze. Le due versioni non vengono mescolate.',
  },
];
