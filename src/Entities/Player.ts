import { Graphics, Sprite } from "pixi.js";
import { KeyCodes } from "../constants/KeyCodes";
import ControlsController, {
  ActionType,
  InputType
} from "../controllers/ControlsController";
import Game from "../Game";
import { Vector2 } from "../math/Vector2";
import createSpriteFromGraphic from "../Utils/createSpriteFromGraphic";
import Bullet from "./Bullet";
import DynamicEntity from "./DynamicEntity";
import Entity from "./Entity";

export enum TankType {
  RED,
  BLUE,
  GREEN,
}

export interface ITankDamage {
  [TankType.RED]: number;
  [TankType.BLUE]: number;
  [TankType.GREEN]: number;
}

class Player extends DynamicEntity {
  // Controllers
  public controlsController: ControlsController;

  public SPEED = 3.4;
  public rotationSpeed = Math.PI * 0.025;

  public bulletPool: Bullet[] = [];
  public bulletCount = 100;
  protected nextShot = 0;
  protected timeBetweenShoots = 250;

  public damage: ITankDamage = {
    [TankType.RED]: 10,
    [TankType.BLUE]: 20,
    [TankType.GREEN]: 25,
  };

  public availableTankTypes: TankType[] = [
    TankType.RED,
    TankType.BLUE,
    TankType.GREEN,
  ];

  public tankType: TankType;

  protected nextSwitch = 0;
  protected timeBetweenSwitches = 340;

  constructor(game: Game, public sprites: Sprite[]) {
    super(sprites[0], sprites[0].getBounds(), game);

    // @ts-ignore
    window.player = this;
    // @ts-ignore
    window.gS = this.game.gameSettings;

    this.bulletPool = new Array(this.bulletCount).fill(0).map((val) => {
      const bullet = this.createBullet();

      return bullet;
    });

    this.tankType = this.availableTankTypes[0];

    this.sprites.forEach((sprite) => {
      sprite.visible = false;
      sprite.pivot.set(sprite.width * 0.5, sprite.height * 0.5);
    });

    this.switchTank();

    this.controlsController = new ControlsController(InputType.KEYBOARD, {
      forward: KeyCodes.W,
      backward: KeyCodes.S,
      left: KeyCodes.A,
      right: KeyCodes.D,

      shoot: KeyCodes.SPACE,
      switch: KeyCodes.T,
    });

    this.x = 50 * game.gameSettings.tileWidth * 0.5;
    this.y = 50 * game.gameSettings.tileHeight * 0.5;
  }

  public update(dt: number) {
    super.update(dt);

    const spr = this.sprites[this.tankType];
    const vel = this.velocity;
    const mS = this.game.mapSize;
    const dir = this.direction;
    const spd = this.SPEED;
    const rotSpeed = this.rotationSpeed;
    const now = Date.now();

    if (
      this.controlsController &&
      this.controlsController.actions &&
      !this.isColliding
    ) {
      const controls = this.controlsController.actions;

      if (controls[ActionType.LEFT]) {
        dir.rotate(-rotSpeed);
      } else if (controls[ActionType.RIGHT]) {
        dir.rotate(rotSpeed);
      } else {
      }

      vel.set(dir.x, dir.y);

      if (controls[ActionType.FORWARD]) {
        vel.multiplyScalar(spd);
      } else if (controls[ActionType.BACKWARD]) {
        vel.multiplyScalar(-spd);
      } else {
        vel.multiplyScalar(0);
      }

      const x = spr.x + vel.x * dt;
      const y = spr.y + vel.y * dt;

      spr.rotation = dir.angle();

      // Now verify new position doesn't have collision
      // TODO:

      if (x - this.halfWidth > -1 && x + this.halfWidth < mS.width) {
        spr.x = x;
      }

      if (y - this.halfHeight > -1 && y + this.halfHeight < mS.height) {
        spr.y = y;
      }

      // const collision = this.game.map.walls.find(this.checkCollision) || this.game.map.hays.find(this.checkCollision);

      // if (collision) {

      // }

      if (controls[ActionType.SWITCH]) {
        if (this.nextSwitch < now) {
          this.nextSwitch = now + this.timeBetweenSwitches;
          // FIXME: this is no bueno, change it, it stinks
          const index: number =
            this.tankType + 1 >= this.availableTankTypes.length
              ? 0
              : this.tankType + 1;

          spr.visible = false;

          this.tankType = this.availableTankTypes[index];

          this.switchTank(spr);
        }
      }

      if (controls[ActionType.SHOOT]) {
        if (this.nextShot < now) {
          switch (this.tankType) {
            case TankType.RED:
              this.shoot2();
              break;
            case TankType.BLUE:
              this.shoot3();
              break;
            case TankType.GREEN:
              this.shoot();
              break;
          }
        }
      }

      this.syncBound();
    }
  }

