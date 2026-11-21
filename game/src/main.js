// Tidepool Twins — boot and game loop. Reads ?seed= (deterministic scenes)
// and ?shot= (staged screenshot states), then runs the loop: timer ticks
// down while playing, particles age, and the renderer paints every frame.

import { CANVAS_W, CANVAS_H } from './config.js';
import { createState } from './state.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { SoundFX } from './audio.js';
import { ParticleSystem } from './particles.js';
import { applyShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const seed = parseInt(params.get('seed') || '7', 10) || 7;
const shot = params.get('shot');

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
const ctx = canvas.getContext('2d');

const state = createState(seed);
const fx = new SoundFX();
const particles = new ParticleSystem();

attachInput(canvas, state, fx, particles);
if (shot) applyShot(state, shot);

// Exposed for play-testing: the test driver reads state through this.
window.__game = { state, fx, particles };
window.__shotReady = false;

let last = performance.now();
let frames = 0;

function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;

  if (state.screen === 'play') {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'gameOver';
      fx.lose();
    }
  }
  if (state.hintPulse && now > state.hintPulse.until) state.hintPulse = null;

  particles.update(dt);
  drawGame(ctx, state, particles);

  frames += 1;
  if (frames >= 2) window.__shotReady = true;
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
