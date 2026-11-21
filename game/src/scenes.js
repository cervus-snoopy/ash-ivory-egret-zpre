// Tidepool Twins — scene drawing. Every picture is drawn with Canvas 2D
// primitives, no images, no network. Each scene is drawn twice: variant 0 is
// the left picture, variant 1 is the right picture, and the differences from
// differences.js decide what changes. Decorative scatter (pebbles, stars,
// bubbles) comes from a seeded RNG, so both panels always match.

import { PANEL_W, PANEL_H } from './config.js';
import { diffsFor } from './differences.js';
import { range } from './random.js';

function at(levelIndex, id) {
  return diffsFor(levelIndex).find((d) => d.id === id);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function fillCircle(ctx, x, y, r, color) {
  circle(ctx, x, y, r);
  ctx.fillStyle = color;
  ctx.fill();
}

function star5(ctx, x, y, r, color, rot) {
  ctx.beginPath();
  const start = rot === undefined ? -Math.PI / 2 : rot;
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = start + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function cloudShape(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  circle(ctx, x, y, 22 * s);
  ctx.fill();
  circle(ctx, x + 24 * s, y + 6 * s, 17 * s);
  ctx.fill();
  circle(ctx, x - 24 * s, y + 8 * s, 15 * s);
  ctx.fill();
  ctx.fillRect(x - 34 * s, y, 68 * s, 16 * s);
}

function fishShape(ctx, x, y, dir, color, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.fillStyle = color;
  ellipse(ctx, 0, 0, 26 * size, 13 * size);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-22 * size, 0);
  ctx.lineTo(-36 * size, -11 * size);
  ctx.lineTo(-36 * size, 11 * size);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#10233b';
  circle(ctx, 14 * size, -3 * size, 2.5 * size);
  ctx.fill();
  ctx.restore();
}

function shellShape(ctx, x, y, color, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 22, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(16,35,59,0.35)';
  ctx.lineWidth = 2;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(i * 9, -20);
    ctx.stroke();
  }
  ctx.restore();
}

function starfishShape(ctx, x, y, r, color) {
  star5(ctx, x, y, r, color);
  ctx.fillStyle = 'rgba(16,35,59,0.5)';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    fillCircle(ctx, x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45, 2.2, 'rgba(16,35,59,0.5)');
  }
}

function bucketShape(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 16);
  ctx.lineTo(x + 20, y - 16);
  ctx.lineTo(x + 15, y + 18);
  ctx.lineTo(x - 15, y + 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7a5a2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - 14, 20, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(x - 20, y - 16, 40, 6);
}

function rockShape(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - r, y + r * 0.5);
  ctx.quadraticCurveTo(x - r * 0.7, y - r, x, y - r * 0.9);
  ctx.quadraticCurveTo(x + r * 0.8, y - r * 0.7, x + r, y + r * 0.4);
  ctx.quadraticCurveTo(x + r * 0.4, y + r * 0.8, x - r, y + r * 0.5);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ellipse(ctx, x - r * 0.25, y - r * 0.35, r * 0.35, r * 0.18);
  ctx.fill();
}

function crabShape(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 4;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(side * 18, 6 + i * 5);
      ctx.lineTo(side * 34, 12 + i * 7);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#e74c3c';
  ellipse(ctx, 0, 0, 26, 17);
  ctx.fill();
  fillCircle(ctx, -30, -8, 9, '#e74c3c');
  fillCircle(ctx, 30, -8, 9, '#e74c3c');
  ctx.fillStyle = '#fff';
  fillCircle(ctx, -10, -16, 5, '#fff');
  fillCircle(ctx, 10, -16, 5, '#fff');
  ctx.fillStyle = '#10233b';
  fillCircle(ctx, -10, -16, 2.5, '#10233b');
  fillCircle(ctx, 10, -16, 2.5, '#10233b');
  ctx.restore();
}

function seaweedShape(ctx, x, y, h, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 10, y - h * 0.6, x + 6, y - h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 12, y);
  ctx.quadraticCurveTo(x + 20, y - h * 0.5, x + 10, y - h * 0.85);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 1 — Tidepool Morning
