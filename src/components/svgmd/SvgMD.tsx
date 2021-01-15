import React, { Component } from "react";
import SvgComponent from ".././md_mnemo/svg_component";
import SvgStyles from "./SvgStyles";

// here we can transform svg to native react https://transform.tools/

interface iProps {}
interface iState {
  Y1: boolean;
  Y2: boolean;
}

export default class SvgMD extends Component<iProps, iState> {
  constructor(props: iProps) {
    super(props);
    this.state = { Y1: false, Y2: false };
  }
  render() {
    return (
      <div style={{backgroundColor: "#fff"}}>
        <input
          type="button"
          value="on Y1"
          onClick={() => this.setState({ Y1: true })}
        />
        <input
          type="button"
          value="off Y1"
          onClick={() => this.setState({ Y1: false })}
        />
        <input
          type="button"
          value="on Y2"
          onClick={() => this.setState({ Y2: true })}
        />
        <input
          type="button"
          value="off Y2"
          onClick={() => this.setState({ Y2: false })}
        />
        <SvgStyles Y1={this.state.Y1} Y2={this.state.Y2} />
        <SvgComponent />
      </div>
    );
  }
}
