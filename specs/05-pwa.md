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
  "theme_color": "#0d6efd",
  "icons": [
    { "src": "pwa-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "pwa-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "pwa-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
Icone in `public/`. `start_url` e `scope` relativi + `base: './'` in Vite → l'app funziona in qualunque sottocartella di hosting.

## Service worker
- Strategia: **precache** di tutti gli asset della build (HTML, JS, CSS, JSON dei livelli, icone) via Workbox `generateSW`.
- Nessun runtime caching di rete (l'app non fa chiamate esterne).
- `registerType: 'prompt'`: quando c'è una nuova versione compare un toast "New version available – Update". L'aggiornamento non interrompe un quiz in corso finché l'utente non conferma.
- Navigazione SPA: con HashRouter non servono fallback di rewrite.

## Offline
- Il primo caricamento richiede rete; poi tutto è in cache.
- Indicatore discreto "Offline" opzionale (evento `online/offline`).
- Tutti i livelli sono precacheati (i JSON sono piccoli).

## Installazione
- Pulsante "Installa app" nella AboutPage che usa l'evento `beforeinstallprompt` (dove supportato).
- Per iOS: testo di istruzioni "Condividi → Aggiungi a Home".

## Verifica (checklist)
- [ ] Lighthouse PWA/installabilità ok
- [ ] Offline: DevTools → Network offline → ricarica → l'app parte
- [ ] Aggiornamento: nuova build → compare il toast
- [ ] Icone corrette, maskable ok
