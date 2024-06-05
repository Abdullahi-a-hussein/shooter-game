class Player {
  constructor(x, y, radius = 15, color = "white") {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.projectiles = [];
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  }
  shoot(x, y) {
    const angle = Math.atan2(y - this.y, x - this.x);
    const velocity = { x: Math.cos(angle) * 10, y: Math.sin(angle) * 10 };
    const projectileColor = "white";
    const projectile = new Projectile(
      this.x,
      this.y,
      this.radius / 4,
      projectileColor,
      velocity
    );
    this.projectiles.push(projectile);
  }
  update(ctx) {
    this.draw(ctx);
    this.projectiles.forEach((projectile, index) => {
      projectile.update(ctx);
      if (
        projectile.x > ctx.canvas.widh ||
        projectile.x < 0 ||
        projectile.y > ctx.canvas.height ||
        projectile.y < 0
      ) {
        this.projectiles.splice(index, 1);
      }
    });
  }
}
