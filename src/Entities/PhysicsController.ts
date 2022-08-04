import { Rectangle, SHAPES } from "pixi.js";
import Game from "../Game";
import { Vector2 } from "../math/Vector2";
import Entity from "./Entity";

export const STICKY_THRESHOLD = 0.0004;

export type onCollideCallback = (
  obj1: Entity,
  obj2: Entity,
  intersectionData?: any
) => void;

export enum SIDES {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

export interface ICollisionCheckPair {
  group1: Entity[];
  group2: Entity[];
  onCollide: onCollideCallback;
  shouldReconcile: boolean;
}

class PhysicsController {
  protected registeredCollisionCheckPairs: Set<ICollisionCheckPair> = new Set();

  constructor(public game: Game) {
    //
  }

  public addCollider(
    group1: Entity[],
    group2: Entity[],
    onCollide: onCollideCallback,
    shouldReconcile = false
  ) {
    this.registeredCollisionCheckPairs.add({
      group1,
      group2,
      onCollide,
      shouldReconcile,
    });
    console.log("set:", this.registeredCollisionCheckPairs);
  }

  public update = () => {
    // console.log("UPdate")
    this.registeredCollisionCheckPairs.forEach((colliderPair) => {
      // console.log("loop in set");

      this.collide(
        colliderPair.group1,
        colliderPair.group2,
        colliderPair.onCollide,
        colliderPair.shouldReconcile
      );
    });
  };

  public collide(
    group1: Entity[],
    group2: Entity[],
    onCollide: onCollideCallback,
    shouldReconcile: boolean
  ) {
    group1.forEach((obj1) => {
      group2.forEach((obj2) => {
        if (obj1.isActive && obj2.isActive) {
          // console.log("Check collision", obj1, obj2)
          /* if (
          obj1.bound.type === SHAPES.CIRC &&
          obj2.bound.type === SHAPES.RECT
        ) {
          this.collideCircleRect(obj1, obj2, (...props) => {
            onCollide(...props);

            // Reconcile
            if (shouldReconcile) {
              this.separate(obj1, obj2);
            }
          });
        } else if (
          obj1.bound.type === SHAPES.RECT &&
          obj2.bound.type === SHAPES.CIRC
        ) {
          this.collideCircleRect(obj2, obj1, (...props) => {
            onCollide(...props);

            // Reconcile
            if (shouldReconcile) {
              this.separate(obj1, obj2);
            }
          });
        } else  */
          if (
            obj1.bound.type === SHAPES.RECT &&
            obj2.bound.type === SHAPES.RECT
          ) {
            this.collideAABB(obj1, obj2, (...props) => {
              obj1.colliding.target = obj2;
              obj2.colliding.target = obj1;

              onCollide(...props);
            });
          }
          /*  else if (
          obj1.bound.type === SHAPES.CIRC &&
          obj2.bound.type === SHAPES.CIRC
        ) {
          this.collideCircles(obj1, obj2, (...props) => {
            onCollide(...props);

            // Reconcile
            if (shouldReconcile) {
              this.separate(obj1, obj2);
            }
          });
        } */
          //  else if (obj1.bound.type === SHAPES.RECT && obj2.bound.type === SHAPES.RREC) {
          //     this.collideAABB(obj2, obj1, onCollide);
          // }
          // } else if (obj1.bound.type === SHAPES.RREC && obj2.bound.type === SHAPES.RECT) {
          //     this.collideAABB(obj2, obj1, onCollide);
          // }
        }
      });
    });
  }

