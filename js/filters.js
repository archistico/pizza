export function normalizeSearch(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it').trim();
}

export function filterPizzas(pizzas, selectedIds) {
  return pizzas.filter(pizza => selectedIds.every(id => pizza.ingredientIds.includes(id)));
}

export function getAvailableIngredientIds(matchingPizzas, selectedIds = []) {
  return new Set([...selectedIds, ...matchingPizzas.flatMap(pizza => pizza.ingredientIds)]);
}

export function filterIngredients(ingredients, query, category = 'all') {
  const search = normalizeSearch(query);
  return ingredients.filter(item => (category === 'all' || item.category === category)
    && normalizeSearch(item.name).includes(search));
}

export function toggleIngredient(selectedIds, id) {
  return selectedIds.includes(id) ? selectedIds.filter(item => item !== id) : [...selectedIds, id];
}
