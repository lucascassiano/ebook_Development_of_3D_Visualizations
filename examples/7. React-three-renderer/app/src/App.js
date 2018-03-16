import React, { Component } from 'react';

import './App.css';

import RendererViewer from './RendererViewer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {

    return (
      <div className="App">
        <RendererViewer/>
      </div>
    );
  }
}

export default App;
