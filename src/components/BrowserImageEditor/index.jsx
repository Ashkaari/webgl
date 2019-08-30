import React, { Component } from 'react';
import './index.scss';
import addShape from './images/button.png';
export default class BrowserEditor extends Component {
  componentDidMount() {
    this.initializeCanvas();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown');
    this.canvas.removeEventListener('mousemove');
    this.canvas.removeEventListener('mouseup');
  }

  initializeCanvas = () => {
    this.context = this.canvas.getContext('2d');
    this.lastX = 50;
    this.lastY = 20;
    this.zoom = 1;
    this.padding = { x: 50, y: 20 };
    this.shapes = [];
    this.clickedShape = null;

    this.canvas.width = window.innerWidth / 2;
    this.canvas.height = window.innerHeight;

    this.canvas.addEventListener('mousedown', this.selectShape);
    this.canvas.addEventListener('mousemove', this.moveShape);
    this.canvas.addEventListener('mouseup', this.unselectShape);

    this.context.fillStyle = '#dbdbdb';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  createShape = (width, height, fill) => {
    this.lastX =
      this.lastX >= this.canvas.width - width - this.padding.x
        ? this.padding.x
        : this.lastX;

    this.shapes.push({ x: this.lastX, y: this.lastY, width, height, fill });

    this.context.fillStyle = fill;
    this.context.fillRect(this.lastX, this.lastY, width, height);

    this.lastX += width + 20;
    this.lastY =
      this.lastX >= this.canvas.width - width - this.padding.x
        ? this.lastY + width * 1.2 + this.padding.y
        : this.lastY;
  };

  createShapeArcs = (x, y, w, h) => {
    let coords = [
      { position: 'topleft', x, y },
      { position: 'topright', x: x + w, y },
      { position: 'bottomright', x: x + w, y: y + h },
      { position: 'bottomleft', x, y: y + h }
    ];

    this.clickedShape.arcs = coords;

    coords.forEach(coordinates => {
      this.context.beginPath();
      this.context.fillStyle = 'rgba(133, 200, 193, 0.8)';
      this.context.arc(coordinates.x, coordinates.y, 10, 0, 2 * Math.PI, false);
      this.context.fill();
    });
  };

  selectShape = event => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (this.clickedShape) {
      for (let i = 0; i < this.clickedShape.arcs.length; i++) {
        let arc = this.clickedShape.arcs[i];
        if (Math.sqrt((mouseX - arc.x) ** 2 + (mouseY - arc.y) ** 2) < 10) {
          this.canvas.dragging = false;
          this.canvas.dragging_arc = true;
          this.clickedArc = arc;
          return;
        }
      }
    }

    this.clickedShape = null;
    this.clickedArc = null;

    for (let i = 0; i < this.shapes.length; i++) {
      let shape = this.shapes[i];
      if (
        mouseY > shape.y &&
        mouseY < shape.y + shape.height &&
        mouseX > shape.x &&
        mouseX < shape.x + shape.width
      ) {
        this.clickedShape = shape;
        this.canvas.dragging = true;
        this.clickedShape.dragX = mouseX - shape.x;
        this.clickedShape.dragY = mouseY - shape.y;

        this.context.fillStyle = shape.fill;
        this.context.strokeStyle = '#85c8c1';
        this.context.lineWidth = 4;
        this.context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        this.createShapeArcs(shape.x, shape.y, shape.width, shape.height);

        break;
      }
    }
    //delete this if we want multiselect
    this.draw();
  };

