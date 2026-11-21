// Tidepool Twins — difference definitions, one list per level.
// Coordinates are in panel space (560 x 600); the same spot is checked on
// both panels. `kind` names how the right panel changes the left one, and
// `label` is the friendly name shown when the difference is found. Radii are
// generous on purpose: a click near the spot counts, so the hunt is about
// seeing, not pixel-perfect aiming. A `move` difference also carries altX/altY:
// the spot sits at (x, y) on the left and at (altX, altY) on the right.

export const LEVEL_DIFFS = [
  // Level 1 — Tidepool Morning (7 differences)
  [
    { id: 'sun-color', x: 90, y: 80, r: 48, kind: 'color', label: 'Sun colour' },
    { id: 'starfish-missing', x: 440, y: 500, r: 34, kind: 'missing', label: 'Starfish' },
    { id: 'shell-color', x: 150, y: 540, r: 30, kind: 'color', label: 'Shell colour' },
    { id: 'fish-flip', x: 280, y: 440, r: 36, kind: 'flip', label: 'Fish direction' },
    { id: 'bucket-move', x: 490, y: 320, altX: 490, altY: 372, r: 40, kind: 'move', label: 'Bucket spot' },
    { id: 'cloud-missing', x: 400, y: 70, r: 40, kind: 'missing', label: 'Cloud' },
    { id: 'rock-extra', x: 90, y: 380, r: 32, kind: 'extra', label: 'Extra rock' },
  ],
  // Level 2 — Night Market (8 differences)
  [
    { id: 'lantern-color', x: 120, y: 210, r: 30, kind: 'color', label: 'Lantern colour' },
    { id: 'moon-phase', x: 470, y: 80, r: 42, kind: 'phase', label: 'Moon phase' },
    { id: 'cat-missing', x: 500, y: 540, r: 36, kind: 'missing', label: 'Market cat' },
    { id: 'crate-extra', x: 200, y: 526, r: 34, kind: 'extra', label: 'Extra crate' },
    { id: 'awning-stripes', x: 155, y: 156, r: 42, kind: 'count', label: 'Awning stripes' },
    { id: 'bulb-missing', x: 300, y: 74, r: 24, kind: 'missing', label: 'Fairy bulb' },
    { id: 'sign-flip', x: 180, y: 300, r: 32, kind: 'flip', label: 'Shop sign' },
    { id: 'flag-color', x: 430, y: 180, r: 28, kind: 'color', label: 'Stall flag' },
  ],
  // Level 3 — Star Observatory (10 differences)
  [
    { id: 'planet-color', x: 120, y: 150, r: 40, kind: 'color', label: 'Planet colour' },
    { id: 'star-missing', x: 430, y: 120, r: 24, kind: 'missing', label: 'Bright star' },
    { id: 'telescope-angle', x: 280, y: 330, r: 50, kind: 'angle', label: 'Telescope aim' },
    { id: 'book-count', x: 90, y: 420, r: 34, kind: 'count', label: 'Book count' },
    { id: 'lamp-glow', x: 480, y: 300, r: 36, kind: 'glow', label: 'Lamp glow' },
    { id: 'constellation-line', x: 300, y: 140, r: 40, kind: 'missing', label: 'Constellation line' },
    { id: 'chart-flip', x: 150, y: 500, r: 30, kind: 'flip', label: 'Chart arrow' },
    { id: 'moon-extra', x: 480, y: 90, r: 30, kind: 'extra', label: 'Window moon' },
    { id: 'dome-stripe', x: 280, y: 60, r: 36, kind: 'color', label: 'Dome stripe' },
    { id: 'comet-extra', x: 380, y: 220, r: 30, kind: 'extra', label: 'Comet' },
  ],
];

export function diffsFor(levelIndex) {
  return LEVEL_DIFFS[levelIndex] || LEVEL_DIFFS[0];
}

// Where a difference is drawn on a panel: variant 0 is the left picture,
// variant 1 is the right picture. A `move` difference sits in a different
// place on the right; everything else sits in the same place on both.
export function markerPos(diff, variant) {
  if (variant === 1 && diff.kind === 'move') return { x: diff.altX, y: diff.altY };
  return { x: diff.x, y: diff.y };
}
