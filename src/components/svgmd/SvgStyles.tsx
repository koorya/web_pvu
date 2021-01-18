import React, { Component } from "react";

interface iProps {
  show_names: boolean;

  Y1: boolean;
  Y2: boolean;
  // BP1: boolean;
  // SP4: boolean;
  // SP1: boolean;
  // SP2: boolean;
  // SP3: boolean;
  // BP2: boolean;
  Y16: boolean;
  Y17: boolean;
  Y18: boolean;
  Y9?: boolean;
  Y8?: boolean;
  // PP3: boolean;
  Y21?: boolean;
  // BP3: boolean;
  Y22?: boolean;
  // PP4: boolean;
  // BP4: boolean;
  Y15?: boolean;
  Y14?: boolean;
  Y12?: boolean;
  Y13?: boolean;
  Y10?: boolean;
  Y11?: boolean;

}
interface iState {}

export default class SvgStyles extends Component<iProps, iState> {
  render() {
    return (
      <style type="text/css">
        {`#names{display:${this.props.show_names ? "inline" : "none"};}`}

        {`#Y1{display:${this.props.Y1 ? "inline" : "none"};}`}
        {`#Y2{display:${this.props.Y2 ? "inline" : "none"};}`}
        {`#Y16{display:${this.props.Y16 ? "inline" : "none"};}`}
        {`#Y17{display:${this.props.Y17 ? "inline" : "none"};}`}
        {`#Y18{display:${this.props.Y18 ? "inline" : "none"};}`}

        {`#Y9{display:${this.props.Y9 ? "inline" : "none"};}`}
        {`#Y8{display:${this.props.Y8 ? "inline" : "none"};}`}
        {`#Y21{display:${this.props.Y21 ? "inline" : "none"};}`}
        {`#Y22{display:${this.props.Y1 ? "inline" : "none"};}`}
        {`#Y15{display:${this.props.Y15 ? "inline" : "none"};}`}
        {`#Y14{display:${this.props.Y14 ? "inline" : "none"};}`}
        {`#Y12{display:${this.props.Y12 ? "inline" : "none"};}`}
        {`#Y13{display:${this.props.Y13 ? "inline" : "none"};}`}
        {`#Y10{display:${this.props.Y10 ? "inline" : "none"};}`}
        {`#Y11{display:${this.props.Y11 ? "inline" : "none"};}`}
      </style>
    );
  }
}
