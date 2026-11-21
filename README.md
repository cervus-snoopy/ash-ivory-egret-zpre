[![make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cervus-snoopy/ash-ivory-egret-zpre/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/cervus-snoopy/ash-ivory-egret-zpre/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Tidepool Twins — Spot the Difference

A spot-the-difference game with two near-identical pictures side by side.
Find every hidden change before the timer runs out — click a difference on
either picture to mark it with a gold ring, chain finds into combos, and use
hints when a change refuses to be seen.

Three hand-drawn scenes (all art is Canvas 2D, all sounds are synthesized
WebAudio — no image or audio files, no network):

- **Level 1 — Tidepool Morning**: 7 differences, 90 seconds.
- **Level 2 — Night Market**: 8 differences, 75 seconds.
- **Level 3 — Star Observatory**: 10 differences, 60 seconds.

A wrong click costs 5 seconds and breaks your combo. Each level gives 3
hints (H key or the Hint button) that pulse one unfound difference. The
scenes are seeded (`?seed=N`), so the same seed always draws the same
pictures.

## How to play

Open `game/index.html` in a desktop browser — it plays from static files
with no build step. Mouse: click a difference. Keyboard: `H` hint,
`P` pause, `R` restart, `N` next level, `Space` start.

## Files

- `game/index.html` — page shell, canvas, HUD.
- `game/src/main.js` — boot, game loop, `?shot=` staging.
- `game/src/config.js` — constants: sizes, levels, timers, scoring.
- `game/src/random.js` — seeded RNG for reproducible scenes.
- `game/src/scenes.js` — the three scenes, drawn with Canvas 2D.
- `game/src/differences.js` — where each difference hides, per level.
- `game/src/state.js` — game state and rules (finds, timer, hints, score).
- `game/src/input.js` — mouse and keyboard handling.
- `game/src/render.js` — panels, markers, HUD, screens.
- `game/src/audio.js` — synthesized sounds (chime, buzz, win arpeggio).
- `game/src/shots.js` — staged states for the screenshots.
- `game/src/particles.js` — the gold burst on every find.
- `main.ts` — hands the game in: copies `game/` and `screenshots/` and
  writes `dossier.json` with the vendored make.fun library.
- `screenshots/` — four real renders of the game.

## License

MIT — see [LICENSE](LICENSE).
