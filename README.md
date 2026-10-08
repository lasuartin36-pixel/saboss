# Saboss Barber Shop – One-Page-Website

Statische Seite (HTML, CSS, JS – kein Build-Schritt). Lokal ansehen: `python3 -m http.server 8000`.

## Aufbau
Start (großes Steuerrad rechts, dreht sich beim Scrollen) → Google-Rezensionen → Team (3 Platzhalter) → Termin (Buchungssystem) + Kontakt + Google Maps → Footer mit Impressum/Datenschutz. Im Hintergrund hängen Bilder aus alten Bars an der Holzwand.

## Noch einzutragen (Suche nach `[`)
- `index.html`: Straße, PLZ, Telefon, WhatsApp-Nummer, Öffnungszeiten, Namen der Barber (`[Name Barber 1-3]`).
- Buchungssystem: URL des Anbieters (Treatwell, Booksy, Planity, Shore …) bei `<div class="booking" data-src="">` eintragen. Wird erst nach Einwilligung geladen.
- Team-Fotos: `assets/img/placeholder.svg` durch Porträts ersetzen.
- `impressum.html`, `datenschutz.html`: Mustertexte, rechtlich prüfen. Im Datenschutz den Buchungsanbieter eintragen.

## Medien
- `assets/img/wheel.svg`: Steuerrad (Vektor, beliebig scharf).
- `assets/img/wall/*.svg`: selbst gezeichnete Wandbilder. Besser durch Fotos der echten Bilder im Laden ersetzen (Datei gleichen Namens überschreiben oder `src` in `.pics` ändern).
- Schriften liegen lokal in `assets/fonts/` (Pirata One, IM Fell English SC, Crimson Pro, SIL OFL).
