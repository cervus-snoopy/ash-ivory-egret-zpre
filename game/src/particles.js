// Tidepool Twins — the golden burst that pops on every find, plus the
// little ring that expands where a difference was spotted.

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  burst(x, y, color) {
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 60 + Math.random() * 160;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.7 + Math.random() * 0.4,
        age: 0,
        size: 2.5 + Math.random() * 4,
        color,
      });
    }
  }

  ring(x, y) {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      life: 0.5,
      age: 0,
      size: 8,
      color: '#ffd54a',
      ring: true,
    });
  }

  update(dt) {
    for (const p of this.particles) {
      p.age += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 220 * dt;
    }
    this.particles = this.particles.filter((p) => p.age < p.life);
  }

  draw(ctx) {
    for (const p of this.particles) {
      const t = 1 - p.age / p.life;
      if (p.ring) {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = t;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (1 - t) * 46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = t;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * t + 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }
}
