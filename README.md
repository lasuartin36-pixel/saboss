# Saboss Barber Shop – One-Page-Website

Statische Seite (HTML, CSS, JS – kein Build-Schritt). Lokal ansehen: `python3 -m http.server 8000`.

## Aufbau
Start (großes Steuerrad rechts, dreht sich beim Scrollen) → Google-Rezensionen → Team als Fahndungsplakate (3 Platzhalter) → Preisliste → Termin (Buchungssystem) + Kontakt + Google Maps → Footer mit Impressum/Datenschutz. Im Hintergrund hängen Bilder aus alten Bars an der Holzwand.

## Noch einzutragen (Suche nach `[`)
- `index.html`: Straße, PLZ, Telefon, WhatsApp-Nummer, Öffnungszeiten, Namen der Barber (`[Name Barber 1-3]`).
- Buchungssystem: URL des Anbieters (Treatwell, Booksy, Planity, Shore …) bei `<div class="booking" data-src="">` eintragen. Wird erst nach Einwilligung geladen.
- Team-Fotos: `assets/img/placeholder.svg` durch Porträts ersetzen.
- `impressum.html`, `datenschutz.html`: Mustertexte, rechtlich prüfen. Im Datenschutz den Buchungsanbieter eintragen.

## Medien
- `assets/img/wheel.svg`: Steuerrad (Vektor, beliebig scharf).
- `assets/img/wall/*.jpg`: die Wandbilder (an der Holzwand angenagelt). Austauschen: Datei überschreiben oder `src` im Block `.pics` in `index.html` ändern. Rechte an den Bildern selbst klären, bevor die Seite online geht.
- Schriften liegen lokal in `assets/fonts/` (Pirata One, IM Fell English SC, Crimson Pro, Playfair Display, Bebas Neue; alle SIL OFL).
