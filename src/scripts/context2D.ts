import Engine from "./engine";

class Context2DEngine extends Engine {
  canvas: HTMLCanvasElement;
  request: number = 0;
  context: CanvasRenderingContext2D;
  canvasBitmapElement: any;

  constructor() {
    super();

    this.renderMode = { index: 1, value: "Batch" };
    this.initRenderModeSettings();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);

    this.context = this.canvas.getContext('2d')!;
    this.context.strokeStyle = "black";
    this.context.font = "12px";
  }


  async init() {
    const response = await fetch(this.imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const imageBitmap = await createImageBitmap(blob);
    this.canvasBitmapElement = document.createElement('canvas');
    this.canvasBitmapElement.width = imageBitmap.width;
    this.canvasBitmapElement.height = imageBitmap.height;
    const ctxBitmap = this.canvasBitmapElement.getContext('bitmaprenderer');
    ctxBitmap.transferFromImageBitmap(imageBitmap);
  }

  animate() {
    this.context.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      if (this.renderType.value == "Rect") {
        this.context.fillRect(element.x, element.y, element.width, element.heigh);
        this.context.strokeRect(element.x, element.y, element.width, element.heigh);
      } else if (this.renderType.value == "Text") {
        this.context.fillText("quick brown fox", element.x, element.y);
      } else if (this.renderType.value == "Image") {
        this.context.drawImage(this.canvasBitmapElement, element.x, element.y, element.width, element.heigh);
      }
    }
    this.meter.tick();

    this.request = window.requestAnimationFrame(() => this.animate());
  }

  render() {
    // clear the canvas
    this.cancelAnimationFrame(this.request);
    this.context.clearRect(0, 0, this.width, this.height);
    this.initDrawElements();
    if (this.renderType.value == "Rect") {
      this.context.fillStyle = "white";
    } else if (this.renderType.value == "Text") {
      this.context.fillStyle = "black";
    }

    this.request = window.requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const engine = new Context2DEngine();
  await engine.init();
  engine.render();
});
