import Engine from "./engine";
import * as THREE from "three";

class ThreeEngine extends Engine {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  lastFrame: number = -1;
  constructor() {
    super();

    this.renderMode = { index: 0, value: "Origin" };
    // this.initRenderModeSettings();

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      1,
      1000
    );
    this.camera.position.set(this.width / 2, this.height / 2, 500);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      depth: false,
      precision: "lowp",
    })
    this.renderer.setSize(this.width, this.height);
    this.renderer.sortObjects = false; // Allows squares to be drawn on top of each other
    this.content.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
  }

  animate() {
    for (let i = 0; i < this.count.value; i++) {
      const element = this.drawElements[i];
      if (element.x + element.width <= 0) {
        element.x = this.width;
      } else {
        element.x -= element.speed;
      }
      element.obj[0].position.x = element.x;
      element.obj[1].position.x = element.x;
    }

    this.lastFrame = requestAnimationFrame(
      this.animate.bind(this),
    );
    this.renderer.render(this.scene, this.camera);
    this.meter.tick();
  }

  render() {
    this.scene.clear();
    this.initDrawElements();

    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      const geometry = new THREE.PlaneGeometry(element.width, element.heigh);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide,
        depthTest: true,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(element.x, element.y, 0);
      this.scene.add(plane);
      // Make the borders of the planes
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );
      line.position.set(element.x, element.y, 0);
      this.scene.add(line);
      element.obj = new Array();
      element.obj[0] = plane;
      element.obj[1] = line;
    }

    if (this.lastFrame) {
      // Avoid overlapping animation requests to keep FPS meter working
      cancelAnimationFrame(this.lastFrame);
    }

    this.animate();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new ThreeEngine();
  engine.render();
});
