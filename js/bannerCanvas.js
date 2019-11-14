// === WINDOW HANDLERS === //
window.onload = function() {
  const canvasElem = document.getElementById("banner-canvas");
  const canvas = new BannerCanvas(canvasElem);
  canvas.beginRender();
};

// === CANVAS === //
class BannerCanvas {
  // === CONSTRUCTORS === //
  constructor(elem) {
    this.elem = elem;
    this.ctx = elem.getContext("2d");
    this.shouldRender = false;

    this.resizeCanvas();
    window.onresize = () => {
      this.resizeCanvas();
    };

    // === RENDER DATA === //
    const renderData = {};
    // generate ~20 asteriods
    renderData.asteriods = [];
    for (let i = 0; i < 100; i++) {
      const positiveness = Math.random() > 0.5 ? 1 : -1;
      const asteriod = {
        t: positiveness * Math.random() * Math.PI,
        x: Math.random(),
        y: positiveness * Math.random() * 0.05 + 0.5,
        z: Math.random(),
        radius: Math.random(),
        realRadius: Math.random() * 0.009 + 0.009
      };
      renderData.asteriods.push(asteriod);
    }
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
    const asteriods = this.renderData.asteriods;
    for (let i = 0; i < asteriods.length; i++) {
      const ast = asteriods[i];
      ast.z = Math.sin(ast.t);
      ast.x = Math.cos(ast.t) * 0.48 + 0.51;
      const scale = ast.z * 0.5 + 0.5 + 0.1;
      ast.r = ast.realRadius * Math.sqrt(scale);
      ast.t += this.deltaTime;
    }
  }

  render() {
    this.deltaTime = 0.005; // I dont care
    this.update();

    if (this.shouldRender) {
      requestAnimationFrame(() => { this.render() });
    }
    const ctx = this.ctx;
    const renderData = this.renderData;

    // === CLEAR SCREEN === //
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.rect(0, 0, this.width, this.height);
    ctx.fill();

    // === OTHER SPHERES === //
    this.renderAsteriods(false);

    // === CENTER SPHERE === //
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#006600";
    const center = this.map(0.5, 0.5);
    const radius = this.mapLeast(0.3);
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius, radius, 0.0, 0.0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // === OTHER SPHERES === //
    this.renderAsteriods(true);
  }

  renderAsteriods(onSurface) {
    const ctx = this.ctx;
    const renderData = this.renderData;
    ctx.fillStyle = "rgba(0, 128, 0, 0.4)";
    for (let i = 0; i < renderData.asteriods.length; i++) {
      const ast = renderData.asteriods[i];
      if (!((onSurface && ast.z >= 0.0) ||
            (!onSurface && ast.z <= 0.0))) {
        continue;
      }
      const center = this.map(ast.x, ast.y);
      const radius = this.mapLeast(ast.r);
      ctx.beginPath();
      ctx.ellipse(center.x, center.y,
                  radius, radius,
                  0.0, 0.0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