// ---------------------------------------------------------------------------
function drawTidepool(ctx, variant, rng) {
  const alt = variant === 1;
  const sky = ctx.createLinearGradient(0, 0, 0, 210);
  sky.addColorStop(0, '#a8dcff');
  sky.addColorStop(1, '#eafaff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, 210);

  // Sun — yellow on the left, orange on the right.
  const sun = at(0, 'sun-color');
  ctx.strokeStyle = alt ? '#ff9a3d' : '#ffd94a';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(sun.x + Math.cos(a) * 52, sun.y + Math.sin(a) * 52);
    ctx.lineTo(sun.x + Math.cos(a) * 64, sun.y + Math.sin(a) * 64);
    ctx.stroke();
  }
  fillCircle(ctx, sun.x, sun.y, 44, alt ? '#ff9a3d' : '#ffd94a');

  // Clouds — one of them only exists on the left.
  cloudShape(ctx, 250, 60, 1, 'rgba(255,255,255,0.95)');
  if (!alt) {
    const c = at(0, 'cloud-missing');
    cloudShape(ctx, c.x, c.y, 0.9, 'rgba(255,255,255,0.95)');
  }
  cloudShape(ctx, 90, 150, 0.7, 'rgba(255,255,255,0.85)');

  // Birds.
  ctx.strokeStyle = '#33506e';
  ctx.lineWidth = 2.5;
  for (const [bx, by] of [[330, 120], [360, 105]]) {
    ctx.beginPath();
    ctx.moveTo(bx - 8, by);
    ctx.quadraticCurveTo(bx, by - 7, bx + 8, by);
    ctx.stroke();
  }

  // Distant sea band.
  ctx.fillStyle = '#4db2e8';
  ctx.fillRect(0, 210, PANEL_W, 52);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2.5;
  for (let wy = 222; wy <= 250; wy += 14) {
    ctx.beginPath();
    for (let wx = 0; wx <= PANEL_W; wx += 14) {
      const yy = wy + Math.sin(wx / 26 + wy) * 3;
      if (wx === 0) ctx.moveTo(wx, yy);
      else ctx.lineTo(wx, yy);
    }
    ctx.stroke();
  }

  // Sand.
  const sand = ctx.createLinearGradient(0, 262, 0, PANEL_H);
  sand.addColorStop(0, '#f2d8a0');
  sand.addColorStop(1, '#e3bd74');
  ctx.fillStyle = sand;
  ctx.fillRect(0, 262, PANEL_W, PANEL_H - 262);
  for (let i = 0; i < 46; i++) {
    fillCircle(ctx, range(rng, 8, PANEL_W - 8), range(rng, 270, PANEL_H - 8), range(rng, 1.5, 4), 'rgba(150,110,50,0.35)');
  }

  // Tidepool.
  ctx.fillStyle = '#5fc4dd';
  ellipse(ctx, 280, 440, 208, 108);
  ctx.fill();
  ctx.fillStyle = '#7fd4e8';
  ellipse(ctx, 280, 436, 188, 92);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(280, 440, 208, 108, 0, Math.PI * 1.05, Math.PI * 1.5);
  ctx.stroke();

  // Fish in the pool — swims the other way on the right.
  const fish = at(0, 'fish-flip');
  fishShape(ctx, fish.x, fish.y, alt ? -1 : 1, '#ff8a5c', 1);
  fishShape(ctx, 200, 470, 1, '#ffb35c', 0.7);
  fishShape(ctx, 350, 410, -1, '#ff8a5c', 0.6);

  // Bubbles rising in the pool.
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  for (let i = 0; i < 8; i++) {
    circle(ctx, range(rng, 150, 420), range(rng, 380, 510), range(rng, 2, 5));
    ctx.fill();
  }

  // Starfish on the sand — only on the left.
  if (!alt) {
    const sf = at(0, 'starfish-missing');
    starfishShape(ctx, sf.x, sf.y, 26, '#ff7f50');
  }
  starfishShape(ctx, 90, 540, 20, '#ff9f5c');

  // Shell — pink on the left, teal on the right.
  const shell = at(0, 'shell-color');
  shellShape(ctx, shell.x, shell.y, alt ? '#5fd3c0' : '#ff9fb0', 1.1);
  shellShape(ctx, 380, 545, '#ffd94a', 0.8);

  // Bucket — lower on the right.
  const bucket = at(0, 'bucket-move');
  const by = alt ? bucket.altY : bucket.y;
  bucketShape(ctx, bucket.x, by, alt ? '#4db2e8' : '#e74c3c');

  // Extra rock — only on the right.
  if (alt) {
    const rk = at(0, 'rock-extra');
    rockShape(ctx, rk.x, rk.y, 26, '#8d8578');
  }
  rockShape(ctx, 520, 430, 30, '#8d8578');
  rockShape(ctx, 60, 300, 22, '#a39a89');

  // Crab and seaweed.
  crabShape(ctx, 420, 560, 1);
  seaweedShape(ctx, 40, 592, 52, '#2e8b57');
  seaweedShape(ctx, 530, 592, 44, '#2e8b57');
  seaweedShape(ctx, 250, 592, 36, '#3aa76d');
}

