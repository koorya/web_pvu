import React, { Component } from "react";
import { iPlcVar } from "./iPlcVar";
import MnemoBooleanPresentation from "./MnemoBooleanPresentation";
import SvgStyleTag from "./svgmd/SvgStyleTag";

interface iProps {
  key: any;
  varitem: iPlcVar;
  useritem: iPlcVar;
  left: string;
  top: string;
  text: string;
  value_change: (item: iPlcVar, value: any) => void;
  writeValue: (changed_item: iPlcVar, value: any) => boolean;
}
interface iState {
}

export default class MnemoBooleanPresentationStyled extends Component<
  iProps,
  iState
> {


  componentDidMount() {
  }
  componentDidUpdate() {}


  render() {
    return (
      <div>
        <SvgStyleTag
          name={this.props.varitem.name}
          value={this.props.varitem.value}
        />

        <MnemoBooleanPresentation {...this.props} />
      </div>
    );
  }
}
