import { writeFile } from 'node:fs/promises';
import { topPizzaRecipes, topPizzaSources, topPizzaResearchDate, rankingUrl } from '../js/top-pizza-recipes.js';

const rows = topPizzaRecipes.map(recipe => {
  const evidence = recipe.evidence.map(({ sourceId, menuName }, index) => {
    const source = topPizzaSources[sourceId];
    const rank = source.rank2025 ? `; posizione ${source.rank2025} Italia 2025` : '; secondo operatore, fuori dal campione classificato';
    return `**${index ? 'Riscontro' : 'Versione adottata'}:** [${source.operator}](${source.url})${rank} — ${menuName}`;
  }).join('<br>');
  return `| ${recipe.name} | ${recipe.ingredients.join(', ')} | ${evidence} | ${recipe.variantNote} |`;
});

const content = `# Ricette dai siti dei locali di 50 Top Pizza Italia 2025

Consultazione: **${topPizzaResearchDate}**. Riferimento: [classifica indicata dall’utente](${rankingUrl}) e [annuncio ufficiale con graduatoria](https://www.50toppizza.it/50-top-pizza-italia-2025-i-masanielli-di-francesco-martucci-e-la-migliore-pizzeria-in-italia/).

Questo lotto aggiunge **${topPizzaRecipes.length} ricette** alle precedenti 100: al suo inserimento il catalogo raggiunge **110 pizze e 91 ingredienti**. Le precedenti 100 voci mantengono identificativi e ingredienti. La successiva integrazione è descritta in [RICETTE-INGREDIENTI.md](RICETTE-INGREDIENTI.md); i totali correnti sono nel README.

## Metodo e limiti

La classifica serve a scegliere i locali, non a datare le ricette. I menu sono quelli disponibili al momento della consultazione; non sono presentati come menu del 2025. Non è un censimento completo di tutti i locali della graduatoria.

Ogni nuova ricetta ha almeno due operatori indipendenti. La prima fonte è sempre un menu sul sito ufficiale di un locale classificato; la seconda attesta il nome o il suo equivalente descrittivo e può appartenere a un locale esterno alla classifica. Non si contano due sedi o due piattaforme dello stesso operatore come due riscontri. Avere due riscontri non significa che una pizza sia diffusa in tutta Italia.

La ricetta inserita corrisponde alla prima fonte: le differenze della seconda sono annotate, senza crearne una media. I nomi estesi dei menu sono conservati nelle evidenze. Per esempio “Provola e pepe” raggruppa le denominazioni estese che nominano esplicitamente quel condimento.

Il PDF di [50 Kalò](https://www.50kalo.it/le_pizze.php) è quello collegato dal sito al momento della ricerca: contiene “2023” nel nome del file, che da solo non dimostra l’anno del contenuto. Il PDF di La Notizia reca “aggiornamento Aprile 2026” e si trova nella cartella giugno 2026. I menu sono modificabili e alcune pizze sono stagionali. Il menu La Stüa è riscontrato anche nell’indice del motore di ricerca: il lettore web ha restituito 403; non gli si attribuisce una data di aggiornamento non dichiarata.

## Le aggiunte

| Pizza | Ingredienti nel selettore | Fonti ufficiali e nome nel menu | Versione e differenze |
| --- | --- | --- | --- |
${rows.join('\n')}

## Ingredienti e preparazioni

Fior di latte viene indicato come Mozzarella; San Marzano come Pomodoro; alici come Acciughe. Marche, stagionature, prezzi, impasto, sale e olio extravergine semplice non sono filtri. Il crudo San Daniele rimane Prosciutto crudo nel selettore, con la specifica nella nota. Il pomodorino a filetto rimane Pomodoro fresco; per il Piennolo si conserva invece la varietà dichiarata, senza inventare un colore quando non è indicato.

Le 14 nuove etichette sono: Pomodori confit, Pomodorini del Piennolo, Pomodorini del Piennolo gialli, Pomodorini del Piennolo rossi, Peperoncino, Crema di zucchine, Provola di bufala, Provola affumicata, Provolone del Monaco, Cacioricotta, Bottarga di tonno, Glassa di peperone, Olio alla menta, Olio al peperoncino. Tutte hanno categoria, icona locale e almeno una ricetta.

Si conserva la distinzione tra crema e ortaggio e tra le tre etichette di provola. Nella Nerano le zucchine intere sono fritte, come specificato nella nota. Nel Peperone tonnato di Confine Uovo e Tonno compongono il battuto; Peperoni indica il peperone arrosto. Glassa, bottarga e oli aromatici rimangono selettori separati perché danno identità alla ricetta. Il menu non specifica la cottura dell’uovo del battuto: non viene trasformato in Uovo sodo. Le finiture di Seu non vengono aggiunte alla versione Confine.

Il Prezzemolo, già nel catalogo, diventa selezionabile grazie a questa ricetta. Al termine di questo lotto Piselli e Pomodori secchi restano senza ricette; vengono poi coperti dall’integrazione documentata in [RICETTE-INGREDIENTI.md](RICETTE-INGREDIENTI.md). I filtri richiedono l’etichetta selezionata: non deducono automaticamente gli ingredienti delle creme o le relazioni tra varietà di pomodoro/formaggio.

## Altri menu consultati e candidati conservati per ulteriori verifiche

- [Sasà Martucci / I Masanielli, Caserta — posizione 11](https://www.sasaimasanielli.it/pizze-it/): conferma un’ulteriore interpretazione di Provola e pepe, con provola affumicata e tre cotture. Non viene aggiunta come seconda pizza; Ammiraglia e Matese restano fuori dal lotto in assenza di un secondo riscontro verificato per lo stesso nome.
- [Pepe in Grani, Caiazzo — posizione 25](https://www.pepeingrani.it/menu): consultati classici e pizze originali sul menu HTML ufficiale. Margherita sbagliata, Scarpetta e Alletterata non vengono aggiunte sulla sola attestazione di questo operatore. Calzoni e pizze fritte richiederebbero anche una rappresentazione esplicita del formato e della cottura nel catalogo.
- [Seu Pizza Illuminati, Roma — posizione 3](https://www.seupizza.com/menu.pdf): oltre al riscontro Peperone tonnato, conferma Bufala e Fiori e alici già presenti. Angurinara e le altre creazioni personali non sono inserite senza ulteriore riscontro. Bufala pomodorini crudo resta candidata: la ricerca non ha verificato un secondo nome equivalente abbastanza preciso da contarla come nuova voce.
- [Confine, Milano — posizione 2 ex aequo](https://confinemilano.it/pizza/degustazione/): il Peperone tonnato ha un secondo riscontro indipendente nello stesso nome da Seu. La presenza dello stesso nome non comporta la stessa composizione.

La ricerca ha esplorato anche i siti di Francesco Martucci, Diego Vitagliano, I Tigli, Da Lioniello e Clementina; i percorsi consultati non hanno prodotto ulteriori aggiunte che soddisfacessero insieme novità, ingredienti leggibili e secondo riscontro. Non si attribuiscono ricette a menu non letti integralmente.

Le evidenze sono in [top-pizza-recipes.js](../js/top-pizza-recipes.js). Il lotto precedente di 35 ricette è documentato separatamente in [RICETTE-VERIFICATE.md](RICETTE-VERIFICATE.md), che conserva i totali storici del suo inserimento. Rigenerazione di entrambi: \`npm run docs:recipes\`.
`;
await writeFile(new URL('../docs/RICETTE-50-TOP-PIZZA.md', import.meta.url), content, 'utf8');
console.log(`Documentate ${topPizzaRecipes.length} aggiunte da menu ufficiali di locali classificati nel 2025.`);