  public collideAABB(
    rectEntity1: Entity,
    rectEntity2: Entity,
    onCollide: onCollideCallback
  ) {
    const rect1 = rectEntity1.bound as Rectangle;
    const rect2 = rectEntity2.bound as Rectangle;

    if (
      rectEntity1.left < rectEntity2.right &&
      rectEntity1.right > rectEntity2.left &&
      rectEntity1.top < rectEntity2.bottom &&
      rectEntity1.bottom > rectEntity2.top
    ) {
      rectEntity1.isColliding = true;
      rectEntity2.isColliding = true;

      const offset = new Vector2(
        rectEntity1.x - rectEntity2.x,
        rectEntity1.y - rectEntity2.y
      );

      rectEntity1.x = rectEntity2.x + offset.x * 1.132;
      rectEntity1.y = rectEntity2.y + offset.y * 1.132;

      // let x = 0;
      // let y = 0;

      // if (rect1.left < rect2.right) {
      //   //
      //   x = rect2.right - rect1.left;
      // } else if (rect1.right > rect2.left) {
      //   //
      //   x -= rect1.right - rect2.left;
      // }

      // if (rect1.top < rect2.bottom) {
      //   //
      //   y = rect2.bottom - rect1.top;
      // } else if (rect1.bottom > rect2.top) {
      //   //
      //   y -= rect1.bottom - rect2.top;
      // }

      // rectEntity1.x += x;
      // rectEntity1.y += y;

      // const dir = new Vector2(
      //   intersectionData.x - rect1.x,
      //   intersectionData.y - rect1.y,
      // ).normalize();

      // Get the percent difference for

      // console.log("offset:", offset.x, offset.y);
      // console.log("offset:", intersectionData.x, intersectionData.y);

      // let side: SIDES;

      // if (rect1.x < rect2.x + rect2.width) {
      //   // side = SIDES.RIGHT;
      //   rectEntity1.colliding.left = true;
      //   rectEntity2.colliding.right = true;
      // } else if (rect1.x + rect1.width > rect2.x) {
      //   // side = SIDES.LEFT;
      //   rectEntity1.colliding.right = true;
      //   rectEntity2.colliding.left = true;
      // } else if (rect1.y < rect2.y + rect2.height) {
      //   // side = SIDES.BOTTOM;
      //   rectEntity1.colliding.top = true;
      //   rectEntity2.colliding.bottom = true;
      // } else {
      //   // side = SIDES.TOP;
      //   rectEntity1.colliding.bottom = true;
      //   rectEntity2.colliding.top = true;
      // }

      onCollide(rectEntity1, rectEntity2);

      return true;
    }
  }

  // public collideCircles(
  //   circleEntity1: Entity,
  //   circleEntity2: Entity,
  //   onCollide: onCollideCallback
  // ) {
  //   const circle1 = circleEntity1.bound as Circle;
  //   const circle2 = circleEntity2.bound as Circle;

  //   const dx = circle1.x + circle1.radius - (circle2.x + circle2.radius);
  //   const dy = circle1.y + circle1.radius - (circle2.y + circle2.radius);
  //   const distance = Math.sqrt(dx * dx + dy * dy);

  //   if (distance < circle1.radius + circle2.radius) {
  //     circleEntity1.isColliding = true;
  //     circleEntity2.isColliding = true;
  //     onCollide(circleEntity1, circleEntity2);
  //   }
  // }

  // public collideCircleRect(
  //   circleEntity: Entity,
  //   rectEntity: Entity,
  //   onCollide: onCollideCallback
  // ) {
  //   const circle = circleEntity.bound as Circle;
  //   const rect = rectEntity.bound as Rectangle;

  //   const distX = Math.abs(circle.x - rect.x);
  //   const distY = Math.abs(circle.y - rect.y);

  //   if (distX > rect.width / 2 + circle.radius) {
  //     return false;
  //   }
  //   if (distY > rect.height / 2 + circle.radius) {
  //     return false;
  //   }

  //   if (distX <= rect.width / 2) {
  //     // console.log("It's working!")
  //     circleEntity.isColliding = true;
  //     rectEntity.isColliding = true;
  //     onCollide(circleEntity, rectEntity);
  //   }
  //   if (distY <= rect.height / 2) {
  //     // console.log("It's working!")
  //     circleEntity.isColliding = true;
  //     rectEntity.isColliding = true;
  //     onCollide(circleEntity, rectEntity);
  //   }

