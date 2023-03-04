import Engine from "./engine";
import { fabric } from "fabric";

class FabricEngine extends Engine {
  canvas: HTMLCanvasElement;
  fabricCanvas!: fabric.StaticCanvas;
  request: number = -1;
  constructor() {
    super();
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);
  }

  init() {
    fabric.Object.prototype.objectCaching = false;
    fabric.Object.prototype.originX = "center";
    fabric.Object.prototype.originY = "center";
    this.fabricCanvas = new fabric.StaticCanvas(this.canvas, {
      enableRetinaScaling: false,
      renderOnAddRemove: false,
    });
    //@ts-ignore
    window.canvas = this.fabricCanvas;
  }

  animate() {
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      element.obj.left = element.x;
    }

    this.fabricCanvas.renderAll();
    this.meter.tick();

    this.request = requestAnimationFrame(() => this.animate());
  }

  render() {
    // clear the canvas
    this.fabricCanvas.clear();
    this.cancelAnimationFrame(this.request);
    this.initDrawElements();

    // rectangle creation
    const rects = new Array(this.count);
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      const fRect = new fabric.Rect({
        width: element.width,
        height: element.heigh,
        fill: "white",
        stroke: "black",
        top: element.y,
        left: element.x,
      });
      element.obj = fRect;
      this.fabricCanvas.add(fRect);
    }

    this.request = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new FabricEngine();
  engine.init();
  engine.render();
});
