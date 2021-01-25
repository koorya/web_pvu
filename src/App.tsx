import "./App.css";
import { Component } from "react";
import React from "react";
import VarList from "./components/VarList";
import Image from "./components/Image";
import MnemoMD from "./components/MnemoMD";
import { BrowserRouter, Route, Switch, Redirect, withRouter } from "react-router-dom";
import SvgMD from "./components/svgmd/SvgMD";
// import {Router} from "react-router";


class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/home" component={VarList} />
            <Route exact path="/md/:page_id" component={MnemoMD} />
            <Route exact path="/svgmd" component={SvgMD} />
            <Route exact path="/image" component={Image} />
            <Redirect from="/" to="/md/3" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
