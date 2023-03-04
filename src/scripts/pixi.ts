import Engine from "./engine";
import * as PIXI from "pixi.js";

class PixiEngine extends Engine {
  app: PIXI.Application<PIXI.ICanvas>;
  constructor() {
    super();

    this.renderMode = { index: 0, value: "Origin" };
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
      element.obj.position.x = element.x;
    }

    this.meter.tick();
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.initDrawElements();
    let spritesContainer: PIXI.ParticleContainer | null = null;
    if (this.renderMode.value == "SpriteContainer") {
      spritesContainer = new PIXI.ParticleContainer(this.count.value, {
        scale: true,
        position: true,
        rotation: false,
        uvs: false,
        alpha: false,
      });
      this.app.stage.addChild(spritesContainer);
    }
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      if (this.renderType.value == "Rect") {
        const rect = new PIXI.Graphics();
        rect.lineStyle(1, 0x000000, 1);
        rect.beginFill(0xffffff);
        rect.drawRect(-element.width / 2, -element.heigh / 2, element.width, element.heigh);
        rect.endFill();
        if (this.renderMode.value == "Origin") {
          rect.position.set(element.x, element.y);
          element.obj = rect;
          this.app.stage.addChild(rect);
        } else {
          var texture = this.app.renderer.generateTexture(rect);
          var sprite = new PIXI.Sprite(texture);
          sprite.position.set(element.x, element.y);
          element.obj = sprite;
          if (this.renderMode.value == "Sprite") {
            this.app.stage.addChild(sprite);
          } else {
            spritesContainer!.addChild(sprite);
          }
        }
      } else if (this.renderType.value == "Image") {
        const texture = PIXI.Texture.from(this.imageUrl);
        var sprite = new PIXI.Sprite(texture);
        sprite.position.set(element.x, element.y);
        sprite.scale.set(element.width / this.imageW, element.heigh / this.imageH);
        element.obj = sprite;
        if (this.renderMode.value == "SpriteContainer") {
          spritesContainer!.addChild(sprite);
        } else {
          this.app.stage.addChild(sprite);
        }
      } else if (this.renderType.value == "Text") {
        const basicText = new PIXI.Text('quick brown fox');
        basicText.x = element.x;
        basicText.y = element.y;
        const style = new PIXI.TextStyle({
          fontSize: 12,
          wordWrap: false,
        });
        basicText.style = style;
        if (this.renderMode.value == "Origin") {
          element.obj = basicText;
          this.app.stage.addChild(basicText);
        } else {
          var texture = this.app.renderer.generateTexture(basicText);
          var sprite = new PIXI.Sprite(texture);
          sprite.position.set(element.x, element.y);
          element.obj = sprite;
          if (this.renderMode.value == "Sprite") {
            this.app.stage.addChild(sprite);
          } else {
            spritesContainer!.addChild(sprite);
          }
        }
      }
    }
    this.app.ticker.add(this.onTick, this);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new PixiEngine();
  engine.render();
});
