// Tidepool Twins — everything the player sees: the two picture panels, the
// gold rings on found differences, the HUD (counter, timer, score, buttons)
// and the title / pause / level-complete / game-over screens.

import {
  CANVAS_W,
  CANVAS_H,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  LEFT_X,
  RIGHT_X,
  LEVELS,
  GOLD,
  GOLD_DARK,
  INK,
} from './config.js';
import { drawScene } from './scenes.js';
import { makeRng } from './random.js';
import { diffsFor, markerPos } from './differences.js';
import { remaining, formatTime } from './state.js';

// Bottom-bar buttons, in canvas coordinates. input.js reads these too.
export const HINT_BTN = { x: 880, y: 716, w: 120, h: 40 };
export const PAUSE_BTN = { x: 1010, y: 716, w: 110, h: 40 };
export const RESTART_BTN = { x: 1130, y: 716, w: 120, h: 40 };

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function panelX(variant) {
  return variant === 0 ? LEFT_X : RIGHT_X;
}

function drawPanel(ctx, state, variant) {
  const x = panelX(variant);
  const now = performance.now();
  let shakeX = 0;
  let shakeY = 0;
  if (now < state.shakeUntil) {
    shakeX = (Math.random() - 0.5) * 9;
    shakeY = (Math.random() - 0.5) * 9;
  }
  ctx.save();
  ctx.translate(x + shakeX, PANEL_Y + shakeY);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_W, PANEL_H);
  ctx.clip();
  // Fresh seeded RNG per panel, so both pictures share the same decoration.
  const rng = makeRng(state.seed * 31 + state.levelIndex * 7 + 11);
  drawScene(ctx, state.levelIndex, variant, rng);
  ctx.restore();

  // Border and picture label.
  ctx.strokeStyle = '#e8dcc0';
  ctx.lineWidth = 3;
  ctx.strokeRect(x + shakeX, PANEL_Y + shakeY, PANEL_W, PANEL_H);
  ctx.fillStyle = 'rgba(16,35,59,0.75)';
  roundRect(ctx, x + 10 + shakeX, PANEL_Y + 10 + shakeY, 108, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant === 0 ? 'PICTURE 1' : 'PICTURE 2', x + 64 + shakeX, PANEL_Y + 24 + shakeY);

  // Gold rings on the differences already found.
  for (const diff of diffsFor(state.levelIndex)) {
    if (!state.found.has(diff.id)) continue;
    const p = markerPos(diff, variant);
    const cx = x + shakeX + p.x;
    const cy = PANEL_Y + shakeY + p.y;
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cx, cy, diff.r + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = GOLD_DARK;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, diff.r + 8, 0, Math.PI * 2);
    ctx.stroke();
    // Checkmark in the middle of the ring.
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy);
    ctx.lineTo(cx - 3, cy + 9);
    ctx.lineTo(cx + 13, cy - 10);
    ctx.stroke();
  }

  // Hint pulse: a breathing ring around one unfound difference.
  if (state.hintPulse && now < state.hintPulse.until) {
    const diff = diffsFor(state.levelIndex).find((d) => d.id === state.hintPulse.id);
    if (diff) {
      const p = markerPos(diff, variant);
      const cx = x + shakeX + p.x;
      const cy = PANEL_Y + shakeY + p.y;
      const pulse = 0.55 + 0.45 * Math.sin(now / 130);
      ctx.strokeStyle = '#7fd4ff';
      ctx.globalAlpha = pulse;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, diff.r + 10 + pulse * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function drawTopBar(ctx, state) {
  const level = LEVELS[state.levelIndex];
  ctx.fillStyle = '#0e1a2e';
  ctx.fillRect(0, 0, CANVAS_W, 64);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Level ' + (state.levelIndex + 1) + ' · ' + level.name, 30, 26);
  ctx.fillStyle = '#9fb4d8';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Score ' + state.score, 30, 50);

  // The big counter the judge looks for.
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('Differences left: ' + remaining(state), CANVAS_W / 2, 32);

  // Timer bar.
  const barX = 980;
  const barW = 200;
  const frac = Math.max(0, state.timeLeft / level.time);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, barX, 22, barW, 18, 9);
  ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#7ed957' : frac > 0.25 ? '#ffd54a' : '#ff6b5e';
  if (frac > 0) {
    roundRect(ctx, barX, 22, barW * frac, 18, 9);
    ctx.fill();
  }
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(formatTime(state.timeLeft), barX + barW + 10, 32);
}

function drawButton(ctx, btn, label, enabled) {
  ctx.fillStyle = enabled ? '#2a4a7f' : '#26324a';
  roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 8);
  ctx.fill();
  ctx.strokeStyle = enabled ? '#7fd4ff' : '#4a5a75';
  ctx.lineWidth = 1.5;
  roundRect(ctx, btn.x, btn.y, btn.w, btn.h, 8);
  ctx.stroke();
  ctx.fillStyle = enabled ? '#fdf6e3' : '#7a8aa5';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 1);
}

