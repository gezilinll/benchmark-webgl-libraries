import Engine from "./engine";
import CanvasKitInit from "canvaskit-wasm";
import CanvasKitPkg from "canvaskit-wasm/package.json";

const wasmRemotePath = `https://unpkg.com/canvaskit-wasm@${CanvasKitPkg.version}/bin/`;

class CanvasKitEngine extends Engine {
  canvas: HTMLCanvasElement;
  CanvasKit: any;
  surface: any;
  strokePaint: any;
  fillPaint: any;
  request: number = 0;
  modeLinks: NodeListOf<Element>;
  renderMode: { index: number; value: string; };

  constructor() {
    super();

    this.renderMode = { index: 1, value: "Batch" };
    this.modeLinks = this.content.querySelectorAll(".render-mode-selector > a");
    this.initCanvasKitSettings();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  initCanvasKitSettings() {
    this.modeLinks.forEach((link: any, index) => {
      this.modeLinks[this.renderMode.index].classList.toggle("selected", true);

      link.addEventListener("click", (event: any) => {
        console.log("addEventListener click");
        event.preventDefault();
        event.stopPropagation();

        this.modeLinks[this.renderMode.index].classList.toggle("selected", false);
        this.renderMode = { index: index, value: link.innerText };
        this.modeLinks[this.renderMode.index].classList.toggle("selected", true);
      });
    });
  }

  async init() {
    this.CanvasKit = await CanvasKitInit({
      locateFile: (file) => `${wasmRemotePath}${file}`,
    });
    this.surface = this.CanvasKit.MakeWebGLCanvasSurface(this.canvas);
    this.strokePaint = new this.CanvasKit.Paint();
    this.strokePaint.setAntiAlias(true);
    this.strokePaint.setColor(this.CanvasKit.parseColorString("#000000"));
    this.strokePaint.setStyle(this.CanvasKit.PaintStyle.Stroke);
    this.strokePaint.setStrokeWidth(2.0);
    this.fillPaint = new this.CanvasKit.Paint();
    this.fillPaint.setAntiAlias(true);
    this.fillPaint.setColor(this.CanvasKit.parseColorString("#ffffff"));
  }

  animate() {
    const canvas = this.surface.getCanvas();
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      canvas.drawRect4f(element.x, element.y, element.x + element.width, element.y + element.heigh, this.strokePaint);
      canvas.drawRect4f(element.x, element.y, element.x + element.width, element.y + element.heigh, this.fillPaint);
      if (this.renderMode.value == "Immediately") {
        this.surface.flush();
      }
    }
    if (this.renderMode.value == "Batch") {
      this.surface.flush();
    }
    this.meter.tick();

    this.request = window.requestAnimationFrame(() => this.animate());
  }

  render() {
    // clear the canvas
    this.surface.getCanvas().clear(this.CanvasKit.WHITE);
    this.cancelAnimationFrame(this.request);
    this.initDrawElements();
    this.request = window.requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const engine = new CanvasKitEngine();
  await engine.init();
  engine.render();
});
