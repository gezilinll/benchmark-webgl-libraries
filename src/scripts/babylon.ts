import Engine from "./engine";
import * as BABYLON from 'babylonjs';

class BabylonEngine extends Engine {
  canvas: HTMLCanvasElement;
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  constructor() {
    super();

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.content.appendChild(this.canvas);

    // Load the 3D engine
    this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
    // CreateScene function that creates and return the scene
    // Create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    // Creates, angles, distances and targets the camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, this.width, new BABYLON.Vector3(0, 0, 0), this.scene);
    // This targets the camera to scene origin
    camera.setPosition(new BABYLON.Vector3(0, 0, -this.width));
    // Attach the camera to the canvas
    camera.attachControl(this.canvas, true);
    // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
    var light = new BABYLON.DirectionalLight("direct", new BABYLON.Vector3(0, 1, 0), this.scene);

    this.renderMode = { index: 0, value: "Origin" };
    // this.initRenderModeSettings();

    // Resize
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }

  animate() {
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      if (element.x + element.width <= (element.width / -2)) {
        element.x = this.width / 2;
      } else {
        element.x -= element.speed;
      }
      element.obj.position.x = element.x;
    }
    this.scene.render();
    this.meter.tick();
  }

  render() {
    this.engine.stopRenderLoop();
    this.initDrawElements();
    for (let i = 0; i < this.count.value; i++) {
      let element = this.drawElements[i];
      const plane = BABYLON.MeshBuilder.CreatePlane("plane", { height: element.heigh, width: element.heigh });
      var redMat = new BABYLON.StandardMaterial("red", this.scene);
      redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
      redMat.emissiveColor = new BABYLON.Color3(1, 0, 0);
      redMat.specularColor = new BABYLON.Color3(1, 0, 0);
      plane.position = new BABYLON.Vector3(element.x + (element.width / -2), element.y + (element.heigh / -2), 0);
      plane.material = redMat;
      element.obj = plane;
    }
    this.engine.runRenderLoop(this.animate.bind(this));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const engine = new BabylonEngine();
  engine.render();
});
