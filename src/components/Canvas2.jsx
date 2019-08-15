import React, { Component } from 'react';
import * as THREE from 'three';
import leatherTexture from './leather.png';

export default class Canvas2 extends Component {
  componentDidMount() {
    this.onMouseDownPosition = new THREE.Vector2();
    this.onMouseDownTheta = 45;
    this.onMouseDownPhi = 60;
    this.theta = 45;
    this.phi = 60;

    //EVENTS
    window.addEventListener('resize', this.handleWindowResize);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 2;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xfafafa);
    this.canvasContainer.appendChild(this.renderer.domElement);

    //renderer events to rotate
    this.renderer.domElement.addEventListener('mousedown', this.handleMouseDown);
    this.renderer.domElement.addEventListener('mousewheel', this.handleMouseWheel);
    this.renderer.domElement.addEventListener('mouseup', this.handleMouseUp);

    this.renderer.domElement.addEventListener('mouseleave', () => {
      this.press = false;
    });

    this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);

    this.ambient = new THREE.AmbientLight(0xfff9e7);
    this.scene.add(this.ambient);

    this.directLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directLight.position.set(0, 0, 6);
    this.scene.add(this.directLight);

    // CONTROLS

    let geometry = new THREE.SphereGeometry(1, 32, 32);
    let loader = new THREE.TextureLoader();
    loader.load(leatherTexture, texture => {
      this.leather = new THREE.MeshLambertMaterial({
        map: texture
      });
      this.sphere = new THREE.Mesh(geometry, this.leather);
      this.scene.add(this.sphere);

      this.renderer.render(this.scene, this.camera);
      this.animate();
    });
  }

  handleMouseDown = (event) => {
    this.press = true;
    this.onMouseDownTheta = this.theta;
    this.onMouseDownPhi = this.phi;

    this.onMouseDownPosition.x = event.clientX;
    this.onMouseDownPosition.y = event.clientY;
  };

  handleMouseWheel = (event) => {
    console.log(event.wheelDeltaY);
  }

  handleMouseUp = (event) => {
    this.press = false;
    this.onMouseDownPosition.x = event.clientX - this.onMouseDownPosition.x;
    this.onMouseDownPosition.y = event.clientY - this.onMouseDownPosition.y;
  };

  handleWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();
  };

  handleMouseMove = event => {
    if (!this.press)  return;

    this.theta = -((event.clientX - this.onMouseDownPosition.x) * 0.5 + this.onMouseDownTheta);
    this.phi = ((event.clientY - this.onMouseDownPosition.y) * 0.5 + this.onMouseDownPhi);
    this.phi = Math.min(180, Math.max(0, this.phi));

    this.camera.position.x = Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
    this.camera.position.y = Math.sin( this.phi * Math.PI / 360 );

    this.camera.lookAt(this.scene.position);
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={{ width: '100vw', height: '100vh', margin: 'auto' }}
        ref={element => (this.canvasContainer = element)}
      />
    );
  }
}