// ---------------------------------------------------------------------------
// Level 2 — Night Market
// ---------------------------------------------------------------------------
function lanternShape(ctx, x, y, color, r) {
  const glow = ctx.createRadialGradient(x, y, 2, x, y, r + 26);
  glow.addColorStop(0, color);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  circle(ctx, x, y, r + 26);
  ctx.fill();
  fillCircle(ctx, x, y, r, color);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - r, y - 4, r * 2, 5);
  ctx.fillStyle = '#f5d76e';
  ctx.fillRect(x - 3, y - r - 6, 6, 6);
  ctx.fillRect(x - 3, y + r, 6, 8);
}

function stallShape(ctx, x, y, w, awningColors, stripeCount) {
  // Counter.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(x, y + 120, w, 90);
  ctx.fillStyle = '#9c6b3f';
  ctx.fillRect(x, y + 120, w, 10);
  // Awning.
  const stripeW = w / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = awningColors[i % awningColors.length];
    ctx.fillRect(x + i * stripeW, y, stripeW, 52);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x, y + 44, w, 8);
  // Posts.
  ctx.fillStyle = '#5d3d22';
  ctx.fillRect(x + 4, y + 52, 8, 68);
  ctx.fillRect(x + w - 12, y + 52, 8, 68);
}

function catShape(ctx, x, y, color) {
  ctx.fillStyle = color;
  ellipse(ctx, x, y, 22, 26);
  ctx.fill();
  fillCircle(ctx, x, y - 30, 16, color);
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 40);
  ctx.lineTo(x - 18, y - 54);
  ctx.lineTo(x - 4, y - 44);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 14, y - 40);
  ctx.lineTo(x + 18, y - 54);
  ctx.lineTo(x + 4, y - 44);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + 20, y + 18);
  ctx.quadraticCurveTo(x + 40, y + 14, x + 38, y - 6);
  ctx.stroke();
  ctx.fillStyle = '#ffd94a';
  fillCircle(ctx, x - 6, y - 32, 2.5, '#ffd94a');
  fillCircle(ctx, x + 6, y - 32, 2.5, '#ffd94a');
}

