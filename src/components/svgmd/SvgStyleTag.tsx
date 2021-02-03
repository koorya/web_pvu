import React, { Component } from "react";

interface iProps {
  name: string;
  value: boolean | any;
  floating?: boolean;
}
interface iState {}

export default class SvgStyleTag extends Component<iProps, iState> {
  render() {
    const value = Number(this.props.value) * 255.0 / 600.0;
    return (
      <style type="text/css">
        {this.props.floating?
        `#${this.props.name}{display: "inline"; fill: rgb(255, ${255-value}, ${255-value});}`
        :
        `#${this.props.name}{display:${this.props.value ? "inline" : "none"};}`
        }


      </style>
    );
  }
}
