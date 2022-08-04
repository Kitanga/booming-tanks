import "@pixi/math-extras";
import { Application, Container, Graphics, Sprite } from "pixi.js";
import AssetKeys from "./constants/AssetKeys";
import Bullet from "./Entities/Bullet";
import Entity from "./Entities/Entity";
import Hay from "./Entities/Hay";
import PhysicsController from "./Entities/PhysicsController";
import Player from "./Entities/Player";
import GeneratedMap from "./generators/GeneratedMap";
import Assets from "./Utils/Assets";

class Game {
  public app: Application;
  public gameContainer: Container;

  public player!: Player;

  public physicsController!: PhysicsController;

  public mapSize: { width: number; height: number };
  public map!: GeneratedMap;

  public entities: Set<Entity> = new Set();

  public gameSettings: {
    wallCount: number;
    hayCount: number;
    // Tile count on each axis
    tileXCount: number;
    tileYCount: number;
    // Dimensions in pixels
    tileWidth: number;
    tileHeight: number;
    scale: number;
  };

  public assetManager: Assets;

  // Controllers
  // c
  constructor() {
    const gameSettings = (this.gameSettings = {
      wallCount: 50,
      hayCount: 25,
      // Tile count on each axis
      tileXCount: 50,
      tileYCount: 50,
      // Dimensions in pixels
      tileWidth: 34,
      tileHeight: 34,
      scale: 1,
    });

    const mapSize = (this.mapSize = {
      width: gameSettings.tileXCount * gameSettings.tileWidth,
      height: gameSettings.tileYCount * gameSettings.tileHeight,
    });

    // Create a Pixi Application
    const app = (this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
    }));

    const canvas = app.view;

    // Add the canvas that Pixi automatically created for you to the HTML document
    (document.getElementById("root") as HTMLElement).appendChild(canvas);

    this.gameContainer = new Container();

    this.app.stage.addChild(this.gameContainer);

    this.assetManager = new Assets(app);

    this.assetManager.onProgress = (progress) => {
      console.log("Progress:", progress);

      (document.getElementById("bar") as HTMLDivElement).style.width = `${
        progress * 100
      }%`;
    };

    console.log("perfomance start", performance.now());

    // Loading assets
    this.assetManager
      .loadAssets([
        [AssetKeys.RED, "img/red-tank.png"],
        [AssetKeys.BLUE, "img/blue-tank.png"],
        [AssetKeys.GREEN, "img/green-tank.png"],
      ])
      .then(() => {
        console.log("perfomance end", performance.now());

        // All assets loaded
        // setTimeout(() => {
          (
            document.getElementById("preloader") as HTMLDivElement
          ).style.display = "none";
        // }, 1000);

        // Create background
        this.createBackgroundGraphic();

        this.map = new GeneratedMap(
          gameSettings.tileXCount,
          gameSettings.tileYCount,
          this
        );

        this.physicsController = new PhysicsController(this);

        const playerSprs = [AssetKeys.RED, AssetKeys.BLUE, AssetKeys.GREEN].map(
          (key) => {
            const texture = this.assetManager.getAsset(key);

            // @ts-ignore
            window.am = this.assetManager;

            console.log("Textures:", texture);

            const playerSpr = new Sprite(texture);

            this.gameContainer.addChild(playerSpr);

            return playerSpr;
          }
        );

        const player = (this.player = new Player(this, playerSprs));

        this.physicsController.addCollider(
          [player],
          [...this.map.walls, ...this.map.hays],
          (obj1, obj2) => {
            console.log("Collision");

            // const intersection = obj1.sprite.getBounds().intersection(obj2.sprite.getBounds());

            // console.log("intersection:", intersection);

            // if (intersection.width > intersection.height) {
            //   obj1.y += Math.sign(obj1.y - intersection.y) * intersection.height;
            // } else {
            //   obj1.x += Math.sign(intersection.x - obj1.x) * intersection.width;
            // }

            // Now separate
            // if (player.colliding.right) {
            //   player.x = obj2.bound.x - obj1.width;
            // } else if (player.colliding.left) {
            //   player.x = obj2.bound.x + obj2.width;
            // }

            // if (player.colliding.bottom) {
            //   player.y = obj2.y - obj1.height;
            // } else if (player.colliding.top) {
            //   player.y = obj2.y + obj2.height;
            // }

            // if (side === SIDES.RIGHT) {
            //   player.colliding.right = true;
            //   // player.x = obj2.right;
            // } else if (side === SIDES.LEFT) {
            //   player.colliding.left = true;
            //   // player.x = obj2.left;
            // } else if (side === SIDottom = true;
            //   // player.y = obj2.bottom + obj2.y;
            // } else {
            //   player.colliding.topES.BOTTOM) {
            //   player.colliding.b = true;
            //   // player.y = obj2.top + obj2.y;
            // }
          },
          true
        );

        this.physicsController.addCollider(
          player.bulletPool,
          [...this.map.walls, ...this.map.hays],
          (obj1, obj2) => {
            const bullet = obj1 as Bullet;
            const hay = obj2 as Hay;

            bullet.deactivate();

            if (hay.IS_HAY) {
              hay.health = hay.health - bullet.bulletDamage;
            }
          }
        );

        // console.log("Type:", player.bulletPool[0].bound.type === SHAPES.RECT);
        // console.log("Type:", this.map.walls[0].bound.type === SHAPES.RECT);

        this.app.ticker.add((dt) => {
          this.entities.forEach((entity) => {
            if (entity.isActive && !entity.isStatic) {
              entity.update(dt);
            }
          });

          this.physicsController.update();

          this.entities.forEach((entity) => {
            if (entity.isActive) {
              // entity.drawDebugInfo();
              entity.reset();
            }
          });
        });

        const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const widthGreater = window.innerHeight < window.innerWidth;
          const newScale = (gameSettings.scale = widthGreater
            ? window.innerHeight / mapSize.height
            : window.innerWidth / mapSize.width);
          this.gameContainer.scale.set(newScale);

          const x = widthGreater
            ? (window.innerWidth - mapSize.width * newScale) * 0.5
            : 0;
          const y = widthGreater
            ? 0
            : (window.innerHeight - mapSize.height * newScale) * 0.5;

          this.gameContainer.position.set(x, y);
        };

        window.addEventListener("resize", resize);

        resize();
      });
  }

  private createBackgroundGraphic() {
    const graphics = new Graphics();

    // Rectangle
    graphics.beginFill(0xa1df50);
    graphics.drawRect(0, 0, this.mapSize.width, this.mapSize.height);
    graphics.endFill();

    this.gameContainer.addChild(graphics);
  }
}

export default Game;
