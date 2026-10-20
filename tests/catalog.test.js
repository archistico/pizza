import test from 'node:test';
import assert from 'node:assert/strict';
import { originalRecipes } from '../js/catalog.js';
import { verifiedRecipes, recipeSources } from '../js/verified-recipes.js';
import { topPizzaRecipes, topPizzaSources } from '../js/top-pizza-recipes.js';
import { ingredientRecipes, ingredientRecipeSources } from '../js/ingredient-recipes.js';
import { pizzas, ingredientId, ingredientMap } from '../js/data.js';
import { filterPizzas } from '../js/filters.js';

const normalizeName = name => name.toLocaleLowerCase('it').trim();
const recipeKey = ids => [...ids].sort().join('|');

test('le nuove ricette sono almeno 35, con nomi e combinazioni nuovi rispetto al catalogo iniziale', () => {
  assert.equal(originalRecipes.length, 65);
  assert(verifiedRecipes.length >= 35);
  const names = new Set(originalRecipes.map(p => normalizeName(p.name)));
  const combinations = new Set(originalRecipes.map(p => recipeKey(p.ingredients.map(ingredientId))));
  for (const recipe of [...verifiedRecipes, ...topPizzaRecipes, ...ingredientRecipes]) {
    assert(!names.has(normalizeName(recipe.name)), `Nome già presente: ${recipe.name}`);
    const key = recipeKey(recipe.ingredients.map(ingredientId));
    assert(!combinations.has(key), `Ricetta duplicata: ${recipe.name}`);
    names.add(normalizeName(recipe.name));
    combinations.add(key);
  }
});

test('ogni nuova ricetta riporta almeno due operatori distinti, URL e nomi effettivi nei menu', () => {
  const allSources = { ...recipeSources, ...topPizzaSources, ...ingredientRecipeSources };
  for (const recipe of [...verifiedRecipes, ...topPizzaRecipes, ...ingredientRecipes]) {
    assert(recipe.id.startsWith('pizza-'));
    assert.equal(recipe.checkedAt, '2026-10-20');
    assert(recipe.evidence.length >= 2, recipe.name);
    const operators = new Set();
    const urls = new Set();
    for (const evidence of recipe.evidence) {
      const source = allSources[evidence.sourceId];
      assert(source, `${recipe.name}: fonte inesistente`);
      assert.equal(new URL(source.url).protocol, 'https:');
      assert(evidence.menuName.trim().length > 0);
      operators.add(source.operator);
      urls.add(source.url);
    }
    assert(operators.size >= 2, recipe.name);
    assert(urls.size >= 2, recipe.name);
  }
});

test('le aggiunte dalla classifica usano una prima fonte ufficiale classificata nel 2025', () => {
  assert.equal(topPizzaRecipes.length, 10);
  for (const recipe of topPizzaRecipes) {
    const source = topPizzaSources[recipe.evidence[0].sourceId];
    assert(Number.isInteger(source.rank2025) && source.rank2025 > 0);
    assert.equal(new URL(source.officialPage).hostname.replace(/^www\./, ''), new URL(source.url).hostname.replace(/^www\./, ''));
    assert(recipe.variantNote.length > 0);
  }
  assert.deepEqual(filterPizzas(pizzas, ['crema-di-zucchine', 'provolone-del-monaco']).map(p => p.name), ['Nerano']);
  assert.deepEqual(filterPizzas(pizzas, ['provola-di-bufala', 'pepe-nero']).map(p => p.name), ['Provola e pepe']);
  assert.deepEqual(filterPizzas(pizzas, ['bottarga-di-tonno', 'tonno']).map(p => p.name), ['Peperone tonnato']);
  assert(!pizzas.find(p => p.name === 'Scarpariello').ingredientIds.includes('mozzarella'));
  assert.notEqual(ingredientId('Provola'), ingredientId('Provola di bufala'));
  assert.notEqual(ingredientId('Provola affumicata'), ingredientId('Provola di bufala'));
});

test('le 65 ricette iniziali mantengono identificativi, nomi e ingredienti', () => {
  originalRecipes.forEach((recipe, index) => {
    const pizza = pizzas.find(p => p.id === `pizza-${index + 1}`);
    assert.equal(pizza.name, recipe.name);
    assert.deepEqual(pizza.ingredientIds, recipe.ingredients.map(ingredientId));
  });
});

test('nuovi ingredienti e preparazioni rimangono distinguibili nei filtri', () => {
  assert.deepEqual(filterPizzas(pizzas, ['uovo-sodo', 'maionese']).map(p => p.name).sort(), ['Rossiccia', 'Rossini']);
  assert.deepEqual(filterPizzas(pizzas, ['guanciale', 'pepe-nero']).map(p => p.name), ['Gricia']);
  assert.deepEqual(filterPizzas(pizzas, ['ricotta-salata']).map(p => p.name), ['Norma']);
  assert.deepEqual(filterPizzas(pizzas, ['mascarpone']).map(p => p.name).sort(), ['Crudo e mascarpone', 'Speck e mascarpone']);
  assert(ingredientMap['olive'].recipeCount > 0);
  assert(ingredientMap['olive-nere'].recipeCount > 0);
  assert.notEqual(ingredientId('Carciofi'), ingredientId('Carciofini'));
  assert.notEqual(ingredientId('Uovo'), ingredientId('Uovo sodo'));
});
