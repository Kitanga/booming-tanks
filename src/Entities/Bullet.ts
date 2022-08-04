import DynamicEntity from "./DynamicEntity";

class Bullet extends DynamicEntity {
  public SPEED = 10;
  public bulletDamage = 0;

  public update(dt: number) {
    super.update();

    const mS = this.game.mapSize;
    const spr = this.sprite;
    const vel = this.velocity;

    const x = spr.x + vel.x * dt;
    const y = spr.y + vel.y * dt;

    if (x > -1 && x + spr.width < mS.width) {
      spr.x = x;
    } else {
      this.deactivate();
    }

    if (y > -1 && y + spr.height < mS.height) {
      spr.y = y;
    } else {
      this.deactivate();
    }
  }
}

export default Bullet;
