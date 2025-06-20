
const canvas = document.getElementById('bubble-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Bubble {
  constructor(x, y, vx, vy, r) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.r = r;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(115, 0, 39, 0.4)';
    ctx.fill();
  }

  update(bubbles) {
    // wall collision
    if (this.x + this.r > canvas.width || this.x - this.r < 0) this.vx *= -1;
    if (this.y + this.r > canvas.height || this.y - this.r < 0) this.vy *= -1;

    // collision with other bubbles
    for (const other of bubbles) {
      if (other === this) continue;
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const dist = Math.hypot(dx, dy);
      const minDist = this.r + other.r;
      if (dist < minDist) {
        // simple elastic collision response
        const angle = Math.atan2(dy, dx);
        const sine = Math.sin(angle);
        const cosine = Math.cos(angle);

        // rotate velocities
        const vx1 = this.vx * cosine + this.vy * sine;
        const vy1 = this.vy * cosine - this.vx * sine;
        const vx2 = other.vx * cosine + other.vy * sine;
        const vy2 = other.vy * cosine - other.vx * sine;

        // swap x velocities
        const vxFinal1 = vx2;
        const vxFinal2 = vx1;

        // rotate back
        this.vx = vxFinal1 * cosine - vy1 * sine;
        this.vy = vy1 * cosine + vxFinal1 * sine;
        other.vx = vxFinal2 * cosine - vy2 * sine;
        other.vy = vy2 * cosine + vxFinal2 * sine;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

// Create bubbles
const bubbles = [];
const count = 40;
for (let i = 0; i < count; i++) {
  const r = 10 + Math.random() * 20;
  const x = Math.random() * (canvas.width - 2 * r) + r;
  const y = Math.random() * (canvas.height - 2 * r) + r;
  const vx = (Math.random() - 0.5) * 3;
  const vy = (Math.random() - 0.5) * 3;
  bubbles.push(new Bubble(x, y, vx, vy, r));
}
document.addEventListener("DOMContentLoaded", () => {
const background = document.querySelector(".bubble-background");
const bubbleCount = 20;

for (let i = 1; i <= bubbleCount; i++) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${18 + Math.random() * 10}s`;
  const size = 18 + Math.random() * 25;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  background.appendChild(bubble);
}
});
// Animation
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const b of bubbles) {
    b.update(bubbles);
    b.draw();
  }
  requestAnimationFrame(animate);
}
animate();