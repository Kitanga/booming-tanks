import { Graphics } from "pixi.js";
import Entity from "../Entities/Entity";
import Hay from "../Entities/Hay";
import Game from "../Game";
import createSpriteFromGraphic from "../Utils/createSpriteFromGraphic";

class GeneratedMap {
  //   protected grid: number[][] = [];
  public walls: Entity[] = [];
  public hays: Hay[] = [];

  constructor(
    public tileXCount: number,
    public tileYCount: number,
    public game: Game
  ) {
    this.init();
  }

  //   public getFreePosition

  protected init() {
    // this.grid = new Array(this.tileYCount)
    //   .fill(0)
    //   .map((val) => new Array(this.tileXCount));

    const { tileXCount, tileYCount, hayCount, wallCount } =
      this.game.gameSettings;

    // const randomPosOptions = randomPosArr(tileXCount, tileYCount, hayCount * wallCount) as string[];

    // Generate walls
    this.walls = this.generateWalls(this.game.gameSettings.wallCount);

    // Generate hays
    this.hays = this.generateHays(this.game.gameSettings.hayCount);

    // Take all the wall+hay positions and mark them in grid
  }

  private generateWalls(count: number, avaliableRandomPos?: string[]) {
    // TODO: figure out how to make this one process with the hays, maybe passing the constructor class, there's a type for this
    const { tileWidth, tileHeight } = this.game.gameSettings;

    const walls = new Array(count).fill(0).map((val, ix) => {
      const wall = this.createWall();

      const [x, y] = this.getPosition();

      wall.x = (x * tileWidth) + (tileWidth * 0.5);
      wall.y = (y * tileHeight) + (tileHeight * 0.5);

      this.game.gameContainer.addChild(wall);

      return new Entity(wall, wall.getBounds(), this.game);
    });

    return walls;
  }

  private generateHays(count: number) {
    const { tileWidth, tileHeight } = this.game.gameSettings;

    const hays = new Array(count).fill(0).map((val, ix) => {
      const hay = this.createHay();

      const [x, y] = this.getPosition();

      hay.x = (x * tileWidth) + (tileWidth * 0.5);
      hay.y = (y * tileHeight) + (tileHeight * 0.5);

      this.game.gameContainer.addChild(hay);

      return new Hay(hay, hay.getBounds(), this.game, true);
    });

    return hays;
  }

  private getPosition(): [number, number] {
    const entities = [...this.walls, ...this.hays];
    const width = this.game.gameSettings.tileWidth;
    const height = this.game.gameSettings.tileHeight;

    const x = Math.floor(Math.random() * 50);
    const y = Math.floor(Math.random() * 50);

    const halfWidth = Math.floor(width * 0.5);
    const halfHeight = Math.floor(height * 0.5);

    // Verify that this doesn't exist

    const duplicateEntity = entities.find((entity) => {
      if (entity.x / width === x && entity.y / height === y && x === halfWidth && y === halfHeight) {
        return true;
      } else {
        return false;
      }
    });

    if (duplicateEntity) {
      return this.getPosition();
    } else {
      return [x, y];
    }
  }

  private createWall() {
    const { tileWidth, tileHeight } = this.game.gameSettings;
    const color = 0x252525;

    const gr = new Graphics();
    gr.beginFill(color);
    gr.lineStyle(0);
    gr.drawRoundedRect(0, 0, tileWidth, tileHeight, 7);
    gr.endFill();

    return createSpriteFromGraphic(gr, this.game.app.renderer);
  }

  private createHay() {
    const { tileWidth, tileHeight } = this.game.gameSettings;
    const color = 0xf5deb3;

    const halfTileWidth = tileWidth * 0.5;
    const halfTileHeight = tileHeight * 0.5;

    const gr = new Graphics();
    gr.beginFill(color);
    gr.lineStyle(0);
    gr.drawCircle(halfTileWidth, halfTileHeight, halfTileWidth);
    gr.endFill();

    const spr = createSpriteFromGraphic(gr, this.game.app.renderer);
    this.game.gameContainer.addChild(spr);

    return spr;
    // return createSpriteFromGraphic(gr, this.game.app.renderer);
  }

  //   this.
}

export default GeneratedMap;
