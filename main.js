canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");
let playerDied = false;

const lerp = (a, b, points) => {
  const radi = [];
  for (let i = points; i < 0; i--) {
    radi.push(a + ((b - a) * i) / 10);
  }
  return radi;
};
const player = new Player(canvas.width / 2, canvas.height / 2);
const enemies = [];
const particles = [];

function createEnemies() {
  const radius = Math.random() * (50 - 5) + 5;
  const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  }`;
  const yLimit = [0, canvas.height][Math.floor(Math.random() * 2)];
  const xLimit = [0, canvas.width][Math.floor(Math.random() * 2)];
  let [x, y] = [xLimit, yLimit];
  const flip = Math.random() >= 0.5;
  if (flip) {
    x = Math.random() * canvas.width;
  } else {
    y = Math.random() * canvas.height;
  }
  const angle = Math.atan2(player.y - y, player.x - x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  const enemy = new Enemy(x, y, radius, color, velocity);
  enemies.push(enemy);
}

function spawnEnemies() {
  setInterval(createEnemies, 1500);
}

addEventListener("click", (event) => {
  player.shoot(event.clientX, event.clientY);
});
player.draw(ctx);
let ballI = 0;
function updateScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.update(ctx);
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update(ctx);
    }
  });

  enemies.forEach((enemy, index) => {
    const enemyDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (enemyDist - (enemy.radius + player.radius) < 1) {
      playerDied = true;
      return;
    }

    enemy.update(ctx);
    player.projectiles.forEach((projectile, i) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      // detect touch
      if (dist - (enemy.radius + projectile.radius * 2) < 1) {
        for (let j = 0; j < enemy.radius; j++) {
          const newParticle = new Particle(
            projectile.x,
            projectile.y,
            Math.random() * 2,
            enemy.color,
            {
              x: (Math.random() - 0.5) * (Math.random() * 8),
              y: (Math.random() - 0.5) * (Math.random() * 8),
            }
          );
          particles.push(newParticle);
        }
        if (enemy.radius > 20) {
          enemy.radius = enemy.radius * 0.5;
        } else {
          enemies.splice(index, 1);
        }

        player.projectiles.splice(i, 1);
      }
    });
  });
}

function animate() {
  if (!playerDied) {
    requestAnimationFrame(animate);
    updateScreen();
  } else {
    return;
  }
}

animate();
spawnEnemies();
