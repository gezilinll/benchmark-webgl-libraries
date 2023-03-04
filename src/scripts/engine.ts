import 'fpsmeter'

class XElement {
  x: number = 0;
  y: number = 0;
  speed: number = 0;
  width: number = 0;
  heigh: number = 0;
  obj: any = undefined;
}

class Engine {
  content: any;
  meterContainer: HTMLElement;
  width: number;
  height: number;
  cancelAnimationFrame: any;
  countLinks: NodeListOf<Element>;
  count: { index: number; value: number; };
  renderModeLinks: NodeListOf<Element>;
  renderMode: { index: number; value: string; };
  renderTypeLinks: NodeListOf<Element>;
  renderType: { index: number; value: string; };
  meter!: any;

  drawElements: Array<XElement> = new Array();

  constructor() {
    this.content = document.querySelector("main")!;
    this.meterContainer = this.content.querySelector(".meter")!;
    this.count = { index: 1, value: 1000 };
    this.countLinks = this.content.querySelectorAll(".count-selector > a");
    this.width = Math.min(this.content.clientWidth, 1000);
    this.height = this.content.clientHeight;
    this.renderModeLinks = this.content.querySelectorAll(".render-mode-selector > a");
    this.renderMode = { index: 1, value: "Error" };
    this.renderTypeLinks = this.content.querySelectorAll(".render-type-selector > a");
    this.renderType = { index: 0, value: "Rect" };

    this.initFpsmeter();
    this.initSettings();

    this.initMenuLink();

    this.cancelAnimationFrame =
      (
        window.cancelAnimationFrame ||
        //@ts-ignore
        window.webkitCancelRequestAnimationFrame ||
        //@ts-ignore
        window.mozCancelRequestAnimationFrame ||
        //@ts-ignore
        window.oCancelRequestAnimationFrame ||
        //@ts-ignore
        window.msCancelRequestAnimationFrame
      )?.bind(window) || clearTimeout;
  }

  initFpsmeter() {
    //@ts-ignore
    this.meter = new window.FPSMeter(this.meterContainer, {
      graph: 1,
      heat: 1,
      theme: "light",
      history: 25,
      top: 0,
      bottom: 40,
      left: `calc(${this.width}px + 2.5em)`,
      transform: "translateX(-100%)",
    });
  }

  initSettings() {
    let localCount = localStorage.getItem("count");
    if (localCount) {
      this.count = JSON.parse(localCount);
    } else {
      this.count = { index: 1, value: 1000 };
    }
    if (this.count.index < 0 || this.count.index >= 5) {
      this.count = { index: 1, value: 1000 };
    }
    localStorage.setItem("count", JSON.stringify(this.count));
    this.countLinks.forEach((link: any, index) => {
      this.countLinks[this.count.index].classList.toggle("selected", true);

      link.addEventListener("click", (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        this.countLinks[this.count.index].classList.toggle("selected", false);
        this.count = { index: index, value: parseInt(link.innerText) };
        this.countLinks[this.count.index].classList.toggle("selected", true);

        localStorage.setItem("count", JSON.stringify(this.count));

        this.render();
      });
    });

    let localRenderType = localStorage.getItem("renderType");
    if (localRenderType) {
      this.renderType = JSON.parse(localRenderType);
    } else {
      this.renderType = { index: 1, value: "Rect" };
    }
    if (this.renderType.index < 0 || this.count.index >= 3) {
      this.renderType = { index: 1, value: "Rect" };
    }
    this.renderTypeLinks.forEach((link: any, index) => {
      this.renderTypeLinks[this.renderType.index].classList.toggle("selected", true);

      link.addEventListener("click", (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        this.renderTypeLinks[this.renderType.index].classList.toggle("selected", false);
        this.renderType = { index: index, value: link.innerText };
        this.renderTypeLinks[this.renderType.index].classList.toggle("selected", true);

        localStorage.setItem("renderType", JSON.stringify(this.renderType));

        this.render();
      });
    });
  }

  initRenderModeSettings() {
    this.renderModeLinks.forEach((link: any, index) => {
      this.renderModeLinks[this.renderMode.index].classList.toggle("selected", true);

      link.addEventListener("click", (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        this.renderModeLinks[this.renderMode.index].classList.toggle("selected", false);
        this.renderMode = { index: index, value: link.innerText };
        this.renderModeLinks[this.renderMode.index].classList.toggle("selected", true);

        this.render();
      });
    });
  }

  initMenuLink() {
    const menuLinks = document.querySelectorAll("header > menu > a");
    const { href } = window.location;

    [...menuLinks].forEach((ml: any) => {
      if (ml.href === href) {
        ml.classList.add("disabled");
      }
    });
  }

  initDrawElements() {
    this.drawElements = [];
    let localElements = localStorage.getItem("drawElements");
    if (localElements) {
      this.drawElements = JSON.parse(localElements);
    }
    if (this.drawElements.length < this.count.value) {
      for (let i = this.drawElements.length; i < this.count.value; i++) {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        const size = 10 + Math.floor(Math.random() * 50);
        const speed = 1 + Math.floor(Math.random() * 3);
        let element = new XElement();
        element.x = x;
        element.y = y;
        element.speed = speed;
        element.width = size;
        element.heigh = size;
        this.drawElements[i] = element;
      }
    }
    localStorage.setItem("drawElements", JSON.stringify(this.drawElements));
  }

  render() { }
}

export default Engine;
