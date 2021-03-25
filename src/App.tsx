import "./App.css";
import { Component } from "react";
import React from "react";
import VarList from "./components/VarList";
import Image from "./components/Image";
import MnemoMD from "./components/MnemoMD";
import { BrowserRouter, Route, Switch, Redirect, withRouter, Link } from "react-router-dom";
import SvgMD from "./components/svgmd/SvgMD";
import VarList_mt from "./components/VarList_mt";
// import {Router} from "react-router";


class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
        <ul style={{ listStyle: "none", display: "inline" }}>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/home"><input type="button" value="Транспортер" /></Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/image"><input type="button" value="Картинка" /></Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/4"><input type="button" value="Домкрат" /></Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/5"><input type="button" value="Домкрат таблица" /></Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/6"><input type="button" value="Домкрат замки" /></Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/7"><input type="button" value="Домкрат замки orth" /></Link>
            </li>
          </ul>
          <Switch>
            <Route exact path="/home" component={VarList_mt} />
            <Route exact path="/md/:page_id" component={MnemoMD} />
            <Route exact path="/svgmd" component={SvgMD} />
            <Route exact path="/image" component={Image} />
            <Redirect from="/" to="/md/6" />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
