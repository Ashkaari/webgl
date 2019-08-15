import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import Canvas from './components/Canvas';

class App extends Component {
  render() {
    return <Canvas />;
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
