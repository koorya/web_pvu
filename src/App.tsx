import "./App.css";
import { Component } from "react";
import React from "react";
import  VarList  from "./components/VarList";
import Image from "./components/Image"



class App extends Component {


  render() {
    return (
      <div className="App">
        <VarList key="varlist1"/>
        <Image key="image" />
      </div>
    );
  }
}

export default App;
