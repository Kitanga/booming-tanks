import { Circle, Rectangle, Sprite } from "pixi.js";
import Game from "../Game";
import { Vector2 } from "../math/Vector2";
import Entity from "./Entity";

class DynamicEntity extends Entity {
  public velocity: Vector2;
  public direction: Vector2;

  get vx() {
    return this.velocity.x;
  }

  get vy() {
    return this.velocity.y;
  }

  set vx(val: number) {
    this.velocity.x = val;
  }

  set vy(val: number) {
    this.velocity.y = val;
  }

  constructor(sprite: Sprite, bound: Rectangle | Circle, public game: Game) {
    super(sprite, bound, game);

    this.velocity = new Vector2();
    this.direction = new Vector2(1, 0);
  }
}

export default DynamicEntity;
