# WEFIX Trädgård — testyta

Statisk förhandsvisning för en annan domän. **Inte** den skarpa sajten wefixtradgard.se.

WEFIX Trädgård AB. Kristian bad om en test-uppladdning. Inga priser. Inga API-nycklar. Grok-API är **inte** inkopplat — chatten är en frontend-mock med nyckelord.

## Hur du testar

Öppna `index.html` (eller släpp hela mappen på Netlify / Surge / GitHub Pages).

Startsida: **en** glasboll. Inga små bollar förrän du skrivit.

Skriv i fältet **Skriv här**:

- `höststädning` — en boll Höststädning poppar
- `robot` — Basservice, Hemservice, Lyxservice
- `altan` / `altantvätt` / `bygga altan` — erbjudandeboll
- Prisfråga — inga siffror, kollega hör av sig, ber om namn + telefon
- `ring` / `människa` / `Mattias` — ber om telefonnummer
- Jobb (namn, telefon, adress, vad, när) — *Utkast sparat. En kollega tar det.* Inget Fieldly/Sellfinity.

Klicka på en erbjudandeboll för att fortsätta (adress + när).

Undersidor finns på direkt-URL, t.ex. `/integritet.html`. Ingen meny på startsidan.

## Vad som inte är med

- Ingen xAI-nyckel, ingen Grok-API
- Inga priser
- Ingen kundregister-koppling
- Live-domänen wefixtradgard.se är orörd

## Uppladdning

Mappen är självständig. Ladda upp innehållet i `hemsida-preview/` till valfri statisk host. `robots.txt` stänger av indexering (`Disallow: /`).
