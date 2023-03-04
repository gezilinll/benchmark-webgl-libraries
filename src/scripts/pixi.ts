import Engine from "./engine";
import * as PIXI from "pixi.js";

class PixiEngine extends Engine {
  app: PIXI.Application<PIXI.ICanvas>;
  constructor() {
    super();

    this.renderMode = { index: 2, value: "SpriteContainer" };
    this.initRenderModeSettings();

    // support Hi-DPI
    // PIXI.settings.RESOLUTION = window.devicePixelRatio
    this.app = new PIXI.Application({
      width: this.width,
      height: this.height,
      backgroundColor: 0xffffff,
      antialias: true,
    });
    this.content.appendChild(this.app.view);
    this.app.view.style!.width = this.width + "px";
    this.app.view.style!.height = this.height + "px";
  }

  onTick() {
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      if (this.renderType.value == "Rect") {
        element.obj.position.x = element.x;
      }
    }

    this.meter.tick();
  }

  renderUseSprite() {
    for (let i = 0; i < this.count.value; i++) {

      let element = this.drawElements[i];
      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-element.width / 2, -element.heigh / 2, element.width, element.heigh);
      rect.endFill();

      var texture = this.app.renderer.generateTexture(rect);
      var sprite = new PIXI.Sprite(texture);
      sprite.position.set(element.x, element.y);
      this.app.stage.addChild(sprite);
      element.obj = sprite;
    }

    this.app.ticker.add(this.onTick, this);
  }

  renderUseSpriteContainer() {
    const spritesContainer = new PIXI.ParticleContainer(this.count.value, {
      scale: false,
      position: true,
      rotation: false,
      uvs: false,
      alpha: false,
    });
    this.app.stage.addChild(spritesContainer);
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-element.width / 2, -element.heigh / 2, element.width, element.heigh);
      rect.endFill();

      var texture = this.app.renderer.generateTexture(rect);
      var sprite = new PIXI.Sprite(texture);
      sprite.position.set(element.x, element.y);
      spritesContainer.addChild(sprite);
      element.obj = sprite;
    }
  }

  renderUseRect() {
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-element.width / 2, -element.heigh / 2, element.width, element.heigh);
      rect.endFill();
      rect.position.set(element.x, element.y);
      this.app.stage.addChild(rect);
      element.obj = rect;
    }
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.initDrawElements();
    if (this.renderMode.value == "SpriteContainer") {
      this.renderUseSpriteContainer();
    } else if (this.renderMode.value == "Sprite") {
      this.renderUseSprite();
    } else if (this.renderMode.value == "Rect") {
      this.renderUseRect();
    }
    this.app.ticker.add(this.onTick, this);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new PixiEngine();
  engine.render();
});
