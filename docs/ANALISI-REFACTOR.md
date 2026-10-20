# Analisi della pagina e proposta di refactor

Analisi del 20 ottobre 2026, sul commit iniziale `55c0f53`.

## Stato attuale

Il progetto è una pagina statica: `index.html` contiene markup, catalogo,
stato della selezione e funzioni JavaScript; `css/stile.css` contiene due regole.
Non sono presenti backend, procedura di build o test nel repository iniziale.

La pagina carica Bootstrap 4.0.0, jQuery slim 3.2.1 e Popper 1.12.9 da CDN.
Il codice applicativo usa direttamente il DOM: non richiede jQuery, Popper
o i componenti JavaScript di Bootstrap.

Sono presenti **65 ricette e 64 ingredienti selezionabili**. Le ricette
usano 61 denominazioni distinte, prima di normalizzare gli alias.

Il flusso è:

`clic ingrediente → aggiorna() → scelti.push() → seleziona() → controlla() → innerHTML`

`resetta()` svuota la selezione e richiama `aggiorna()`.

Il filtro cerca pizze che contengono **tutti** gli ingredienti scelti.
Ammette altri ingredienti nella ricetta: scegliere Pomodoro e Mozzarella
non significa richiedere una pizza composta soltanto da questi due ingredienti.
È una regola sensata da conservare come comportamento predefinito.

## Problemi verificati

| Area | Evidenza | Conseguenza |
| --- | --- | --- |
| Selezione | `aggiorna()` aggiunge sempre l'ingrediente | Clic ripetuti producono duplicati nel riepilogo. |
| Rimozione | Esiste soltanto il reset completo | Non si può correggere una singola scelta. |
| Avvio e reset | Nessun risultato iniziale; con selezione vuota il filtro restituisce un paragrafo vuoto | L'utente non vede il catalogo e non riceve indicazioni. |
| Nessun risultato | Viene scritto soltanto `<p></p>` | Una combinazione impossibile non ha un messaggio esplicativo. |
| Catalogo | Zucchine e Crocché sono nelle ricette, assenti dai pulsanti | Questi ingredienti non si possono selezionare. |
| Alias | Calabrese usa Cipolla; il selettore offre Cipolle | Il filtro per Cipolle esclude la Calabrese. |
| Ingredienti senza ricette | Pinoli, Piselli, Pomodori secchi, Prezzemolo, Spinaci, Stracchino | Selezionarli non può restituire risultati nel catalogo attuale. |
| Identità delle pizze | Due ricette diverse si chiamano Regina | Il nome non può essere usato come identificativo univoco. |
| Ricette equivalenti | Basilico e Margherita hanno gli stessi ingredienti | Possibile alias da esplicitare; non eliminare automaticamente una voce. |
| Interfaccia | Pulsanti fissi di 140 × 140 px, senza indicazione persistente della selezione | Molto spazio occupato e difficile lettura delle scelte. |
| Accessibilità | `lang="en"`, titoli a partire da `h3`, nessuno stato premuto sui pulsanti o annuncio dei risultati | Lingua e cambiamenti dell'interfaccia non sono descritti correttamente. |
| Manutenzione | Stringhe HTML, eventi inline e dati nello stesso script | Modificare una funzione richiede intervenire anche sul rendering. |

La regola del filtro funziona per selezioni non vuote; la sua implementazione
può diventare una funzione pura con `filter`, `every` e `includes`.
L'ordinamento attuale modifica gli array originali e usa confronti lessicografici;
per le etichette italiane è preferibile una copia ordinata con `localeCompare`.

La lettura UTF-8 conferma che “Crocché” è corretto nel file: l'eventuale testo
alterato mostrato dal terminale non è un difetto del sorgente.

## Architettura proposta

Mantenere una pagina statica con **Vue 3 via CDN**, senza introdurre router,
store globale o backend. Separare inizialmente:

```text
index.html          struttura semantica e template Vue
js/data.js          registro ingredienti e catalogo pizze
js/filters.js       funzioni pure di ricerca e compatibilità
js/app.js           stato Vue, computed e azioni dell'utente
css/stile.css       personalizzazioni visive e stile Tailwind generato
```

