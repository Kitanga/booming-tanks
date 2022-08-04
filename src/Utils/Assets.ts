import { Application, Texture } from "pixi.js";
import AssetKeys from "../constants/AssetKeys";

class Assets {
  protected assets: Map<AssetKeys, Texture> = new Map();
  progress: number = 0;
  assetsCount: number = 0;
  currentlyLoaded: number = 0;

  constructor(public app: Application) {}

  public getAsset(key: AssetKeys) {
    return this.assets.get(key);
  }

  public loadAssets(assetDefs: [AssetKeys, string][]) {
    return new Promise((resolve) => {
      this.assetsCount = assetDefs.length;
      this.currentlyLoaded = 0;
      this.progress = 0;

      const loader = this.app.loader;

      assetDefs.map((assetDef) => {
        return new Promise((resolve) => {
          loader.add(assetDef[0], assetDef[1], (resource) => {
            this.assets.set(assetDef[0], resource.texture as Texture);

            this.progress = ++this.currentlyLoaded / this.assetsCount;

            this.onProgress(this.progress);
            resolve(null);
          });
        });
      });

      loader.load(() => {
        resolve(null);
      });
    });
  }

  public onProgress(progress: number) {}
}

export default Assets;
