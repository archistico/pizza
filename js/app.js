import { categories, ingredients, ingredientMap, pizzas, popularIds } from './data.js';
import { filterPizzas, filterIngredients, toggleIngredient, getAvailableIngredientIds } from './filters.js';
import { loadVue } from './vue-loader.js';

const IngredientIcon = {
  props: ['name'],
  template: '<svg viewBox="0 0 80 80" fill="none" stroke="#403b2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><use :href="`assets/ingredients.svg#${name}`"></use></svg>',
};

const PizzaArt = {
  props: { ingredientIds: { type: Array, default: () => ['pomodoro', 'mozzarella', 'basilico'] } },
  computed: {
    red() { return this.ingredientIds.some(id => id.startsWith('pomodor')); },
    leafy() { return this.ingredientIds.some(id => ['basilico', 'rucola', 'friarielli', 'spinaci', 'rosmarino', 'origano'].includes(id)); },
    meat() { return this.ingredientIds.some(id => ingredientMap[id]?.category === 'meat'); },
    cheese() { return this.ingredientIds.some(id => ingredientMap[id]?.category === 'cheese'); },
    mushrooms() { return this.ingredientIds.some(id => id.startsWith('funghi')); },
  },
  template: `
    <svg viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <ellipse cx="151" cy="162" rx="123" ry="122" fill="#473325" opacity=".12"/>
      <circle cx="150" cy="150" r="124" fill="#eab86d" stroke="#c47f39" stroke-width="2"/>
      <circle cx="150" cy="150" r="108" fill="#f3cd89"/>
      <circle cx="150" cy="150" r="100" :fill="red ? '#d84e35' : '#f5d891'"/>
      <path d="M69 115Q79 64 128 58M180 54Q228 68 241 108M243 190Q225 233 180 246M116 244Q70 228 54 181" stroke="#ffe0a8" stroke-width="8" fill="none" stroke-linecap="round"/>
      <g fill="#b57635" opacity=".8"><ellipse cx="68" cy="80" rx="4" ry="2" transform="rotate(-44 68 80)"/><ellipse cx="207" cy="48" rx="4" ry="2"/><ellipse cx="257" cy="157" rx="2" ry="4"/><ellipse cx="99" cy="253" rx="4" ry="2"/><ellipse cx="45" cy="144" rx="2" ry="4"/><ellipse cx="213" cy="246" rx="5" ry="2"/></g>
      <g v-if="cheese" fill="#fff0bc"><path d="M83 105q12-23 36-8t8 34q-24 18-39 0t-5-26"/><path d="M176 80q23-9 34 13t-8 32q-28 8-31-13t5-32"/><path d="M128 162q19-14 36 2t-1 36q-23 14-37-5t2-33"/><path d="M194 184q14-17 28-6t6 30q-14 18-29 6t-5-30"/><path d="M76 185q10-15 24-7t8 23q-10 15-25 9t-7-25"/></g>
      <g v-if="meat" fill="#ad332b" stroke="#d36c4b" stroke-width="3"><circle cx="112" cy="86" r="17"/><circle cx="207" cy="147" r="18"/><circle cx="105" cy="203" r="17"/><circle cx="144" cy="137" r="17"/></g>
      <g v-if="mushrooms" fill="#dfc29b" stroke="#775641" stroke-width="2"><path d="M73 146q0-23 19-23t19 23h-15v16h-9v-16z"/><path d="M162 212q0-23 19-23t19 23h-15v16h-9v-16z"/></g>
      <g v-if="leafy" fill="#497247" stroke="#2c5838" stroke-width="1.5"><path d="M139 92q-23-23-25 3 6 24 25-3z"/><path d="M193 157q27-16 27 9-9 23-27-9z"/><path d="M122 203q-15 25-27 5-10-26 27-5z"/><path d="M151 166q9-31 26-12 12 24-26 12z"/></g>
      <g fill="#cf8a37" opacity=".5"><circle cx="154" cy="65" r="3"/><circle cx="71" cy="158" r="3"/><circle cx="171" cy="224" r="3"/><circle cx="227" cy="112" r="3"/><circle cx="137" cy="233" r="2"/></g>
    </svg>`,
};

const boot = () => {
  window.Vue.createApp({
    components: { IngredientIcon, PizzaArt },
    data: () => ({ categories, ingredients, ingredientMap, selectedIds: [], query: '',
      category: 'all', expanded: false, resultLimit: 6, suggestedId: null, pizzas }),
    computed: {
      selectedIngredients() { return this.selectedIds.map(id => ingredientMap[id]); },
      availableIngredientIds() { return getAvailableIngredientIds(this.matchingPizzas, this.selectedIds); },
      matchingPizzas() {
        const matches = filterPizzas(pizzas, this.selectedIds);
        const featured = ['Margherita', 'Diavola', 'Boscaiola', 'Ortolana', 'Bufala', 'Quattro formaggi'];
        return matches.sort((a, b) => {
          if (this.suggestedId) {
            if (a.id === this.suggestedId) return -1;
            if (b.id === this.suggestedId) return 1;
          }
          const ai = featured.indexOf(a.name), bi = featured.indexOf(b.name);
          return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.name.localeCompare(b.name, 'it');
        });
      },
      shownPizzas() { return this.matchingPizzas.slice(0, this.resultLimit); },
      filteredIngredients() {
        return filterIngredients(ingredients, this.query, this.category).sort((a, b) => {
          const ai = popularIds.indexOf(a.id), bi = popularIds.indexOf(b.id);
          return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.name.localeCompare(b.name, 'it');
        });
      },
      shownIngredients() {
        return this.expanded || this.query || this.category !== 'all'
          ? this.filteredIngredients : this.filteredIngredients.slice(0, 18);
      },
      canExpand() { return !this.expanded && !this.query && this.category === 'all' && this.filteredIngredients.length > 18; },
    },
    methods: {
      toggle(id) {
        if (!ingredientMap[id] || !this.availableIngredientIds.has(id)) return;
        this.selectedIds = toggleIngredient(this.selectedIds, id);
        this.resultLimit = 6;
        this.suggestedId = null;
      },
      reset() {
        this.selectedIds = [];
        this.query = '';
        this.category = 'all';
        this.expanded = false;
        this.resultLimit = 6;
        this.suggestedId = null;
      },
      surprise() {
        const matches = this.matchingPizzas;
        if (!matches.length) return;
        const alternatives = matches.length > 1 ? matches.filter(p => p.id !== this.suggestedId) : matches;
        this.suggestedId = alternatives[Math.floor(Math.random() * alternatives.length)].id;
        document.getElementById('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      },
    },
  }).mount('#app');
  document.getElementById('loading').hidden = true;
};

try {
  await loadVue();
  boot();
} catch (error) {
  document.getElementById('loading').hidden = true;
  document.getElementById('load-error').hidden = false;
  console.error(error);
}
