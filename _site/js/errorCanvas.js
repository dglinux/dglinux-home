// === WINDOW HANDLERS === //
window.onload = function() {
  const canvasElem = document.getElementById("error-canvas");
  const canvas = new ErrorCanvas(canvasElem);
  canvas.beginRender();
};

// === CANVAS === //
class ErrorCanvas {
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
    const bezier = new Bezier(0.4, 0.3, 0.8, 0.1, 0.5, 0.6, 0.5, 0.7);
    const interpolated = bezier.getLUT(99);
    const renderData = {};
    renderData.asteriods = [];
    for (let i = 0; i < interpolated.length; i++) {
      const that = interpolated[i];
      const positiveness = Math.random() > 0.5 ? 1 : -1;
      const off = positiveness * Math.random() * 0.01;
      const asteriod = {
        t: positiveness * Math.random() * Math.PI,
        x: that.x + off,
        y: that.y + off,
        radius: Math.random(),
        realRadius: Math.random() * 0.009 + 0.009
      };
      renderData.asteriods.push(asteriod);
    }
    for (let i = 0; i < 5; i++) {
      const positiveness = Math.random() > 0.5 ? 1 : -1;
      const off = positiveness * Math.random() * 0.01;
      const asteriod = {
        t: positiveness * Math.random() * Math.PI,
        x: 0.5 + off,
        y: 0.8 + off,
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
      if (ast.direction == undefined || (Math.abs(ast.direction.x) <= 0.001) && (Math.abs(ast.direction.y) <= 0.001)) {
        const positivenessX = Math.random() > 0.5 ? 1 : -1;
        const positivenessY = Math.random() > 0.5 ? 1 : -1;
        const offX = positivenessX * Math.random() * 0.02;
        const offY = positivenessX * Math.random() * 0.02;
        ast.direction = {
          x: offX,
          y: offY
        };
      }
      const fractionX = ast.direction.x * 0.01;
      const fractionY = ast.direction.y * 0.01;
      ast.direction.x -= fractionX;
      ast.direction.y -= fractionY;
      ast.x += fractionX;
      ast.y += fractionY;
      ast.r = ast.realRadius;
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

    // === RENDER QUESTION MARK === //
    this.renderQuestionMark();
  }

  renderQuestionMark() {
    const ctx = this.ctx;
    const renderData = this.renderData;
    ctx.fillStyle = "rgba(0, 128, 0, 0.4)";
    for (let i = 0; i < renderData.asteriods.length; i++) {
      const ast = renderData.asteriods[i];
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
