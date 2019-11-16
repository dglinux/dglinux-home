---
title: logoCanvas
---

// === WINDOW HANDLERS === //
window.onload = function() {
  const canvasElem = document.getElementById("logo-canvas");
  const canvas = new LogoCanvas(canvasElem);
  canvas.beginRender();
};

// === CANVAS === //
class LogoCanvas {
  // === CONSTRUCTORS === //
  constructor(elem) {
    this.elem = elem;
    this.ctx = elem.getContext("2d");
    this.shouldRender = false;

    this.resizeCanvas();
    window.onresize = () => {
      console.log("Resizing canvas");
      this.resizeCanvas();
    };

    // === RENDER DATA === //
    const renderData = {};
    renderData.logo = new Image();
    renderData.logo.src = "{{ site.baseurl }}/assets/logo.png";
    renderData.logo.size = this.unmap(renderData.logo.width, renderData.logo.height);

    const circles = [];
    const positiveness = Math.random() > 0.5 ? 1 : -1;
    for (let i = 0; i < 20; i++) {
      circles.push({
        rail: Math.random() * 0.2,
        t: Math.random() * Math.PI * 2.0,
        r: Math.random() * 0.1 + 0.05,
        x: 0.5 + positiveness * Math.random() * 0.2,
        y: 0.5 + positiveness * Math.random() * 0.2
      });
    }
    renderData.circles = circles;
    this.renderData = renderData;
  }

  // === METHODS === //
  resizeCanvas() {
    const elem = this.elem;
    const rect = elem.getBoundingClientRect();
    this.width = rect.width * 2;
    this.height = rect.height * 2;
    elem.width = this.width;
    elem.height = this.height;
  }

  beginRender() {
    this.shouldRender = true;
    this.render();
  }

  mapLeast(x) {
    if (this.width < this.height) {
      return this.mapX(x);
    } else {
      return this.mapY(x);
    }
  }

  mapX(x) {
    return x * this.width;
  }

  mapY(y) {
    return y * this.height;
  }

  map(x, y) {
    return {
      x: x * this.width,
      y: y * this.height
    };
  }

  unmap(x, y) {
    return {
      x: x / this.width,
      y: y / this.height
    };
  }

  update() {
    const renderData = this.renderData;
    for (let i = 0; i < renderData.circles.length; i++) {
      const circle = renderData.circles[i];
      circle.t += this.deltaTime;
      circle.x = 0.5 + Math.sin(circle.t) * circle.rail;
      circle.y = 0.5 + Math.cos(circle.t) * circle.rail;
    }
  }

  getLongestEdge() {
    if (this.width > this.height) {
      return this.width;
    }
    return this.height;
  }

  render() {
    this.deltaTime = 0.005; // I dont care
    this.update();

    const ctx = this.ctx;
    const renderData = this.renderData;

    // === CLEAR SCREEN === //
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();

    // === RENDER LOGO === //
    ctx.fillStyle = "rgba(0, 128, 0, 0.3)";
    for (let i = 0; i < renderData.circles.length; i++) {
      const circle = renderData.circles[i];
      const position = this.map(circle.x, circle.y);
      const radius = this.mapLeast(circle.r);
      ctx.beginPath();
      ctx.ellipse(position.x, position.y, radius, radius, 0.0, 0.0, 2.0 * Math.PI);
      ctx.fill();
    }

    const logo = renderData.logo;
    const scaleLevel = 0.25 * (this.getLongestEdge() / logo.width);
    const scaled = {
      x: logo.size.x * scaleLevel,
      y: logo.size.y * scaleLevel
    };
    const scaledMapped = this.map(scaled.x, scaled.y);
    const center = this.map(0.5 - scaled.x / 2.0, 0.5 - scaled.y / 2.0);
    ctx.drawImage(renderData.logo, center.x, center.y,
                  scaledMapped.x,
                  scaledMapped.y);

    if (this.shouldRender) {
      requestAnimationFrame(() => { this.render() });
    }
  }

}
