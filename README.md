# Hero Academy Maths: NumberQuest

Static vanilla JavaScript maths adventure. Serve the repository root on any static host; no build or backend required.

Public URL: https://numberquest.heroacademy.app

## Challenge progression

Four freely selectable maps, each with **30 maths challenges** and three questions per challenge: **120 maths challenges / 360 questions per full playthrough**. One mini-game follows each challenge (120 additional game stops). Eight map chapters and a challenge picker provide direct access to any difficulty. Completion remains recorded separately from the ability to visit a level.

| Challenges | Addition | Subtraction | Multiplication | Division |
|---|---|---|---|---|
| 1–5 | Totals to 10 | Numbers to 10 | Groups of 2 | Exact division by 2 |
| 6–10 | Totals to 20 | Numbers to 20 | Tables 2 and 5 | Divisors 2 and 5 |
| 11–15 | Totals to 50 | Numbers to 50 | Tables 2, 5 and 10 | Divisors 2, 5 and 10 |
| 16–20 | Crossing tens to 100 | Borrowing across tens | Tables 3, 4 and 6 | Divisors 3, 4 and 6 |
| 21–25 | To 500, missing numbers | To 500, missing numbers | Tables 7–12, missing factors | Tables 7–12, missing dividends/divisors |
| 26–30 | To 1,000, three addends | To 1,000, two takeaways | Two-digit numbers × 2–9 | Larger exact divisions |

Story problems begin in challenges 16–20. Grown-ups can optionally move the difficulty one or two bands ahead. Missing-number tasks show the unknown as a question mark in both the equation and the quantity pictures. Hints use inverse operations or break problems into steps. Number pictures use dots for small values and place-value blocks for larger values. These are practice activities, not a claim of full curriculum coverage or mastery assessment.

Generated questions exclude recent equations. The finite question bank eventually repeats. Three questions per challenge generate afresh on replay.

## Saves and rewards

Up to 12 named local players have independent scores, progress, outfits, settings, recent questions and practice records. Saves use localStorage. Existing v2 saves and imported v2 backups automatically migrate completion/record IDs to the expanded maps without changing points, names, outfits or treasures. Earlier v1 saves also migrate. Backups now export v3. Optional ChoreQuest central accounts add cloud profile saves and Hero XP synchronisation; the game also works without an account.

Correct answer: 10 points. First restoration: 50. Mini-game finish: 25. First treasure: 15. Help does not reduce points; retries do not remove points. Replays earn answer and mini-game points. Independent and supported attempts remain distinguishable in Grown-ups.

## Mini-games and access

Star Catcher, Robot Trail, Memory Garden and Sky Glider alternate with maths. Star Catcher has held arrows and a horizontal tap/drag track. Sky Glider has a vertical slider. Memory mismatches turn over after three seconds. Success automatically advances, including between map chapters; Back cancels the pending transition. Moving games support pause and gentle play. Reduced-motion preferences start action games paused. Maths is untimed and speech starts only on request.

## Development and checks

Run `python3 -m http.server 8000` from the repository root.

Run `node --check app.js` and `node tests/progression.test.cjs`.

Checks cover 10,800 generated questions across all operations, challenges and difficulty settings; missing-number answers; carrying/borrowing; all 240 map-stop render paths; and migration of existing points and completions. Browser layout and physical iPhone checks for this expansion remain outstanding.

Original Hero Academy hero, Pip, terrain, landmarks and icon adapted from the user's mightora/hero-academy-reading repository. No open-source licence was selected for those assets. No runtime analytics, ads or third-party script dependencies.

