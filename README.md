# Saboss Barber Shop – One-Page-Website

Statische Website (HTML, CSS, JS – kein Build-Schritt).

```bash
python3 -m http.server 8000   # dann http://localhost:8000 öffnen
```

## Platzhalter ersetzen
Alle Platzhalter stehen in `[ECKIGEN KLAMMERN]`. Suche im Projekt nach `[`:

| Platzhalter | Wo |
|---|---|
| `[STADT]`, `[JAHR]`, `[ANZAHL]` | Title, Meta, Hero, Über uns, JSON-LD |
| `[TELEFON]`, `[STRASSE HAUSNUMMER]`, `[PLZ]` | Header, Kontakt, Footer, JSON-LD, Maps (`data-src`) |
| `[DOMAIN]` | Canonical, Open Graph, JSON-LD |
| `[INSTAGRAM]`, `[TIKTOK]`, `[WHATSAPP-NUMMER-OHNE-PLUS]` | Galerie, Footer, Kontakt |
| `[PREIS]`, `[DAUER]` | Preisliste |
| `[Name Barber 1-3]`, `[X] Jahre` | Team + Formular-Auswahl |
| Bewertungen, `[X,X]`, Google-Score | Kundenstimmen (nur echte Bewertungen einsetzen) |
| `data-count`-Werte | Zahlen-Sektion (Beispielwerte, durch echte ersetzen) |

## Medien
- `assets/video/hero.mp4`: Hero-Hintergrundvideo (Zeitlupe, ohne Ton, < 8 MB). Wird erst nach Einwilligung geladen. Ohne Datei bleibt der animierte Dampf-Hintergrund.
- `assets/img/placeholder.svg`: in Team und Galerie durch echte Fotos ersetzen.
- `razor.jpg`, `chair.jpg`, `clipper.jpg`: Gravur-Illustrationen (Referenzbilder). Lizenz/Nutzungsrechte vor Livegang prüfen.

## Technik
- Formular: aktuell nur Frontend-Validierung und Erfolgsmeldung. In `js/main.js` (TODO) an ein Backend oder Buchungssystem (Treatwell, Booksy, Planity) anbinden.
- DSGVO: Google Maps und Video laden erst nach Einwilligung. Google Fonts werden extern geladen, besser lokal hosten.
- `impressum.html` und `datenschutz.html` sind Mustertexte und müssen rechtlich geprüft werden.
