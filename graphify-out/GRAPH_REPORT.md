Nota di analisi: questa mappa descrive la versione iniziale (commit 55c0f53), precedente al refactor Vue/Tailwind. Non usarla come mappa della versione corrente. Estrazione semantica di index.html con ispezione supplementare di css/stile.css. Il rilevatore non include CSS nel conteggio. I conteggi dei token non sono disponibili tramite questa API; gli eventuali zeri del report sono segnaposto, non misure. Per problemi verificati e refactor, vedere ../docs/ANALISI-REFACTOR.md.

# Graph Report - E:\siti\2026 pizza\pizza  (2026-10-20)

## Corpus Check
- Corpus is ~1,294 words - fits in a single context window. You may not need a graph.

## Summary
- 23 nodes · 30 edges · 5 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Pagina e dipendenze|Pagina e dipendenze]]
- [[_COMMUNITY_Cataloghi e inizializzazione|Cataloghi e inizializzazione]]
- [[_COMMUNITY_Controlli e stile|Controlli e stile]]
- [[_COMMUNITY_Filtro delle pizze|Filtro delle pizze]]
- [[_COMMUNITY_Stato e aggiornamento|Stato e aggiornamento]]

## God Nodes (most connected - your core abstractions)
1. `Pizza selector HTML page` - 10 edges
2. `Inline initialization sorts catalogs and renders ingredient buttons` - 7 edges
3. `aggiorna appends selection and refreshes DOM` - 5 edges
4. `Ingredient buttons container #ingredienti` - 4 edges
5. `seleziona filters recipes requiring all selected ingredients` - 4 edges
6. `Local stylesheet css/stile.css` - 3 edges
7. `Resetta button inline click handler` - 3 edges
8. `resetta clears selection` - 3 edges
9. `Selected ingredients container #scelti` - 2 edges
10. `Pizza results container #pizze` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Pizza selector HTML page` --loads--> `Local stylesheet css/stile.css`  [EXTRACTED]
  index.html → css/stile.css
- `Ingredient buttons container #ingredienti` --generated_buttons_use_style_class--> `.quadrato fixed 140px ingredient buttons`  [EXTRACTED]
  index.html → css/stile.css
- `Resetta button inline click handler` --uses_style_class--> `.resetta margin and border styles`  [EXTRACTED]
  index.html → css/stile.css

## Import Cycles
- None detected.

## Communities (5 total, 0 thin omitted)

### Community 0 - "Pagina e dipendenze"
Cohesion: 0.40
Nodes (5): Bootstrap 4.0.0 CSS CDN, Bootstrap 4.0.0 JavaScript CDN, jQuery 3.2.1 slim CDN, Pizza selector HTML page, Popper 1.12.9 CDN

### Community 1 - "Cataloghi e inizializzazione"
Cohesion: 0.40
Nodes (5): listaIngredienti ingredient catalog, Inline initialization sorts catalogs and renders ingredient buttons, output HTML fragment array, ordinaIngredienti comparator, ordinaPizze comparator

### Community 2 - "Controlli e stile"
Cohesion: 0.40
Nodes (5): Ingredient buttons container #ingredienti, .quadrato fixed 140px ingredient buttons, Resetta button inline click handler, .resetta margin and border styles, Local stylesheet css/stile.css

### Community 3 - "Filtro delle pizze"
Cohesion: 0.50
Nodes (4): controlla exact ingredient membership, listaPizze pizza recipe catalog, Pizza results container #pizze, seleziona filters recipes requiring all selected ingredients

### Community 4 - "Stato e aggiornamento"
Cohesion: 0.67
Nodes (4): resetta clears selection, scelti selected ingredient state, Selected ingredients container #scelti, aggiorna appends selection and refreshes DOM

## Knowledge Gaps
- **9 isolated node(s):** `Bootstrap 4.0.0 CSS CDN`, `jQuery 3.2.1 slim CDN`, `Popper 1.12.9 CDN`, `Bootstrap 4.0.0 JavaScript CDN`, `output HTML fragment array` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Pizza selector HTML page` connect `Pagina e dipendenze` to `Cataloghi e inizializzazione`, `Controlli e stile`, `Filtro delle pizze`, `Stato e aggiornamento`?**
  _High betweenness centrality (0.559) - this node is a cross-community bridge._
- **Why does `Inline initialization sorts catalogs and renders ingredient buttons` connect `Cataloghi e inizializzazione` to `Pagina e dipendenze`, `Controlli e stile`, `Filtro delle pizze`?**
  _High betweenness centrality (0.383) - this node is a cross-community bridge._
- **Why does `aggiorna appends selection and refreshes DOM` connect `Stato e aggiornamento` to `Controlli e stile`, `Filtro delle pizze`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **What connects `Bootstrap 4.0.0 CSS CDN`, `jQuery 3.2.1 slim CDN`, `Popper 1.12.9 CDN` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