function drawNightMarket(ctx, variant, rng) {
  const alt = variant === 1;
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#141b3d');
  sky.addColorStop(1, '#3a2a5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Stars.
  for (let i = 0; i < 60; i++) {
    const sx = range(rng, 0, PANEL_W);
    const sy = range(rng, 0, 300);
    fillCircle(ctx, sx, sy, range(rng, 0.8, 2.2), 'rgba(255,255,255,0.9)');
  }
  // Moon — crescent on the left, full on the right.
  const moon = at(1, 'moon-phase');
  fillCircle(ctx, moon.x, moon.y, 34, '#fdf3c0');
  if (!alt) {
    fillCircle(ctx, moon.x + 16, moon.y - 6, 30, '#141b3d');
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  fillCircle(ctx, moon.x - 10, moon.y + 8, 6, 'rgba(0,0,0,0.12)');
  fillCircle(ctx, moon.x + 8, moon.y - 12, 4, 'rgba(0,0,0,0.12)');

  // Fairy lights across the top. Bulbs hang every 40 px starting at x = 20,
  // so the bulb at x = 300 (index 7) is the one that goes missing on the right.
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(280, 92, PANEL_W, 30);
  ctx.stroke();
  for (let i = 0; i <= 13; i++) {
    const bx = 20 + i * 40;
    const t = i / 13;
    const by = 30 + Math.sin(t * Math.PI) * 34;
    // One bulb is missing on the right.
    if (alt && i === 7) continue;
    fillCircle(ctx, bx, by + 10, 6, ['#ffd94a', '#ff7f7f', '#7fd4ff', '#9dff9d'][i % 4]);
  }

  // Ground.
  ctx.fillStyle = '#3a3355';
  ctx.fillRect(0, 480, PANEL_W, PANEL_H - 480);
  for (let i = 0; i < 30; i++) {
    fillCircle(ctx, range(rng, 8, PANEL_W - 8), range(rng, 490, PANEL_H - 8), range(rng, 1.5, 3.5), 'rgba(255,255,255,0.12)');
  }

  // Stall A (left): fruit stall. Awning has 5 stripes left, 4 right.
  stallShape(ctx, 40, 130, 230, ['#e74c3c', '#fdf6e3'], alt ? 4 : 5);
  // Fruit on the counter.
  for (let i = 0; i < 6; i++) {
    fillCircle(ctx, 70 + i * 32, 232, 12, i % 2 ? '#ff6b35' : '#ffd94a');
  }
  for (let i = 0; i < 5; i++) {
    fillCircle(ctx, 86 + i * 32, 210, 11, i % 2 ? '#7ed957' : '#ff6b35');
  }
  // Hanging lantern — red on the left, green on the right.
  const lan = at(1, 'lantern-color');
  lanternShape(ctx, lan.x, lan.y, alt ? '#7ed957' : '#ff5252', 22);
  lanternShape(ctx, 240, 210, '#ffb35c', 18);

  // Shop sign — a fish that faces the other way on the right.
  const sign = at(1, 'sign-flip');
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(sign.x - 42, sign.y - 26, 84, 52);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 3;
  ctx.strokeRect(sign.x - 42, sign.y - 26, 84, 52);
  fishShape(ctx, sign.x, sign.y, alt ? -1 : 1, '#e74c3c', 0.55);

  // Stall B (right): cloth stall.
  stallShape(ctx, 320, 130, 200, ['#4db2e8', '#fdf6e3'], 5);
  // Folded cloths on the counter.
  const clothColors = ['#ff9fb0', '#7fd4ff', '#9dff9d', '#ffd94a'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = clothColors[i];
    ctx.fillRect(336 + i * 44, 226, 36, 22);
  }
  // Flag on stall B — blue on the left, yellow on the right.
  const flag = at(1, 'flag-color');
  ctx.strokeStyle = '#5d3d22';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(flag.x, flag.y - 30);
  ctx.lineTo(flag.x, flag.y + 14);
  ctx.stroke();
  ctx.fillStyle = alt ? '#ffd94a' : '#4db2e8';
  ctx.beginPath();
  ctx.moveTo(flag.x, flag.y - 30);
  ctx.lineTo(flag.x + 30, flag.y - 21);
  ctx.lineTo(flag.x, flag.y - 12);
  ctx.closePath();
  ctx.fill();

  // Crates — one extra on the right.
  ctx.fillStyle = '#a8763e';
  ctx.fillRect(60, 500, 52, 52);
  ctx.fillRect(116, 500, 52, 52);
  ctx.fillRect(88, 448, 52, 52);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 500, 52, 52);
  ctx.strokeRect(116, 500, 52, 52);
  ctx.strokeRect(88, 448, 52, 52);
  if (alt) {
    const cr = at(1, 'crate-extra');
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(cr.x - 26, cr.y - 26, 52, 52);
    ctx.strokeStyle = '#7a5230';
    ctx.strokeRect(cr.x - 26, cr.y - 26, 52, 52);
  }

  // Market cat — only on the left.
  if (!alt) {
    const cat = at(1, 'cat-missing');
    catShape(ctx, cat.x, cat.y, '#2b2b3a');
  }
}

// ---------------------------------------------------------------------------
// Level 3 — Star Observatory
// ---------------------------------------------------------------------------
function telescopeShape(ctx, x, y, angleDeg, color) {
  ctx.save();
  ctx.translate(x, y);
  // Tripod legs.
  ctx.strokeStyle = '#5d3d22';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const dx of [-34, 0, 34]) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dx, 120);
    ctx.stroke();
  }
  // Tube, tilted up on the left and down on the right.
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.fillRect(-14, -110, 28, 120);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(-18, -118, 36, 22);
  fillCircle(ctx, 0, -118, 12, '#bfe8ff');
  ctx.restore();
}

