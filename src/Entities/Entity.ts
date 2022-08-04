import { Circle, Graphics, Rectangle, SHAPES, Sprite } from "pixi.js";
import Game from "../Game";
import { Vector2 } from "../math/Vector2";

export enum BoundType {
  CIRCLE,
  RECTANLGE,
}

export interface ICollisionDirection {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;

  target?: Entity;
}

class Entity {
  // bound: Rectangle | Circle;
  // boundType: BoundType;

  public isActive = true;

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  set x(val: number) {
    this.prev.x = this.sprite.x;
    this.sprite.x = val;
  }

  set y(val: number) {
    this.prev.y = this.sprite.y;
    this.sprite.y = val;
  }

  public prev = new Vector2();

  public isColliding = false;

  private debugGraphic: Graphics;

  // For resolving collisions
  public restitution = 0.2;

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.height;
  }

  get halfWidth() {
    return this.width * 0.5;
  }

  get halfHeight() {
    return this.height * 0.5;
  }

  get midX() {
    return this.halfWidth + this.x;
  }

  get midY() {
    return this.halfHeight + this.y;
  }

  get right() {
    return this.sprite.getBounds().right;
  }
  get left() {
    return this.sprite.getBounds().left;
  }
  get top() {
    return this.sprite.getBounds().top;
  }
  get bottom() {
    return this.sprite.getBounds().bottom;
  }

  public colliding: ICollisionDirection = {
    left: false,
    right: false,
    top: false,
    bottom: false,

    target: undefined,
  };

  /**
   * An entity with information for collisions
   *
   * @param position Position of entity
   * @param bound The bound shape itself
   */
  constructor(
    public sprite: Sprite,
    public bound: Rectangle | Circle,
    public game: Game,
    public isStatic = false
  ) {
    game.entities.add(this);

    this.debugGraphic = new Graphics();
    game.gameContainer.addChild(this.debugGraphic);

    sprite.pivot.set(this.halfWidth, this.halfHeight);

    // this.update();

    // this.syncBound();
  }

  public syncBound() {
    const { bound, sprite } = this;

    if (bound.type === SHAPES.CIRC) {
      bound.x = sprite.x + sprite.width * 0.5;
      bound.y = sprite.y + sprite.height * 0.5;
    } else if (bound.type === SHAPES.RECT) {
      bound.x = sprite.x;
      bound.y = sprite.y;
    }
  }

  public update(dt?: number) {
    const { bound, sprite } = this;

    if (bound.type === SHAPES.RECT) {
      bound.x = sprite.x;
      bound.y = sprite.y;
    } else if (bound.type === SHAPES.CIRC) {
      bound.x = sprite.x + sprite.width * 0.5;
      bound.y = sprite.y + sprite.height * 0.5;
    }

    // this.drawDebugInfo();
  }

  public reset() {
    this.isColliding = false;

    this.colliding.left = false;
    this.colliding.right = false;
    this.colliding.top = false;
    this.colliding.bottom = false;
    this.colliding.target = undefined;
  }

  public deactivate() {
    this.sprite.visible = false;
    this.isActive = false;
  }

  public activate() {
    this.sprite.visible = true;
    this.isActive = true;
  }

  drawDebugInfo() {
    const grp = this.debugGraphic;

    grp.clear();

    // Rectangle
    if (this.isColliding) {
      grp.beginFill(0x0000ff);
    } else {
      grp.beginFill(0xffff00);
    }
    // grp.lineStyle(2, 0xffff00);
    if (this.bound.type === SHAPES.CIRC) {
      const bound = this.bound as Circle;

      grp.drawCircle(
        bound.x - bound.radius,
        bound.y - bound.radius,
        bound.radius
      );
    } else if (this.bound.type === SHAPES.RECT) {
      const bound = this.bound as Rectangle;

      grp.drawRect(
        bound.x - bound.width * 0.5,
        bound.y - bound.height * 0.5,
        bound.width,
        bound.height
      );
    }
    grp.endFill();
  }
}

export default Entity;
