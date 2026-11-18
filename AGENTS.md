# AGENTS.md: At the Clinic (Cypress College athletics)

Instructions for AI coding agents and developers working in this repository.

## What this is

A mobile-first web app for Cypress College athletes (adults, all sports): sports nutrition plus athletic training. Run by the team sports dietitian (Nick). Hosted on GitHub Pages from the `main` branch root. No build step and no framework: plain HTML, CSS and JavaScript in one file.

## Files

- `index.html`: the whole app. Editable content lives in `<script type="application/json" id="cy-data">` (announcements, restaurants, settings such as dietitian and athletic-trainer contacts).
- `manifest.webmanifest`, `icon-*.png`, `splash-*.png`, `logo.png`: home-screen install. The logo is the Cypress Chargers athletics mark.
- `sw.js`: network-first pages, cached assets.
- `widget.js`: iOS home-screen widget for the Scriptable app (small = today's tip, medium = sport rule of the day). It reads `widget.json`.
- `widget.json`: the widget's feed, generated from `index.html`. **Run `node tools/build-widget.mjs` after changing Basics tips, sport rules (SIMPLE), sports or announcements**, and commit the result.

## Rules

- **Allergens are safety-critical.** Keep the 9-allergen tags, the red flag for an athlete's own allergens, and the allergy-review hard stop after setup.
- **Reading level:** education content is written for about a 10th-grade reader. Coach voice for UI copy; calm, plain wording for safety content.
- **Sources:** every education answer cites a real, verifiable source (position stand, consensus statement or peer-reviewed study). Never invent citations.
- **Supplements:** Cypress athletes are not drug-tested. Keep to general third-party certification (NSF Certified for Sport or Informed Sport) and "check with the RD first".
- **Athletic training:** rehab content gives stages only, no sets or reps, and always routes athletes to the athletic trainers (Rachael Kirkpatrick and Nicolette Marinello) first. Keep the 911 warning signs.
- **Brand (Cypress College Identity Guide, 2018):** Premier Gold `#FED41F` and Charger Blue `#003876` are the base. Accents only from the guide's palette. Never combine Charger Blue with Modern Gold `#FBB040`, or Premier Gold with Nature Green as main colors. Max four colors per scheme. Look: mid-century modern (default Mid-Century cream scheme; flat borderless cards, pills, round markers). Fonts: Futura for display (a Cypress alternate family; Jost web fallback) and Trebuchet MS for text (Fira Sans fallback). Don't recolor, stretch or redraw the horse-head mark (`logo.png`, transparent with its white keyline). The mark's use with other words or new layouts needs Campus Communications approval.
- **Privacy:** athlete data stays in the browser. Never send it anywhere or store it in this repo.
- The Claude-only features (`window.claude`: team board, Ask the RD, Edit tab) hide themselves on GitHub Pages. Leave them in place or remove them cleanly.
- Must work at about 390 px wide in every color scheme, with no horizontal scrolling. Respect `prefers-reduced-motion`.

- **Story:** the app is a place. Tabs are rooms of the Clinic (Lobby/Home, The Kitchen, The Training Room, The Logbook, The Front Desk, The Film Room) and the profile is a Charger locker. Each day is a numbered "Dispatch" (day of the year), shared with the widget. Keep new copy short.

## Before you finish a change

1. Open `index.html` locally and check Home, Eat, Training, Journal, RD, Learn and Me with a sample profile.
2. Check the browser console for errors.
