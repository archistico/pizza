import { mkdir, writeFile } from 'node:fs/promises';
import { verifiedRecipes, recipeSources, researchDate } from '../js/verified-recipes.js';

const directory = new URL('../docs/', import.meta.url);
await mkdir(directory, { recursive: true });
const rows = verifiedRecipes.map((recipe, index) => {
  const links = recipe.evidence.map(({ sourceId, menuName }, position) => {
    const source = recipeSources[sourceId];
    return `${position === 0 ? '**Ricetta adottata:** ' : '**Conferma:** '}[${source.operator}](${source.url}) — ${menuName}`;
  }).join('<br>');
  return `| ${index + 1} | ${recipe.name} | ${recipe.ingredients.join(', ')} | ${links} | ${recipe.variantNote || 'Condimenti concordanti dopo la normalizzazione delle etichette.'} |`;
});
const content = `# 35 nuove pizze: ingredienti e riscontri nei menu

Ricerca del ${researchDate}. Il catalogo passa da 65 a 100 ricette.

## Criterio di selezione

Ogni nuova voce ha riscontri presso almeno due operatori indipendenti.
Due piattaforme, lingue o formati dello stesso locale contano come un solo
operatore. Sono stati usati menu dei locali o menu a essi attribuiti sulle
piattaforme di ordinazione/prenotazione. I link rimandano alla pagina specifica.

La prima fonte di ogni riga definisce il condimento inserito nel sito;
la seconda attesta il nome o il suo equivalente riconoscibile. Le differenze
sono esplicitate: non vengono mescolate ricette di locali diversi.
“4” e “Quattro”, cipolla/cipolle, alici/acciughe, zola/gorgonzola e l’ordine
degli ingredienti nel nome sono considerati equivalenti. Il nome originale
del menu è conservato accanto al link.

La verifica riguarda queste 35 aggiunte. Le 65 voci iniziali sono conservate
con gli stessi identificativi e non acquisiscono automaticamente questa verifica.
Le nuove combinazioni sono distinte da quelle iniziali: i semplici sinonimi
di ricette già presenti non sono contati come aggiunte.

## Ingredienti e normalizzazione

Gli elenchi descrivono i condimenti, come nel catalogo iniziale: impasto,
sale e olio di finitura non sono selettori. Pomodoro San Marzano/passata
diventano Pomodoro; fior di latte diventa Mozzarella; si omettono marche,
provenienze commerciali e prezzi. Non si aggiunge una mozzarella non dichiarata:
per esempio la Cosacca ne è priva e la Mortadella e pistacchio adottata usa provola.

Si mantengono distinti Ricotta/Ricotta salata, Uovo/Uovo sodo, Carciofi/Carciofini
e Olive generiche/Olive nere/Olive verdi. Il colore delle olive e la preparazione
dei carciofi non vengono dedotti quando il menu non li specifica.
Il menu da Ninni dichiara espressamente basilico e pinoli nella Pesto e patate.

## Elenco completo

| N. | Pizza | Ingredienti nel sito | Menu verificati | Varianti e scelta editoriale |
| --- | --- | --- | --- | --- |
${rows.join('\n')}

I dati e i riferimenti sono mantenuti in [verified-recipes.js](../js/verified-recipes.js).
Per rigenerare questo documento: \`npm run docs:recipes\`.
`;
await writeFile(new URL('RICETTE-VERIFICATE.md', directory), content, 'utf8');
console.log(`Documentate ${verifiedRecipes.length} ricette, con ${new Set(verifiedRecipes.flatMap(r => r.evidence.map(e => recipeSources[e.sourceId].operator))).size} operatori.`);
await import('./build-top-pizza-report.mjs');
