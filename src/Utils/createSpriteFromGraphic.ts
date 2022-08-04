import { AbstractRenderer, Graphics, Renderer, Sprite } from "pixi.js";

export default function createSpriteFromGraphic(graphic: Graphics, renderer: Renderer | AbstractRenderer) {
    const texture = renderer.generateTexture(graphic);
    const spr = new Sprite(texture);

    return spr;
  }