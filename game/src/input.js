// Tidepool Twins — mouse and keyboard. Clicks land on a difference, on a
// HUD button, or on empty picture (a miss). Keys: H hint, P pause, R restart,
// N next level, Space/click start.

import { PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X } from './config.js';
import { HINT_BTN, PAUSE_BTN, RESTART_BTN } from './render.js';
import { diffsFor, markerPos } from './differences.js';
import {
  startGame,
  startLevel,
  markFound,
  registerMiss,
  useHint,
  nextLevel,
} from './state.js';

function inside(x, y, btn) {
  return x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h;
}

function restartAction(state) {
  if (state.screen === 'title' || state.screen === 'allComplete') startGame(state);
  else startLevel(state, state.levelIndex);
}

function togglePause(state) {
  if (state.screen === 'play') state.screen = 'paused';
  else if (state.screen === 'paused') state.screen = 'play';
}

function panelHit(state, x, y, fx, particles) {
  for (let variant = 0; variant < 2; variant++) {
    const px = variant === 0 ? LEFT_X : RIGHT_X;
    const lx = x - px;
    const ly = y - PANEL_Y;
    if (lx < -8 || lx > PANEL_W + 8 || ly < -8 || ly > PANEL_H + 8) continue;
    for (const diff of diffsFor(state.levelIndex)) {
      if (state.found.has(diff.id)) continue;
      const p = markerPos(diff, variant);
      const dx = lx - p.x;
      const dy = ly - p.y;
      if (dx * dx + dy * dy <= (diff.r + 8) * (diff.r + 8)) {
        const done = markFound(state, diff);
        if (done) {
          // Burst on both panels, at the spot's place in each picture.
          for (let v = 0; v < 2; v++) {
            const q = markerPos(diff, v);
            const cx = (v === 0 ? LEFT_X : RIGHT_X) + q.x;
            const cy = PANEL_Y + q.y;
            particles.burst(cx, cy, '#ffd54a');
            particles.ring(cx, cy);
          }
          if (state.screen === 'levelComplete' || state.screen === 'allComplete') fx.win();
          else fx.chime();
        }
        return true;
      }
    }
    // Click landed inside a picture but on no difference: a miss.
    registerMiss(state);
    fx.buzz();
    return true;
  }
  return false;
}

function handleClick(canvas, state, fx, particles, x, y) {
  if (inside(x, y, RESTART_BTN)) {
    fx.click();
    restartAction(state);
    return;
  }
  if (inside(x, y, PAUSE_BTN)) {
    fx.click();
    togglePause(state);
    return;
  }
  if (inside(x, y, HINT_BTN)) {
    const diff = useHint(state);
    if (diff) fx.hint();
    return;
  }

  if (state.screen === 'title') {
    fx.ensure();
    startGame(state);
  } else if (state.screen === 'play') {
    panelHit(state, x, y, fx, particles);
  } else if (state.screen === 'levelComplete') {
    nextLevel(state);
  } else if (state.screen === 'gameOver') {
    startLevel(state, state.levelIndex);
  } else if (state.screen === 'allComplete') {
    startGame(state);
  }
}

export function attachInput(canvas, state, fx, particles) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    handleClick(canvas, state, fx, particles, x, y);
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') {
      const diff = useHint(state);
      if (diff) fx.hint();
    } else if (key === 'p') {
      togglePause(state);
    } else if (key === 'r') {
      restartAction(state);
    } else if (key === 'n') {
      nextLevel(state);
    } else if (key === ' ' || key === 'enter') {
      event.preventDefault();
      if (state.screen === 'title') {
        fx.ensure();
        startGame(state);
      } else if (state.screen === 'levelComplete') {
        nextLevel(state);
      } else if (state.screen === 'gameOver') {
        startLevel(state, state.levelIndex);
      } else if (state.screen === 'allComplete') {
        startGame(state);
      }
    }
  });
}
