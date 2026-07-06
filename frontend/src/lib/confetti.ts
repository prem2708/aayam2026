import confetti from 'canvas-confetti';

const FEST_COLORS = ['#FF9933', '#FFFFFF', '#138808'];

export function fireFestConfetti() {
  const count = 80;
  const defaults = {
    origin: { y: 0.6 },
    colors: FEST_COLORS,
    ticks: 120,
    gravity: 1.1,
    scalar: 0.9,
    spread: 70,
  };

  confetti({ ...defaults, particleCount: count * 0.4 });
  confetti({ ...defaults, particleCount: count * 0.3, spread: 100, origin: { x: 0.2, y: 0.65 } });
  confetti({ ...defaults, particleCount: count * 0.3, spread: 100, origin: { x: 0.8, y: 0.65 } });
}

export function fireSubtleConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.5 },
    colors: FEST_COLORS,
    ticks: 100,
    gravity: 0.8,
    scalar: 0.7,
    startVelocity: 20,
  });
}