Usare identificativi stabili per pizze e ingredienti, separati dalle etichette.
Normalizzare Cipolla/Cipolle, aggiungere Zucchine e Crocché al registro e
verificare che ogni ingrediente delle ricette esista nel registro.
Conservare entrambe le Regina con ID distinti; il trattamento editoriale del
nome resta una scelta di catalogo. Conservare inizialmente anche le ricette
equivalenti, senza cancellazioni implicite.

Derivare dal catalogo il numero di ricette per ingrediente. Gli ingredienti
attualmente senza ricette vanno indicati come tali o nascosti dal selettore
con una scelta esplicita, mantenendo i dati nel registro.

Vue gestirà selezione, ricerca e risultati tramite stato reattivo e proprietà
calcolate. I template useranno `v-for` con chiavi stabili, `v-model` per la ricerca
e `@click` per le azioni; nessuna concatenazione manuale di HTML.
La selezione deve contenere soltanto ID univoci.

Vue documenta l'uso diretto da CDN senza build; in questa configurazione non
si usano componenti Single-File `.vue`. Per la versione pubblicata scegliere
una release precisa e la distribuzione di produzione.
Fonte: [Vue — Quick Start](https://vuejs.org/guide/quick-start.html#using-vue-from-cdn).

Tailwind può sostituire Bootstrap per impaginazione e stile. Il Play CDN è
adatto alla prima anteprima, ma la documentazione lo destina allo sviluppo.
Per la pubblicazione generare un CSS statico tramite Tailwind CLI: Vue resta
caricato via CDN e il sito resta distribuibile come file statici.
Fonti: [Tailwind — Play CDN](https://tailwindcss.com/docs/installation/play-cdn)
e [Tailwind — CLI](https://tailwindcss.com/docs/installation/tailwind-cli).

## Esperienza proposta per la prima versione

1. Mostrare tutte le pizze all'apertura e dopo il reset, con il totale visibile.
2. Offrire ingredienti compatti, ricercabili e raggruppati per categoria.
3. Consentire selezione e deselezione con lo stesso pulsante, con stato visivo
   e `aria-pressed`; aggiungere un riepilogo con rimozione individuale.
4. Aggiornare immediatamente le schede delle pizze, evidenziando gli ingredienti
   richiesti rispetto agli altri ingredienti della ricetta.
5. Esplicitare la regola “Contiene tutti gli ingredienti scelti”.
6. Mostrare un messaggio utile quando nessuna ricetta corrisponde, con invito
   a rimuovere un ingrediente e un'azione per azzerare i filtri.
7. Su desktop affiancare selettore e risultati; su mobile impilarli con riepilogo
   compatto. Usare una palette calda con fondo chiaro, accento pomodoro e verde
   per le selezioni, testi leggibili e focus da tastiera visibile.

L'esclusione di ingredienti (“senza”), i preferiti e i suggerimenti con
corrispondenza parziale sono possibili estensioni successive. I suggerimenti
parziali devono essere separati chiaramente dai risultati che rispettano
tutte le scelte.

## Ordine di intervento e verifica

1. Normalizzare e separare i dati, preservando le 65 voci del catalogo.
2. Isolare la logica del filtro e verificare selezione vuota, singola,
   multipla, incompatibile e alias delle cipolle.
3. Migrare lo stato e il rendering a Vue, con selezione reversibile.
4. Rifare layout e stile con Tailwind; rimuovere le dipendenze sostituite.
5. Verificare navigazione da tastiera, risultati annunciati, layout mobile,
   rimozione individuale e reset completo.

Per questa analisi lo script originale è stato eseguito in Node tramite `vm`,
con un DOM minimo simulato. Sono stati riprodotti avvio vuoto, selezione di
Basilico, clic duplicato, reset e combinazione Ananas + Aneto senza risultati.
Il catalogo è stato confrontato automaticamente con gli ingredienti selezionabili.
Gli esiti sono in `graphify-out/current-page-audit.json`.

Si tratta di una verifica della logica e del sorgente, non di una verifica
grafica nel browser. HTML e CSS applicativi non sono stati modificati in
questa fase di analisi.
