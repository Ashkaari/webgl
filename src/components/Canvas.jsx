import React, { Component } from 'react';
import * as THREE from 'three';
import cloudTexture from './smoke-1.png';

export default class Canvas extends Component {
  componentDidMount() {
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight;
    this.cloudParticles = [];

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.position.z = 5;
    this.camera.rotation.x = 1.16;
    this.camera.rotation.y = -0.12;
    this.camera.rotation.z = 0.27;

    this.ambient = new THREE.AmbientLight(0x555555);
    this.scene.add(this.ambient);

    this.directionalLight = new THREE.DirectionalLight(0xffeedd);
    this.directionalLight.position.set(0, 0, 1);
    this.scene.add(this.directionalLight);

    this.flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
    this.flash.position.set(200, 300, 100);
    this.scene.add(this.flash);

    this.renderer = new THREE.WebGLRenderer();
    this.scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.setSize(width, height);
    this.canvasContainer.appendChild(this.renderer.domElement);

    this.renderRain();
    this.renderClouds();

    this.animate();
  }

  renderRain = () => {
    this.rainGeometry = new THREE.Geometry();
    for (let i = 0; i < 15000; i++) {
      let rainDrop = new THREE.Vector3(
          Math.random() * 400 - 200,
          Math.random() * 500 - 250,
          Math.random() * 400 - 200
      );

      rainDrop.velocity = {};
      rainDrop.velocity = 0;
      this.rainGeometry.vertices.push(rainDrop);
    }

    let railMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.1,
      transparent: true,
    });

    this.rain = new THREE.Points(this.rainGeometry, railMaterial);
    this.scene.add(this.rain);
  };

  renderClouds = () => {
    let loader = new THREE.TextureLoader();
    loader.load(cloudTexture, texture => {
      let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
      let cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });

      for (let i = 0; i < 25; i++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random() * 800 - 400,
          500,
          Math.random() * 500 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.6;

        this.cloudParticles.push(cloud);
        this.scene.add(cloud);
      }
    });
  };

  animate = () => {
    this.cloudParticles.forEach(cloud => {
      cloud.rotation.z -= 0.002;
    });

    this.rainGeometry.vertices.forEach(rainDrop => {
      rainDrop.velocity -= 0.01 + Math.random() * 0.01;
      rainDrop.y += rainDrop.velocity;

      if (rainDrop.y < -200) {
        rainDrop.y = 200;
        rainDrop.velocity = 0;
      }
    });

    this.rainGeometry.verticesNeedUpdate = true;
    this.rain.rotation.y += 0.002;

    if (Math.random() > 0.96 || this.flash.power > 100) {
      if (this.flash.power < 100) {
        this.flash.position.set(
          Math.random() * 400,
          300 + Math.random() * 200,
          100
        );
      }

      this.flash.power = 50 + Math.random() * 500;
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.animate);
    this.canvasContainer.removeChild(this.renderer.domElement);
  }

  render() {
    return (
      <div
        style={{ width: '100vw', height: '100vh', margin: 'auto' }}
        ref={element => (this.canvasContainer = element)}
      />
    );
  }
}
