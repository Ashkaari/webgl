import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import Canvas from './components/Canvas';
import BrowserEditor from './components/BrowserImageEditor';

class App extends Component {
  render() {
    return <BrowserEditor />;
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