function bookshelfShape(ctx, x, y, count) {
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(x, y, 120, 90);
  ctx.fillStyle = '#5d3d22';
  ctx.fillRect(x, y + 44, 120, 6);
  const colors = ['#e74c3c', '#4db2e8', '#7ed957', '#ffd94a', '#ff9fb0'];
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x + 8 + i * 21, y + 8, 17, 36);
  }
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[(i + 2) % colors.length];
    ctx.fillRect(x + 8 + i * 21, y + 54, 17, 32);
  }
}

function drawObservatory(ctx, variant, rng) {
  const alt = variant === 1;
  // Wall.
  const wall = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  wall.addColorStop(0, '#2b2f55');
  wall.addColorStop(1, '#1d2140');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);

  // Dome arc at the top, with a stripe that changes colour.
  const stripe = at(2, 'dome-stripe');
  ctx.fillStyle = '#3a4066';
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.quadraticCurveTo(280, -70, PANEL_W, 110);
  ctx.lineTo(PANEL_W, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = alt ? '#b06fd6' : '#4db2a8';
  ctx.fillRect(stripe.x - 60, 18, 120, 14);
  // Dome light — bright left, dim right.
  fillCircle(ctx, 300, 62, 14, alt ? '#555a7a' : '#fff3b0');
  if (!alt) {
    const glow = ctx.createRadialGradient(300, 62, 4, 300, 62, 60);
    glow.addColorStop(0, 'rgba(255,243,176,0.5)');
    glow.addColorStop(1, 'rgba(255,243,176,0)');
    ctx.fillStyle = glow;
    circle(ctx, 300, 62, 60);
    ctx.fill();
  }

  // Big window with the night sky.
  ctx.fillStyle = '#0b1030';
  ctx.fillRect(360, 60, 180, 200);
  ctx.strokeStyle = '#8d8578';
  ctx.lineWidth = 6;
  ctx.strokeRect(360, 60, 180, 200);
  ctx.beginPath();
  ctx.moveTo(450, 60);
  ctx.lineTo(450, 260);
  ctx.moveTo(360, 160);
  ctx.lineTo(540, 160);
  ctx.stroke();
  for (let i = 0; i < 26; i++) {
    fillCircle(ctx, range(rng, 366, 534), range(rng, 66, 254), range(rng, 0.8, 2), 'rgba(255,255,255,0.9)');
  }
  // One bright star is missing on the right.
  if (!alt) {
    const st = at(2, 'star-missing');
    star5(ctx, st.x, st.y, 12, '#fff3b0');
  }
  // A moon appears in the window only on the right.
  if (alt) {
    const mn = at(2, 'moon-extra');
    fillCircle(ctx, mn.x, mn.y, 20, '#fdf3c0');
    fillCircle(ctx, mn.x + 9, mn.y - 4, 17, '#0b1030');
  }
  // A comet crosses the window only on the right.
  if (alt) {
    const cm = at(2, 'comet-extra');
    ctx.strokeStyle = 'rgba(255,243,176,0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cm.x, cm.y);
    ctx.lineTo(cm.x - 34, cm.y - 16);
    ctx.stroke();
    fillCircle(ctx, cm.x, cm.y, 7, '#fff3b0');
  }

  // Planet poster — red on the left, blue on the right.
  const planet = at(2, 'planet-color');
  fillCircle(ctx, planet.x, planet.y, 34, alt ? '#4db2e8' : '#e74c3c');
  ctx.strokeStyle = '#ffd94a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(planet.x, planet.y, 52, 14, -0.4, 0, Math.PI * 2);
  ctx.stroke();

  // Constellation chart — the line joining the stars is missing on the right.
  const con = at(2, 'constellation-line');
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(con.x - 70, con.y - 44, 140, 88);
  const pts = [[-46, -22], [-12, -30], [18, -8], [44, -26], [30, 22], [-8, 16]];
  if (!alt) {
    ctx.strokeStyle = '#33506e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach(([px, py], i) => {
      if (i === 0) ctx.moveTo(con.x + px, con.y + py);
      else ctx.lineTo(con.x + px, con.y + py);
    });
    ctx.stroke();
  }
  for (const [px, py] of pts) {
    fillCircle(ctx, con.x + px, con.y + py, 4, '#e74c3c');
  }

  // Floor.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 520, PANEL_W, PANEL_H - 520);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let fx = 0; fx <= PANEL_W; fx += 70) {
    ctx.beginPath();
    ctx.moveTo(fx, 520);
    ctx.lineTo(fx, PANEL_H);
    ctx.stroke();
  }

  // Bookshelf — 5 books on the left, 4 on the right.
  const books = at(2, 'book-count');
  bookshelfShape(ctx, books.x - 60, books.y - 40, alt ? 4 : 5);

  // Telescope — aimed up on the left, down on the right.
  const tele = at(2, 'telescope-angle');
  telescopeShape(ctx, tele.x, tele.y, alt ? 18 : -28, '#3a6ea5');

  // Lamp — glowing on the left, dark on the right.
  const lamp = at(2, 'lamp-glow');
  if (!alt) {
    const glow = ctx.createRadialGradient(lamp.x, lamp.y - 30, 4, lamp.x, lamp.y - 30, 80);
    glow.addColorStop(0, 'rgba(255,220,120,0.55)');
    glow.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = glow;
    circle(ctx, lamp.x, lamp.y - 30, 80);
    ctx.fill();
  }
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(lamp.x, lamp.y + 40);
  ctx.lineTo(lamp.x, lamp.y - 20);
  ctx.stroke();
  ctx.fillStyle = alt ? '#6b6f8a' : '#ffd94a';
  ctx.beginPath();
  ctx.moveTo(lamp.x - 24, lamp.y - 20);
  ctx.lineTo(lamp.x + 24, lamp.y - 20);
  ctx.lineTo(lamp.x + 14, lamp.y - 52);
  ctx.lineTo(lamp.x - 14, lamp.y - 52);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(lamp.x - 18, lamp.y + 36, 36, 8);

  // Wall chart with an arrow — pointing right on the left, left on the right.
  const chart = at(2, 'chart-flip');
  ctx.fillStyle = '#fdf6e3';
  ctx.fillRect(chart.x - 52, chart.y - 34, 104, 68);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 2;
  ctx.strokeRect(chart.x - 52, chart.y - 34, 104, 68);
  ctx.strokeStyle = '#33506e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(chart.x - 34, chart.y + 12);
  ctx.lineTo(chart.x - 34, chart.y - 14);
  ctx.lineTo(chart.x + 10, chart.y - 14);
  ctx.stroke();
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  if (alt) {
    ctx.moveTo(chart.x - 34, chart.y - 14);
    ctx.lineTo(chart.x - 14, chart.y - 24);
    ctx.lineTo(chart.x - 14, chart.y - 4);
  } else {
    ctx.moveTo(chart.x + 10, chart.y - 14);
    ctx.lineTo(chart.x - 10, chart.y - 24);
    ctx.lineTo(chart.x - 10, chart.y - 4);
  }
  ctx.closePath();
  ctx.fill();

  // Rocket model on the floor, two fins on both sides.
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath();
  ctx.moveTo(482, 470);
  ctx.lineTo(498, 470);
  ctx.lineTo(498, 510);
  ctx.lineTo(482, 510);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(482, 470);
  ctx.lineTo(490, 452);
  ctx.lineTo(498, 470);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.moveTo(482, 510);
  ctx.lineTo(474, 522);
  ctx.lineTo(482, 516);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(498, 510);
  ctx.lineTo(506, 522);
  ctx.lineTo(498, 516);
  ctx.closePath();
  ctx.fill();
}

// Draw one whole panel (variant 0 left, variant 1 right) for a level.
export function drawScene(ctx, levelIndex, variant, rng) {
  ctx.save();
  if (levelIndex === 0) drawTidepool(ctx, variant, rng);
  else if (levelIndex === 1) drawNightMarket(ctx, variant, rng);
  else drawObservatory(ctx, variant, rng);
  ctx.restore();
}
