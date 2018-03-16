import React, { Component } from 'react';

import './App.css';

import ObjViewer from './components/ObjViewer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  render() {

    return (
      <div className = "view3d">
        <ObjViewer  objPath="./models/heart.obj" mtlPath="./models/heart.mtl" width={800} height={600}/>
        
      </div>
    );
  }
}

export default App;