  //   const dx = distX - rect.width / 2;
  //   const dy = distY - rect.height / 2;

  //   if (dx * dx + dy * dy <= circle.radius * circle.radius) {
  //     circleEntity.isColliding = true;
  //     rectEntity.isColliding = true;
  //     onCollide(circleEntity, rectEntity);
  //   }
  // }

  // private separate(obj1: DynamicEntity, obj2: DynamicEntity) {}

  // private separated(obj1: DynamicEntity, obj2: DynamicEntity) {
  //   // Find the mid points of the entity and player
  //   var pMidX = obj1.midX;
  //   var pMidY = obj1.midY;
  //   var aMidX = obj2.midX;
  //   var aMidY = obj2.midY;

  //   // To find the side of entry calculate based on
  //   // the normalized sides
  //   var dx = (aMidX - pMidX) / obj2.halfWidth;
  //   var dy = (aMidY - pMidY) / obj2.halfHeight;

  //   // Calculate the absolute change in x and y
  //   var absDX = Math.abs(dx);
  //   var absDY = Math.abs(dy);

  //   // If the distance between the normalized x and y
  //   // position is less than a small threshold (.1 in this case)
  //   // then this object is approaching from a corner
  //   if (Math.abs(absDX - absDY) < 0.1) {
  //     // If the player is approaching from positive X
  //     if (dx < 0) {
  //       // Set the player x to the right side
  //       obj1.x = obj2.right;

  //       // If the player is approaching from negative X
  //     } else {
  //       // Set the player x to the left side
  //       obj1.x = obj2.left - obj1.width;
  //     }

  //     // If the player is approaching from positive Y
  //     if (dy < 0) {
  //       // Set the player y to the bottom
  //       obj1.y = obj2.bottom;

  //       // If the player is approaching from negative Y
  //     } else {
  //       // Set the player y to the top
  //       obj1.y = obj2.top - obj1.height;
  //     }

  //     // Randomly select a x/y direction to reflect velocity on
  //     if (Math.random() < 0.5) {
  //       // Reflect the velocity at a reduced rate
  //       obj1.vx = -obj1.vx * obj2.restitution;

  //       // If the object's velocity is nearing 0, set it to 0
  //       // STICKY_THRESHOLD is set to .0004
  //       if (Math.abs(obj1.vx) < STICKY_THRESHOLD) {
  //         obj1.vx = 0;
  //       }
  //     } else {
  //       obj1.vy = -obj1.vy * obj2.restitution;
  //       if (Math.abs(obj1.vy) < STICKY_THRESHOLD) {
  //         obj1.vy = 0;
  //       }
  //     }

  //     // If the object is approaching from the sides
  //   } else if (absDX > absDY) {
  //     // If the player is approaching from positive X
  //     if (dx < 0) {
  //       obj1.x = obj2.right;
  //     } else {
  //       // If the player is approaching from negative X
  //       obj1.x = obj2.left - obj1.width;
  //     }

  //     // Velocity component
  //     obj1.vx = -obj1.vx * obj2.restitution;

  //     if (Math.abs(obj1.vx) < STICKY_THRESHOLD) {
  //       obj1.vx = 0;
  //     }

  //     // If this collision is coming from the top or bottom more
  //   } else {
  //     // If the player is approaching from positive Y
  //     if (dy < 0) {
  //       obj1.y = obj2.bottom;
  //     } else {
  //       // If the player is approaching from negative Y
  //       obj1.y = obj2.top - obj1.height;
  //     }

  //     // Velocity component
  //     obj1.vy = -obj1.vy;
  //     if (Math.abs(obj1.vy) < STICKY_THRESHOLD) {
  //       obj1.vy = 0;
  //     }
  //   }
  // }
}

export default PhysicsController;
