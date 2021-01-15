import React, { Component } from "react";

interface iProps {
  Y1: boolean;
  Y2: boolean;
}
interface iState {}

export default class SvgStyles extends Component<iProps, iState> {
  render() {
    return (
      <style type="text/css">
        {`#Y1{display:${this.props.Y1 ? "inline" : "none"};}`}
        {`#Y2{display:${this.props.Y2 ? "inline" : "none"};}`}
      </style>
    );
  }
}
