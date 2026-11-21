// Tidepool Twins — game state: which screen is showing, which level, what
// has been found, the timer, hints, score and combo. All rules live here;
// rendering and input only read and call these helpers.

import {
  LEVELS,
  HINTS_PER_LEVEL,
  HINT_COOLDOWN_MS,
  HINT_PULSE_MS,
  MISS_PENALTY_S,
  FIND_POINTS,
  COMBO_BONUS,
  TIME_BONUS_PER_SECOND,
} from './config.js';
import { diffsFor } from './differences.js';

export function createState(seed) {
  return {
    seed,
    screen: 'title', // title | play | paused | levelComplete | gameOver | allComplete
    levelIndex: 0,
    found: new Set(),
    mistakes: 0,
    timeLeft: LEVELS[0].time,
    hintsLeft: HINTS_PER_LEVEL,
    hintCooldownUntil: 0,
    hintPulse: null, // { id, until } — a difference pulsing after a hint
    score: 0,
    combo: 0,
    bestCombo: 0,
    shakeUntil: 0,
    timeBonus: 0,
    totalFound: 0,
    best: 0,
  };
}

export function levelDiffs(state) {
  return diffsFor(state.levelIndex);
}

export function remaining(state) {
  return levelDiffs(state).length - state.found.size;
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.found = new Set();
  state.timeLeft = LEVELS[index].time;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintCooldownUntil = 0;
  state.hintPulse = null;
  state.combo = 0;
  state.timeBonus = 0;
  state.screen = 'play';
}

export function startGame(state) {
  state.score = 0;
  state.mistakes = 0;
  state.totalFound = 0;
  state.bestCombo = 0;
  startLevel(state, 0);
}

// A difference was found. Scores it, grows the combo, and finishes the level
// (or the whole game) when it was the last one left.
export function markFound(state, diff) {
  if (state.found.has(diff.id)) return false;
  state.found.add(diff.id);
  state.totalFound += 1;
  state.combo += 1;
  if (state.combo > state.bestCombo) state.bestCombo = state.combo;
  state.score += FIND_POINTS + (state.combo - 1) * COMBO_BONUS;
  if (state.found.size >= levelDiffs(state).length) {
    state.timeBonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SECOND;
    state.score += state.timeBonus;
    if (state.levelIndex >= LEVELS.length - 1) state.screen = 'allComplete';
    else state.screen = 'levelComplete';
  }
  return true;
}

// A click on empty picture: time penalty, combo lost, screen shakes.
export function registerMiss(state) {
  state.timeLeft = Math.max(0, state.timeLeft - MISS_PENALTY_S);
  state.mistakes += 1;
  state.combo = 0;
  state.shakeUntil = performance.now() + 220;
}

// Spend a hint: pulse one unfound difference for a few seconds.
export function useHint(state) {
  const now = performance.now();
  if (state.screen !== 'play') return null;
  if (state.hintsLeft <= 0) return null;
  if (now < state.hintCooldownUntil) return null;
  const unfound = levelDiffs(state).filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  state.hintsLeft -= 1;
  state.hintCooldownUntil = now + HINT_COOLDOWN_MS;
  state.hintPulse = { id: diff.id, until: now + HINT_PULSE_MS };
  return diff;
}

export function nextLevel(state) {
  if (state.screen !== 'levelComplete') return;
  startLevel(state, state.levelIndex + 1);
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
