# Hero Academy Maths: NumberQuest

Static vanilla JavaScript game. Serve the repository root on any static host. No backend or build required. Local command: `python3 -m http.server 8000 --directory .`.

Four freely selectable maps specialise in addition, subtraction, multiplication and exact division. Each map has eight sequential stops alternating four three-question maths missions with four mini-games: Star Catcher (moving basket), Robot Trail (navigation puzzle), Memory Garden (matching cards) and Sky Glider (moving through gates). Twelve optional treasures. Recent question exclusion provides varied replays; finite question pools eventually repeat.

Up to 12 named local players with independent scores, progress, outfits, settings, question history and learning records. Player selector supports renaming, adding and switching. Data persists in localStorage, with validated multi-player JSON backup/restore. Existing v1 browser saves migrate to the first player, preserving restoration/treasure progress, settings and attempt records. Historical completions remain game progress, not evidence of operation-specific learning mastery.

Scoring: correct answer 10, first restoration 50, mini-game completion 25, first treasure 15. Replays earn correct-answer and mini-game points. Help does not reduce points; mistakes do not remove points. Maths is untimed, quiet by default, with visual help and optional device speech. Moving games support keyboard, touch buttons, pause and gentle-play completion; reduced-motion preferences start them paused. No accounts, cloud sync, ads, purchases or analytics.

Identity, original hero, Pip, terrain, landmarks and icon adapted from the user's mightora/hero-academy-reading repository. No open-source licence was selected for those assets. No third-party runtime dependencies. Name and domain availability not cleared.

Verification: syntax checks, 2,400 operation-specific generated questions including repeat prevention, map availability, profile isolation, score persistence and backup validation checks. Browser layout/gameplay and physical iPhone testing remain outstanding. This is a prototype, not a mastery assessment.

Star Catcher control update: adjacent arrows support press-and-hold with pointer capture and cancellation. Touch-action rules prevent control double-tap zoom while retaining page pinch zoom. An accessible track slider supports tap/drag plus keyboard arrows/Home/End. Activities show a short success state, then automatically start the next stop; Back cancels the transition. The final maths answer automatically finishes the mission. Final map completion keeps the ending screen. Focused simulated-control checks cover track tapping, held movement, single completion awards, automatic advancement and cancellation. Physical iPhone gesture verification remains outstanding.

Memory Garden now hides unmatched pairs automatically after three seconds and blocks further flips during that interval; matching pairs remain visible. Closing the activity cancels the timer. Sky Glider has a left-side vertical tap/drag slider, plus Up/Down/Home/End keyboard controls and an announced height value. Focused simulated checks cover mismatch timing, matching-pair retention, close cleanup and vertical-slider movement/bounds. Real-device touch/layout verification remains outstanding.

Questions always show quantity models for both operands, and for the result after solving. Values to 20 use dots; larger values use partitioned tens bars and single dots with an explicit key. Zero shows no dots. Operation-specific labels distinguish amounts, groups and group size; SVGs have quantity descriptions. Every representation from 0 to 144 was checked against its number.

Public URL: https://numberquest.heroacademy.app
