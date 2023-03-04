import Engine from "./engine";
import * as PIXI from "pixi.js";

class PixiEngine extends Engine {
  rects: Array<any> = new Array();
  app: PIXI.Application<PIXI.ICanvas>;
  modeLinks: NodeListOf<Element>;
  renderMode: { index: number; value: string; };
  constructor() {
    super();

    this.renderMode = { index: 2, value: "SpriteContainer" };
    this.modeLinks = this.content.querySelectorAll(".render-mode-selector > a");
    this.initPixiSettings();

    // support Hi-DPI
    // PIXI.settings.RESOLUTION = window.devicePixelRatio
    this.rects = [];
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

  initPixiSettings() {
    this.modeLinks.forEach((link: any, index) => {
      this.modeLinks[this.renderMode.index].classList.toggle("selected", true);

      link.addEventListener("click", (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        this.modeLinks[this.renderMode.index].classList.toggle("selected", false);
        this.renderMode = { index: index, value: link.innerText };
        this.modeLinks[this.renderMode.index].classList.toggle("selected", true);

        this.render();
      });
    });
  }

  onTick() {
    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      if (rect.x + rect.size / 2 < 0) {
        rect.x = this.width + rect.size / 2;
      } else {
        rect.x -= rect.speed;
      }
      rect.el.position.x = rect.x;
    }

    this.meter.tick();
  }

  renderUseSprite() {
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-size / 2, -size / 2, size, size);
      rect.endFill();

      var texture = this.app.renderer.generateTexture(rect);
      var sprite = new PIXI.Sprite(texture);
      sprite.position.set(x, y);
      this.app.stage.addChild(sprite);
      this.rects[i] = { x, y, size, speed, el: sprite };
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
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-size / 2, -size / 2, size, size);
      rect.endFill();

      var texture = this.app.renderer.generateTexture(rect);
      var sprite = new PIXI.Sprite(texture);
      sprite.position.set(x, y);
      spritesContainer.addChild(sprite);
      this.rects[i] = { x, y, size, speed, el: sprite };
    }
  }

  renderUseRect() {
    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new PIXI.Graphics();
      rect.lineStyle(1, 0x000000, 1);
      rect.beginFill(0xffffff);
      rect.drawRect(-size / 2, -size / 2, size, size);
      rect.endFill();
      rect.position.set(x, y);
      this.app.stage.addChild(rect);
      this.rects[i] = { x, y, size, speed, el: rect };
    }
  }

  render() {
    this.app.ticker.remove(this.onTick, this);
    this.app.stage.removeChildren();
    this.rects = [];
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
