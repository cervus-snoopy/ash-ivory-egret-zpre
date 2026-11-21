// Tidepool Twins — ?shot= staging for screenshots. Each shot puts the game
// in a fixed, deterministic state so the screenshots are real renders of the
// game itself, taken the same way every run.

import { startLevel, markFound } from './state.js';
import { diffsFor } from './differences.js';

function markSome(state, count) {
  const diffs = diffsFor(state.levelIndex);
  for (let i = 0; i < count && i < diffs.length; i++) {
    markFound(state, diffs[i]);
  }
}

export function applyShot(state, shot) {
  if (shot === 'title') {
    state.screen = 'title';
    state.levelIndex = 0;
  } else if (shot === 'cover') {
    // Level 1 mid-game: 3 found, 4 still hiding, timer running.
    startLevel(state, 0);
    state.timeLeft = 62;
    markSome(state, 3);
  } else if (shot === 'level2') {
    // Level 2 mid-game: 2 found, 6 still hiding.
    startLevel(state, 1);
    state.timeLeft = 48;
    markSome(state, 2);
  } else if (shot === 'win') {
    // Level 1 finished: every difference found, bonus counted.
    startLevel(state, 0);
    state.timeLeft = 18;
    markSome(state, diffsFor(0).length);
  }
}
