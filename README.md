# At the Clinic

Nutrition and athletic training app for Cypress College athletes (all sports), run by the team's sports dietitian.

## How athletes get it

Share the GitHub Pages link. On iPhone: open it in Safari, tap Share, then **Add to Home Screen**. On Android: Chrome menu, then **Add to Home screen**. The Charger logo becomes the app icon.


## Updates

Change `index.html` and push to `main`. GitHub Pages republishes in about a minute, and athletes get the new version the next time they open the app while online (the service worker loads pages network-first).

## What doesn't work outside Claude

The team charge board, Ask the RD (AI) and the in-app Edit tab only work when the app is hosted on Claude. On GitHub Pages they hide themselves. Change content by editing `index.html` instead.

## Privacy

Profiles, allergies, the food journal, hydration and the charge meter stay on each athlete's phone (localStorage). Nothing about athletes is stored in this repository.

## Hosting

Served with GitHub Pages from the `main` branch root.
