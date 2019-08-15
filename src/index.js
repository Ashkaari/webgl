import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Canvas2 from './components/Canvas2';

class App extends Component {
  render() {
    return <Canvas2 />;
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
