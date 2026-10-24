# PWA

## Obiettivi
Installabile su Android/iOS/desktop, avvio offline, aggiornamenti controllati.

## Web App Manifest (generato da `vite-plugin-pwa`)
```json
{
  "name": "English Quiz",
  "short_name": "English Quiz",
  "description": "English exercises by CEFR level",
  "lang": "en",
  "start_url": ".",
  "scope": ".",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#ffffff",
  "theme_color": "#012169",
  "icons": [
    { "src": "pwa-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "pwa-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "pwa-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
Icone in `public/`: **bandiera britannica con sotto la scritta "English Quiz"** (su due righe) (blu #012169 e rosso #C8102E su sfondo bianco). Sono generate da `src/scripts/make-icons.mjs` (`npm run icons`, dentro `src/`), che scrive `pwa-192.png`, `pwa-512.png` e `pwa-512-maskable.png` (quest'ultima a tutto campo, con il disegno nella zona sicura). Il testo usa un font di sistema (Arial Black) al momento della generazione; per questo non c'è un `favicon.svg` e la favicon è `pwa-192.png`. Per cambiare l'icona si modifica lo script e si rigenera. `start_url` e `scope` relativi + `base: './'` in Vite → l'app funziona in qualunque sottocartella di hosting.

## Service worker
- Strategia: **precache** dell'app (HTML, JS, CSS, icone, manifest: circa 0,6 MB) via Workbox `generateSW`. I file delle domande (`assets/data/*.js`, un chunk per livello e tipologia, vedi `chunkFileNames` in `vite.config.ts`) sono **esclusi dal precache** (`globIgnores`).
- **Runtime caching** dei soli file delle domande: `CacheFirst`, cache `eq-data`, al massimo 200 voci (`purgeOnQuotaError`). Un livello viene scaricato e messo in cache la prima volta che lo si sceglie in Home (la pagina carica tutti i file del livello per contare gli argomenti). Il test di livello li scarica tutti.
- Nessuna chiamata esterna oltre ai propri file statici.
- `registerType: 'prompt'`: quando c'è una nuova versione compare un toast "New version available – Update". L'aggiornamento non interrompe un quiz in corso finché l'utente non conferma.
- Navigazione SPA: con HashRouter non servono fallback di rewrite.

## Offline
- Il primo caricamento richiede rete; poi l'app si avvia offline.
- Offline si possono usare **solo i livelli già aperti almeno una volta** online. Un livello mai aperto mostra "Could not load this level. Connect to the internet to download it; it will then work offline." (Home) e nessuna tile di numero di domande attiva. Il test di livello richiede tutti i livelli: offline mostra un messaggio analogo.
- Indicatore discreto "Offline" opzionale (evento `online/offline`).
- Motivo: con 2000 domande per livello i dati valevano circa 1,5 MB gzip (con 5000 circa 3,5 MB); scaricarli tutti all'installazione sprecava banda (decisione 38).

## Installazione
- Pulsante "Install" nella navbar (nascosto se l'app è già installata) che porta alla pagina `#/install` con la spiegazione e il pulsante "Install app"; usa l'evento `beforeinstallprompt` (dove supportato; l'evento è catturato all'avvio in `hooks/useInstall.ts`). AboutPage ha solo un link alla pagina.
- Per iOS: testo di istruzioni "Condividi → Aggiungi a Home".

## Verifica (checklist)
- [ ] Lighthouse PWA/installabilità ok
- [ ] Offline: DevTools → Network offline → ricarica → l'app parte
- [x] Offline: un livello già aperto funziona, uno mai aperto mostra il messaggio (verificato con Playwright su `vite preview`)
- [ ] Aggiornamento: nuova build → compare il toast
- [ ] Icone corrette, maskable ok
