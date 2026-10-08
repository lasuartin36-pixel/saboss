# Saboss Barber Shop – One-Page-Website

Statische Seite (HTML, CSS, JS – kein Build-Schritt). Lokal ansehen: `python3 -m http.server 8000`.

## Aufbau
Start (großes Steuerrad rechts, dreht sich beim Scrollen) → Google-Rezensionen → Team als Fahndungsplakate (3 Platzhalter) → Preisliste → Termin (Buchungssystem) + Kontakt + Google Maps → Footer mit Impressum/Datenschutz. Im Hintergrund hängen Bilder aus alten Bars an der Holzwand.

## Noch einzutragen (Suche nach `[`)
- `index.html`: Straße, PLZ, Telefon, WhatsApp-Nummer, Öffnungszeiten, Namen der Barber (`[Name Barber 1-3]`).
- Buchung: alle „Termin buchen“-Buttons führen zur Salonkee-Seite (`https://salonkee.de/salon/saboss-barber?lang=de`, öffnet in neuem Tab). Link bei Bedarf in `index.html` ersetzen (Suche nach `salonkee.de`).
- Team-Fotos: `assets/img/placeholder.svg` durch Porträts ersetzen.
- `impressum.html`, `datenschutz.html`: Mustertexte, rechtlich prüfen. Im Datenschutz die Salonkee-Daten prüfen/ergänzen (Abschnitt 6).

## Medien
- `assets/img/wheel.svg`: Steuerrad (Vektor, beliebig scharf).
- `assets/img/wall/*.jpg`: die Wandbilder (an der Holzwand angenagelt). Austauschen: Datei überschreiben oder `src` im Block `.pics` in `index.html` ändern. Rechte an den Bildern selbst klären, bevor die Seite online geht.
- Schriften liegen lokal in `assets/fonts/` (Pirata One, IM Fell English SC, Crimson Pro, Playfair Display, Bebas Neue; alle SIL OFL).
