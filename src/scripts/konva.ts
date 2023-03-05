import Engine from "./engine";
/* Importing Konva as a minimal bundle does not influence the performance
   but decrease the size of dist/konva.[hash].js from 460K to 260K. */
import Konva from "konva/lib/Core";
import { Rect } from "konva/lib/shapes/Rect";

class KonvaEngine extends Engine {
  stage: any;
  request: number = -1;
  constructor() {
    super();

    const container = document.createElement("div");

    container.id = "konva";
    this.content.appendChild(container);

    this.stage = new Konva.Stage({
      container: "konva",
      width: this.width,
      height: this.height,
    });
  }

  render() {
    this.cancelAnimationFrame(this.request);
    this.stage.destroyChildren();
    this.initDrawElements();

    const layer = new Konva.Layer({
      listening: false,
      draggable: false,
    });
    this.stage.add(layer);
    const template = new Rect({
      fill: "white",
      stroke: "black",
      strokeWidth: 1,
      listening: false,
      draggable: false,
      shadowForStrokeEnabled: false,
    });
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      const rectangle = template.clone({
        width: element.width,
        height: element.heigh,
        x: element.x,
        y: element.y,
      });
      element.obj = rectangle;
      layer.add(rectangle);
    }
    layer.draw();

    let draw = () => {
      this.request = requestAnimationFrame(draw);
      for (let i = 0; i < this.count.value; i++) {
        const element = this.drawElements[i];
        if (element.x + element.width <= 0) {
          element.x = this.width;
        } else {
          element.x -= element.speed;
        }
        element.obj.setX(element.x);
      }
      layer.batchDraw();
      this.meter.tick();
    };

    this.request = requestAnimationFrame(draw);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new KonvaEngine();
  engine.render();
});
