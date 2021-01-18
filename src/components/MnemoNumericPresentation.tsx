import React, { Component } from "react";
import { iPlcVar } from "./iPlcVar";
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
  user_value: any;
  validity: any;
  value_class_name: string;
}

export default class MnemoNumericPresentation extends Component<
  iProps,
  iState
> {
  input: any;
  state = {
    value_class_name: "varvalue",
    validity: true,
    user_value: "any",
  };
  constructor(props: iProps) {
    super(props);
    this.input = React.createRef();
  }

  onChange = (e: { target: { value: any; name: any } }) => {
    const new_value = e.target.value;

    this.setState({ user_value: new_value });
    if (this.input.current.reportValidity())
      this.props.value_change(this.props.varitem, new_value);
  };

  componentDidMount() {
    this.setState({ user_value: this.props.useritem.value });
  }
  componentDidUpdate() {}

  resetValue = () => {
    this.setState(() => {
      this.props.value_change(this.props.varitem, this.props.varitem.value);
      return { user_value: this.props.varitem.value };
    });
  };

  writeValue = () => {
    const write_val = new Promise<void>((resolve, reject) => {
      if (
        this.input.current.reportValidity() &&
        this.props.writeValue(this.props.varitem, this.state.user_value)
      ) {
        resolve();
      }
    });
    write_val.then(() => {
      // this.onChange({ target: { value: this.props.varitem.value, name: "" } });

      console.log(`value updated ${this.props.varitem.value}`);
    });
  };

  render() {
    return (
      <div>
        <SvgStyleTag
          name={this.props.varitem.name}
          value={this.props.varitem.value}
          floating={true}
        />
        <div
          style={{
            position: "absolute",
            left: this.props.left,
            top: this.props.top,
            color: "#f00",
            fontStyle: "italic",
            fontSize: "14px",
          }}
        >
          {this.props.text}(
          <div style={{ display: "inline", position: "relative", }}>
            {/* <input
              type="button"
              style={{
                borderRadius: "12px",
                height: "12px",
                width: "12px",
                position: "relative",
                top: "1px",
                padding: "0px",
                marginRight: "-13px",
                marginLeft: "2px",
                backgroundColor: this.props.varitem.value ? "#0f0" : "#ddd",
              }}
              disabled
            /> */}
            <input
              type="text"
              disabled
              value={this.props.varitem.name}
              style={{
                paddingLeft: "12px",
                fontSize: "14px",
                border: "0px",
                paddingRight: "2px",
                borderRadius: "3px",
                width: "30px",
                background: "#ff0",
              }}

            /> 
            <input
              type="text"
              disabled
              value={this.props.varitem.value}
              style={{
                position: "absolute",
                left: "0px",
                top: "20px",
                paddingLeft: "12px",
                fontSize: "14px",
                border: "0px",
                paddingRight: "2px",
                borderRadius: "3px",
                width: "30px",
                background: "#ff0",
              }}

            />
          </div>
          )
        </div>
      </div>
    );
  }
}
