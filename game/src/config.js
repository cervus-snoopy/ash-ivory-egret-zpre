// Tidepool Twins — shared constants: canvas size, panel layout, levels, tuning.
// One place for every number the rest of the game agrees on.

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// Two picture panels, side by side, with a margin around them.
export const PANEL_W = 560;
export const PANEL_H = 600;
export const PANEL_Y = 80;
export const LEFT_X = 30;
export const RIGHT_X = 690;
export const TOP_BAR_H = 64;
export const BOTTOM_BAR_Y = 700;

// Each level: a scene, how many differences hide in it, and its time limit.
export const LEVELS = [
  { name: 'Tidepool Morning', scene: 0, diffs: 7, time: 90 },
  { name: 'Night Market', scene: 1, diffs: 8, time: 75 },
  { name: 'Star Observatory', scene: 2, diffs: 10, time: 60 },
];

export const HINTS_PER_LEVEL = 3;
export const HINT_COOLDOWN_MS = 8000;
export const HINT_PULSE_MS = 2500;
export const MISS_PENALTY_S = 5;
export const FIND_POINTS = 100;
export const COMBO_BONUS = 25;
export const TIME_BONUS_PER_SECOND = 10;

export const GOLD = '#ffd54a';
export const GOLD_DARK = '#c8930a';
export const INK = '#10233b';
export const PANEL_BORDER = '#e8dcc0';
