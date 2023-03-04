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
  meter!: any;

  drawElements: Array<XElement> = new Array();

  constructor() {
    this.content = document.querySelector("main")!;
    this.meterContainer = this.content.querySelector(".meter")!;
    this.countLinks = this.content.querySelectorAll(".count-selector > a");
    this.width = Math.min(this.content.clientWidth, 1000);
    this.height = this.content.clientHeight;
    this.count = { index: 1, value: 1000 };

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
        const size = 10 + Math.floor(Math.random() * 40);
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
