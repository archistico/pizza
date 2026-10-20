import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ingredients, ingredientMap, pizzas, ingredientId } from '../js/data.js';
import { filterPizzas, filterIngredients, toggleIngredient, getAvailableIngredientIds } from '../js/filters.js';

test('catalogo conservato e riferimenti coerenti anche con nomi di pizza duplicati', () => {
  assert.equal(pizzas.length, 112);
  assert.equal(ingredients.length, 91);
  assert.equal(new Set(pizzas.map(p => p.id)).size, 112);
  assert.equal(new Set(ingredients.map(i => i.id)).size, 91);
  assert.equal(pizzas.filter(p => p.name === 'Regina').length, 2);
  assert.deepEqual(ingredients.filter(i => !i.recipeCount).map(i => i.name), []);
  assert.deepEqual(filterPizzas(pizzas, ['piselli', 'panna', 'prosciutto-cotto']).map(p => p.name), ['Tre P']);
  assert.deepEqual(filterPizzas(pizzas, ['pomodori-secchi', 'rucola']).map(p => p.name), ['Pomodori secchi']);
  for (const pizza of pizzas) {
    assert(pizza.ingredientIds.length > 0);
    for (const id of pizza.ingredientIds) assert(ingredientMap[id], `${pizza.name}: ${id}`);
  }
});

test('nessuna selezione mostra tutto il catalogo; il filtro richiede tutti gli ingredienti', () => {
  assert.equal(filterPizzas(pizzas, []).length, 112);
  const matches = filterPizzas(pizzas, ['pomodoro', 'mozzarella']);
  assert.equal(matches.length, 62);
  assert(matches.some(p => p.name === 'Margherita'));
  assert(matches.some(p => p.name === 'Diavola'));
  assert(!matches.some(p => p.name === 'Marinara'));
  assert.equal(filterPizzas(pizzas, ['ananas', 'aneto']).length, 0);
  assert.equal(filterPizzas(pizzas, ['not-an-ingredient']).length, 0);
});

test('cipolle include la Calabrese e gli ingredienti mancanti sono selezionabili', () => {
  assert.equal(ingredientId('Cipolla'), ingredientId('Cipolle'));
  assert(filterPizzas(pizzas, ['cipolle']).some(p => p.name === 'Calabrese'));
  assert(filterPizzas(pizzas, ['zucchine']).some(p => p.name === 'Ortolana'));
  assert.deepEqual(filterPizzas(pizzas, ['crocche']).map(p => p.name), ['Cafona']);
});

test('selezione reversibile senza duplicati e senza mutare lo stato precedente', () => {
  const initial = [];
  const selected = toggleIngredient(initial, 'pomodoro');
  assert.deepEqual(initial, []);
  assert.deepEqual(selected, ['pomodoro']);
  assert.deepEqual(toggleIngredient(selected, 'pomodoro'), []);
  assert.deepEqual(selected, ['pomodoro']);
});

test('compatibilità calcolata sul mix completo e ripristinata dopo rimozione o reset', () => {
  // C compare sia con A sia con B, ma nessuna pizza contiene A, B e C insieme.
  const recipes = [
    { ingredientIds: ['a', 'b', 'd'] },
    { ingredientIds: ['a', 'c'] },
    { ingredientIds: ['b', 'c'] },
  ];
  const available = ids => getAvailableIngredientIds(filterPizzas(recipes, ids), ids);
  assert.deepEqual([...available([])].sort(), ['a', 'b', 'c', 'd']);
  assert(available(['a']).has('c'));
  assert(available(['b']).has('c'));
  assert.deepEqual([...available(['a', 'b'])].sort(), ['a', 'b', 'd']);
  assert(available(toggleIngredient(['a', 'b'], 'b')).has('c'));
  // Anche un eventuale mix senza risultati deve poter essere svuotato.
  assert.deepEqual([...available(['a', 'b', 'c'])].sort(), ['a', 'b', 'c']);
});

test('ricerca tollera accenti, maiuscole e spazi e rispetta la categoria', () => {
  assert.deepEqual(filterIngredients(ingredients, ' CROCCHE ').map(i => i.name), ['Crocché']);
  assert.equal(filterIngredients(ingredients, 'mozzarella', 'cheese').length, 2);
  assert.equal(filterIngredients(ingredients, 'mozzarella', 'sea').length, 0);
  assert.equal(filterIngredients(ingredients, 'inesistente').length, 0);
});

test('ogni ingrediente ha un simbolo illustrato nel file SVG locale', async () => {
  const svg = await readFile(new URL('../assets/ingredients.svg', import.meta.url), 'utf8');
  const symbols = new Set([...svg.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]));
  for (const ingredient of ingredients) assert(symbols.has(ingredient.icon), ingredient.name);
});
