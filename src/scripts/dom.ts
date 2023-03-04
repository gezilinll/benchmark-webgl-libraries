import Engine from "./engine";

class DomEngine extends Engine {
  canvas: HTMLDivElement;
  request: number = -1;
  constructor() {
    super();
    this.canvas = document.createElement("div");
    this.canvas.className = "canvas";
    this.canvas.style.width = this.width.toString();
    this.canvas.style.height = this.height.toString();
    this.content.appendChild(this.canvas);
  }

  init() { }

  animate() {
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      element.obj.style.left = element.x;
    }

    this.meter.tick();

    this.request = requestAnimationFrame(() => this.animate());
  }

  render() {
    // clear the canvas
    this.canvas.innerHTML = "";
    this.cancelAnimationFrame(this.request);
    this.initDrawElements();

    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      let rect = document.createElement("div");
      rect.className = "rectangle";
      rect.style.left = element.x + "px";
      rect.style.top = element.y + "px";
      rect.style.width = element.width + "px";
      rect.style.height = element.heigh + "px";
      element.obj = rect;
      this.canvas.appendChild(rect);
    }
    this.request = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new DomEngine();
  engine.init();
  engine.render();
});