  moveShape = event => {
    event.preventDefault();

    if (this.canvas.dragging) {
      const newPositionX = event.clientX - this.clickedShape.dragX;
      const newPositionY = event.clientY - this.clickedShape.dragY;
      if (
        newPositionX <=
          this.canvas.width - this.clickedShape.width - this.padding.x &&
        newPositionX >= this.padding.x
      ) {
        this.clickedShape.x = newPositionX;
      }

      if (
        newPositionY <=
          this.canvas.height - this.clickedShape.height - this.padding.y &&
        newPositionY >= this.padding.y
      ) {
        this.clickedShape.y = newPositionY;
      }

      this.draw();
    }

    if (this.canvas.dragging_arc) {
      // detect direction of moving
      // 1 - increasing +inf
      // 0 - decreasing -inf

      let directionX = 0;
      let directionY = 0;

      if (event.clientX > this.clickedArc.x) {
        directionX = 1;
      }

      if(event.clientY > this.clickedArc.y) {
        directionY = 1
      }

      switch (this.clickedArc.position) {
        case 'topleft':
        case 'bottomleft': {
          if (event.clientX < this.padding.x || event.clientX > this.clickedShape.x + this.clickedShape.width - 30) return;

          if (directionX) {
            this.clickedShape.width -= event.clientX - this.clickedShape.x;
            this.clickedShape.x = event.clientX;
          } else {
            this.clickedShape.width += this.clickedShape.x - event.clientX;
            this.clickedShape.x -= this.clickedShape.x - event.clientX;
          }

          if (directionY) {
            this.clickedShape.height += this.clickedShape.y - event.clientY
          }

          break;
        }
        case 'topright':
        case 'bottomright': {
          if (event.clientX > this.canvas.width - this.padding.x || event.clientX < this.clickedShape.x + 30) return;

          this.clickedShape.width +=
            event.clientX - this.clickedShape.width - this.clickedShape.x;
          break;
        }
      }
      this.draw();
    }
  };

  unselectShape = () => {
    this.canvas.dragging = false;
    this.canvas.dragging_arc = false;
    this.canvas.style.cursor = 'default';
  };

  draw = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#dbdbdb';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    //this.setImage();

    for (let i = 0; i < this.shapes.length; i++) {
      this.context.fillStyle = this.shapes[i].fill;
      this.context.fillRect(
        this.shapes[i].x,
        this.shapes[i].y,
        this.shapes[i].width,
        this.shapes[i].height
      );
    }

    if (this.clickedShape) {
      this.context.strokeStyle = 'rgba(133, 200, 193, 0.8)';
      this.context.lineWidth = 10;
      this.context.fillStyle = this.clickedShape.fill;

      const { x, y, width, height } = this.clickedShape;

      this.context.strokeRect(x, y, width, height);
      this.context.fillRect(x, y, width, height);
      this.createShapeArcs(x, y, width, height);
    }
  };

  setCanvasZoom = event => {
    this.zoom = event.target.value;
  };

  // ZOOM: https://jsfiddle.net/CanvasCode/92ekrbnz/2/
  setImage = () => {
    let bg = new Image();
    bg.src =
      'https://media.istockphoto.com/vectors/golden-abstract-background-vector-id924294136?k=6&m=924294136&s=612x612&w=0&h=UIm79P7jA-EJRi4rBLg7nxrdSM41jLWJ3aBPoLz5koU=';
    this.context.drawImage(
      bg,
      this.canvas.width / 2 - (bg.width * this.zoom) / 2,
      this.canvas.height / 2 - (bg.height * this.zoom) / 2,
      bg.width * this.zoom,
      bg.height * this.zoom
    );
  };

  render() {
    return (
      <div className="browser-editor__block">
        <canvas
          className="browser-editor__canvas"
          ref={el => (this.canvas = el)}
        >
          this shit is not supported in ur browser so go to hell ty
        </canvas>
        <div className="browser-editor__controls">
          <div className="browser-editor__controls-panel">
            <button
                className="browser-editor__controls-panel__button"
                onClick={() =>
                    this.createShape(
                        150,
                        150,
                        //'#' + parseInt(Math.random() * 0xffffff).toString(16)
                        "rgba(0,0,0, 0.1)"
                    )
                }
            >
              <img src={addShape} alt="add new shape" />
            </button>
          </div>
          {/*<div className="browser-editor__controls-zoom">
            <label>
              Zoom bg
              <input
                type="range"
                min="1"
                max="10"
                step="0.2"
                value={this.zoom}
                onChange={this.setCanvasZoom}
              />
            </label>
            <button onClick={this.setImage}>Set background</button>
          </div>*/}
        </div>
      </div>
    );
  }
}