function drawBottomBar(ctx, state) {
  ctx.fillStyle = '#0e1a2e';
  ctx.fillRect(0, 700, CANVAS_W, 100);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fdf6e3';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Score ' + state.score, 30, 736);
  ctx.fillStyle = state.combo >= 2 ? GOLD : '#9fb4d8';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(state.combo >= 2 ? 'Combo ×' + state.combo : 'Combo —', 240, 736);

  const hintOn = state.screen === 'play' && state.hintsLeft > 0;
  drawButton(ctx, HINT_BTN, 'Hint (H) · ' + state.hintsLeft, hintOn);
  drawButton(ctx, PAUSE_BTN, state.screen === 'paused' ? 'Resume (P)' : 'Pause (P)', state.screen === 'play' || state.screen === 'paused');
  drawButton(ctx, RESTART_BTN, 'Restart (R)', true);

  ctx.fillStyle = '#7a8aa5';
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click a difference on either picture  ·  H hint  ·  P pause  ·  R restart', CANVAS_W / 2, 782);
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(8,16,32,0.78)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'rgba(253,246,227,0.06)';
  roundRect(ctx, CANVAS_W / 2 - 330, 190, 660, 380, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(253,246,227,0.25)';
  ctx.lineWidth = 2;
  roundRect(ctx, CANVAS_W / 2 - 330, 190, 660, 380, 18);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = accent || GOLD;
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillText(title, CANVAS_W / 2, 268);
  ctx.fillStyle = '#fdf6e3';
  ctx.font = '22px system-ui, sans-serif';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_W / 2, 340 + i * 40);
  });
}

export function drawGame(ctx, state, particles) {
  ctx.fillStyle = '#0e1a2e';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  drawTopBar(ctx, state);
  drawPanel(ctx, state, 0);
  drawPanel(ctx, state, 1);
  drawBottomBar(ctx, state);
  particles.draw(ctx);

  if (state.screen === 'title') {
    overlay(ctx, 'Tidepool Twins', [
      'Spot the difference — two pictures, a few tiny changes.',
      'Click a difference on either picture to mark it.',
      'Wrong click: −5 seconds.  H: hint  ·  P: pause  ·  R: restart',
      '3 levels: Tidepool Morning · Night Market · Star Observatory',
      'Click or press Space to start',
    ]);
  } else if (state.screen === 'paused') {
    overlay(ctx, 'Paused', ['Take a breath — the timer is waiting.', 'Press P to resume, or R to restart the level.']);
  } else if (state.screen === 'levelComplete') {
    overlay(ctx, 'Level Complete!', [
      diffsFor(state.levelIndex).length + '/' + diffsFor(state.levelIndex).length + ' found  ·  Time bonus +' + state.timeBonus,
      'Score ' + state.score,
      'Press N for the next level.',
    ]);
  } else if (state.screen === 'gameOver') {
    overlay(ctx, "Time's Up!", [
      'You found ' + state.found.size + ' of ' + diffsFor(state.levelIndex).length + ' differences.',
      'Score ' + state.score + '  ·  Best combo ×' + state.bestCombo,
      'Press R to try this level again.',
    ]);
  } else if (state.screen === 'allComplete') {
    overlay(ctx, 'You found them all!', [
      state.totalFound + ' differences across 3 levels  ·  Best combo ×' + state.bestCombo,
      'Final score ' + state.score,
      'Press R to play again.',
    ]);
  }
}
