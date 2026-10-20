import { originalRecipes, originalIngredients } from './catalog.js';
import { verifiedRecipes } from './verified-recipes.js';
import { topPizzaRecipes } from './top-pizza-recipes.js';
import { ingredientRecipes } from './ingredient-recipes.js';

export const categories = [
  { id: 'all', label: 'Tutti', icon: 'spark' },
  { id: 'vegetables', label: 'Verdure', icon: 'tomato' },
  { id: 'cheese', label: 'Formaggi', icon: 'cheese' },
  { id: 'meat', label: 'Salumi', icon: 'sausage' },
  { id: 'sea', label: 'Mare', icon: 'fish' },
  { id: 'extra', label: 'Extra', icon: 'egg' },
];

export function ingredientId(name) {
  return (name === 'Cipolla' ? 'Cipolle' : name)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const groups = {
  vegetables: {
    'Aglio': 'garlic', 'Aneto': 'leaf', 'Basilico': 'leaf',
    'Capperi': 'olive', 'Carciofini': 'artichoke', 'Cipolle': 'onion',
    'Fiori di zucca': 'flower', 'Friarielli': 'broccoli', 'Funghi': 'mushroom',
    'Funghi porcini': 'mushroom', 'Mais': 'corn', 'Melanzane': 'eggplant',
    'Olive nere': 'olive-dark', 'Olive verdi': 'olive', 'Origano': 'leaf',
    'Patate': 'potato', 'Peperoni': 'pepper', 'Piselli': 'peas',
    'Pomodori secchi': 'tomato', 'Pomodoro': 'tomato',
    'Pomodoro datterino': 'tomato', 'Pomodoro fresco': 'tomato',
    'Prezzemolo': 'leaf', 'Radicchio': 'radicchio', 'Rosmarino': 'rosemary',
    'Rucola': 'leaf', 'Spinaci': 'leaf', 'Zucchine': 'zucchini',
    'Carciofi': 'artichoke', 'Olive': 'olive-mixed', 'Asparagi': 'asparagus',
    'Pomodori confit': 'tomato', 'Pomodorini del Piennolo': 'tomato',
    'Pomodorini del Piennolo gialli': 'tomato-yellow',
    'Pomodorini del Piennolo rossi': 'tomato', 'Peperoncino': 'chili',
    'Crema di zucchine': 'zucchini',
  },
  cheese: {
    'Brie': 'cheese', 'Caciotta': 'cheese', 'Gorgonzola': 'blue-cheese',
    'Grana Padano': 'cheese', 'Mozzarella': 'mozzarella',
    'Mozzarella bufala': 'mozzarella', 'Parmigiano': 'cheese',
    'Pecorino': 'cheese', 'Provola': 'provola', 'Ricotta': 'ricotta',
    'Stracchino': 'mozzarella', 'Ricotta salata': 'cheese', 'Fontina': 'cheese',
    'Mascarpone': 'ricotta',
    'Provola di bufala': 'provola', 'Provola affumicata': 'provola',
    'Provolone del Monaco': 'cheese', 'Cacioricotta': 'cheese',
  },
  meat: {
    'Bresaola': 'meat', 'Lardo': 'bacon', 'Nduja': 'spicy', 'Pancetta': 'bacon',
    'Prosciutto cotto': 'ham', 'Prosciutto crudo': 'ham', 'Salame': 'salami',
    'Salame piccante': 'spicy', 'Salsiccia': 'sausage', 'Speck': 'bacon',
    'Wurstel': 'sausage', 'Guanciale': 'bacon', 'Mortadella': 'mortadella',
  },
  sea: {
    'Acciughe': 'fish', 'Frutti di mare': 'shell', 'Gamberetti': 'shrimp',
    'Salmone': 'salmon', 'Tonno': 'fish',
    'Bottarga di tonno': 'bottarga',
  },
  extra: {
    'Ananas': 'pineapple', 'Crocché': 'croquette', 'Fagioli': 'beans',
    'Noci': 'walnut', 'Panna': 'cream', 'Patatine fritte': 'fries',
    'Pere': 'pear', 'Pesto': 'pesto', 'Pinoli': 'nuts',
    'Pistacchio': 'nuts', 'Uovo': 'egg', 'Uovo sodo': 'boiled-egg',
    'Maionese': 'mayonnaise', 'Pepe nero': 'peppercorns',
    'Glassa di peperone': 'cream', 'Olio alla menta': 'herb-oil',
    'Olio al peperoncino': 'chili-oil',
  },
};

const allRecipes = [...originalRecipes, ...verifiedRecipes, ...topPizzaRecipes, ...ingredientRecipes];
const names = [...new Set([...originalIngredients, ...allRecipes.flatMap(p => p.ingredients)]
  .map(name => name === 'Cipolla' ? 'Cipolle' : name))];

export const pizzas = allRecipes.map((pizza, index) => ({
  id: pizza.id ?? `pizza-${index + 1}`,
  name: pizza.name,
  ingredientIds: [...new Set(pizza.ingredients.map(ingredientId))],
  ...(pizza.evidence ? { evidence: pizza.evidence, variantNote: pizza.variantNote } : {}),
}));

export const ingredients = names.map(name => {
  const category = Object.keys(groups).find(group => Object.hasOwn(groups[group], name));
  if (!category) throw new Error(`Ingrediente senza categoria: ${name}`);
  const id = ingredientId(name);
  return { id, name, category, icon: groups[category][name],
    recipeCount: pizzas.filter(pizza => pizza.ingredientIds.includes(id)).length };
}).sort((a, b) => a.name.localeCompare(b.name, 'it'));

export const ingredientMap = Object.fromEntries(ingredients.map(item => [item.id, item]));
export const popularIds = [
  'pomodoro', 'mozzarella', 'basilico', 'funghi', 'prosciutto-cotto', 'salame-piccante',
  'salsiccia', 'olive-nere', 'cipolle', 'gorgonzola', 'rucola', 'peperoni',
  'prosciutto-crudo', 'patatine-fritte', 'tonno', 'mozzarella-bufala', 'zucchine', 'ananas',
];