  public checkCollision(entity: Entity) {
    //
    return this.game.physicsController.collideAABB(this, entity, () => {});
  }

  public getDamage() {
    return this.damage[this.tankType];
  }

  public getBullet() {
    const bullet =
      this.bulletPool.find((bullet) => {
        if (!bullet.isActive) {
          return bullet;
        }

        return false;
      }) || this.createBullet();

    bullet.activate();

    return bullet;
  }

  public reconcilePlayer() {
    // const vel = this.velocity;
    const { colliding } = this;

    if (colliding.target) {
      // let side;
      // if (colliding.bottom) {
      //   side = "bottom";
      // } else if (colliding.top) {
      //   side = "top";
      // } else if (colliding.left) {
      //   side = "left";
      // } else {
      //   side = "right";
      // }
      // console.log("Reconcile", vel.x, vel.y, side);
      // const { target } = colliding;
      // TODO:
      // if (colliding.bottom && vel.y > 0) {
      //   vel.y = 0;
      //   this.y = target.y - this.height;
      // } else if (colliding.top && vel.y < 0) {
      //   vel.y = 0;
      //   this.y = target.y + target.height;
      // }
      // if (colliding.right && vel.x > 0) {
      //   vel.x = 0;
      //   this.x = target.x - this.width;
      // } else if (colliding.left && vel.x < 0) {
      //   vel.x = 0;
      //   this.x = target.x + target.width;
      // }
    }
  }

  public switchTank(oldSprite?: Sprite) {
    const spr = (this.sprite = this.sprites[this.tankType]);

    spr.updateTransform();

    this.sprite = spr;
    spr.visible = true;
    this.bound = spr.getBounds();

    if (oldSprite) {
      this.sprite.position.copyFrom(oldSprite.position);
    }
  }

  private shoot() {
    const now = Date.now();

    this.nextShot = now + this.timeBetweenShoots;

    const bullet = this.getBullet();

    const dir = this.direction.clone().normalize() as Vector2;
    dir.multiplyScalar(bullet.SPEED);

    bullet.bulletDamage = this.getDamage();
    bullet.x = this.x;
    bullet.y = this.y;
    bullet.velocity.set(dir.x, dir.y);
  }

  private shoot2() {
    const now = Date.now();

    this.nextShot = now + this.timeBetweenShoots;

    const bullet = this.getBullet();
    const bullet2 = this.getBullet();

    const angle = Math.PI * 0.5;
    const aimDir = this.direction.clone().normalize() as Vector2;
    const posOffset = this.direction.clone().normalize() as Vector2;
    posOffset.rotate(angle);

    posOffset.multiplyScalar(10);
    aimDir.multiplyScalar(bullet.SPEED);

    this.spawnBullet(bullet, posOffset, aimDir);

    posOffset.negate();

    this.spawnBullet(bullet2, posOffset, aimDir);
  }

  private shoot3() {
    const now = Date.now();

    this.nextShot = now + this.timeBetweenShoots;

    const bullet = this.getBullet();
    const bullet2 = this.getBullet();
    const bullet3 = this.getBullet();

    const angle = Math.PI * 0.07;
    const aimDir = this.direction.clone().normalize() as Vector2;

    // posOffset.multiplyScalar(10);
    aimDir.multiplyScalar(bullet.SPEED);

    this.spawnBullet(bullet, Vector2.ZERO, aimDir);

    aimDir.rotate(angle);

    this.spawnBullet(bullet2, Vector2.ZERO, aimDir);

    aimDir.rotate(-angle * 2);

    this.spawnBullet(bullet3, Vector2.ZERO, aimDir);
  }

  private spawnBullet(
    bullet: Bullet,
    posOffset = new Vector2(),
    velocity: Vector2
  ) {
    bullet.bulletDamage = this.getDamage();
    bullet.x = this.x + posOffset.x;
    bullet.y = this.y + posOffset.y;
    bullet.velocity.set(velocity.x, velocity.y);
  }

  private createBullet() {
    const bulletGrp = this.createBulletGraphic();

    const bulletSpr = createSpriteFromGraphic(
      bulletGrp,
      this.game.app.renderer
    );

    const bullet = new Bullet(bulletSpr, bulletSpr.getBounds(), this.game);

    bullet.deactivate();

    this.game.entities.add(bullet);
    this.bulletPool.push(bullet);
    this.game.gameContainer.addChild(bulletSpr);

    return bullet;
  }

  private createBulletGraphic() {
    const color = 0xffff00;

    const gr = new Graphics();
    gr.beginFill(color);
    gr.lineStyle(0);
    gr.drawCircle(0, 0, 4);
    gr.endFill();

    return gr;
  }
}

export default Player;
