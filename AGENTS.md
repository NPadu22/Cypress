# AGENTS.md: At the Clinic (Cypress College athletics)

Instructions for AI coding agents and developers working in this repository.

## What this is

A mobile-first web app for Cypress College athletes (adults, all sports): sports nutrition plus athletic training. Run by the team sports dietitian (Nick). Hosted on GitHub Pages from the `main` branch root. No build step and no framework: plain HTML, CSS and JavaScript in one file.

## Files

- `index.html`: the whole app. Editable content lives in `<script type="application/json" id="cy-data">` (announcements, restaurants, team `schedules`, settings such as dietitian and athletic-trainer contacts).
- Team schedules: `"schedules":{"wvb":[{"d":"2027-01-20","t":"18:00","opp":"Fullerton","away":true,"loc":""}]}` keyed by sport id. They show in Home › Games, set Game day automatically and export to the phone calendar (.ics with alerts 3½ h and 45 min before). Athletes can also add their own games.
- Google Sheet "At the Clinic" (public, read via gviz CSV; settings teamSheet gid 0, atSheet gid 3, nutSheet gid 4). Tabs: Read me, Team, Training room (Tag dropdown, optional Link column), Nutrition, Roster (auto, from sign-ups), Lists (hidden, auto: For dropdown and meal names).
  - For column: "CODE · Name (Team)", "Team · Women's Softball", "Position · Women's Softball · Pitcher", Everyone, Athletes, Staff; comma-separated for several. Parsed by `forParse` / `forMe`.
  - Nutrition: Meal 1-3 must match app meal names exactly (MEALBANK or MEALPREP). When meals are added or renamed, rewrite Lists!C.
- Sign-up = first + last name, team, position, consent box (required). Sharing is automatic after consent (`profile.consentAt`; `staffSend` refuses without it). Meals and water go to the PRIVATE staff sheet through `scripts/roster-apps-script.gs` (settings `rosterURL`, the /exec URL). Roster rows (name, role, team, position, jersey) go to the public Roster tab.
- Meal prep (store batch recipes, `MEALPREP`) and the running Grocery List (`GLIST`, cart button on Eat) are ported from the Orbit app.
- Away-game travel list: `TRAVEL` in `index.html`. Drive times are rough, without traffic.
- `manifest.webmanifest`, `icon-*.png`, `splash-*.png`, `logo.png`: home-screen install. The logo is the Cypress Chargers athletics mark.
- `sw.js`: network-first pages, cached assets.

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

- **Story:** the profile is a Charger locker. Keep new copy short.

## Before you finish a change

1. Open `index.html` locally and check Home, Eat, Training, Journal, RD, Learn and Me with a sample profile.
2. Check the browser console for errors.

## Home: Charge Board and Hall of Fame
- Charger Scoreboard (`PLAYS`, `vScoreboard`): 4 daily plays (check-in, sleep 7+, 3+ food logs, water goal). 3+ = a W. Points: 10 per play, +20 for 4/4. Levels in `LEVELS`. Days before first use (`cy_firstday`) never count as losses.
- Charger Hall of Fame (`HOF`): only verified facts. Sources (Nov 2026): baseball-reference.com Cypress College pages (5 baseball state titles 1991, 1994, 1997, 2003, 2013; 13 state appearances); cypresschargers.com / cypress.prestosports.com releases (softball 10 titles, 48-0 in 2017, 2010-12 three-peat, 2023 title, 31 appearances; men's golf 2018 title; women's basketball 2005 title per 3C2A preview; women's soccer state finals 2021/2023/2024; volleyball OEC 2010/2016/2021; flag football 2026 inaugural OEC co-champs; swim 2022 Umpornpuckdi 1650 free and 36th state banner; diving Alejandra Gomez 3 titles; baseball 2025 OEC title and Final Four). Update each season.

## Performance Journal
- Daily check-in (`CK`, `checkinHTML`): sleep, quality, soreness, energy, stress, pain (area, 0-10, new, symptoms). `ckFlag`: "head" (head/neck or headache/dizzy) = stop and tell an AT now; "see" = see an AT today. Sent to the staff sheet Check-ins tab (`t:"check"`). Consent version 2 covers check-ins; older consents are asked again.

## Schedules and game day
- Schedule tab of the Google Sheet (gid 7, setting `schedSheet`): Date, Time (text, e.g. 7:00 PM), Team (dropdown of team labels), Opponent, Home/Away, Location, Notes, Show. Athletes see their team on Home; staff see every team.
- A game today (Schedule tab or an athlete's own game) turns the app black with gold (`body[data-gameday="1"]`) and shows the Game Day card with sport-specific fueling (`GAMEDAY`). Staff get the black screen when any team plays.
- The Chargers site blocks automated fetches; schedules are entered in the sheet.
