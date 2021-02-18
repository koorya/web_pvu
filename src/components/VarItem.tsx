import React, { Component } from "react";
import { iPlcVar } from "./iPlcVar";

interface iProps {
  key: any;
  varitem: iPlcVar;
  useritem: iPlcVar;
  value_change: (item: iPlcVar, value: any) => void;
  writeValue: (changed_item: iPlcVar, value: any) => boolean;
}
interface iState {
  user_value: any;
  validity: any;
  value_class_name: string;
}

export default class VarItem extends Component<iProps, iState> {
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
    const write_val = new Promise((resolve, reject) => {
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
      <div style={{ padding: "1px" }}>
        <div className="varitem">
          <div className="varitem_name">{this.props.varitem.name}</div>

          <div className="varitem_plcvalue">
            {this.props.varitem.value?.toString()}
          </div>
          <div className="varitem_uservalue">
            {/* <input
              ref={this.input}
              type="text"
              name="user_value"
              value={this.state.user_value}
              className={(() => {
                if (
                  this.state.user_value.toString() ===
                  this.props.varitem.value?.toString()
                )
                  return "varvalue";
                else return "varvalue different";
              })()}
              onChange={this.onChange}
              pattern={getPattern(this.props.varitem.type)}
            />
            <input
              type="button"
              value="x"
              name="reset"
              onClick={(e) => this.resetValue()}
            />
            <input
              type="button"
              value="write"
              onClick={(e) => this.writeValue()}
            /> */}
          </div>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
    );
  }
}

function getPattern(type: string): string {
  if (type === "int") {
    return "-?[0-9]+";
  }
  if (type === "float") {
    return "-?[0-9]+(\\.[0-9]+)?";
  }
  if (type === "bool") {
    return "true|false|True|False";
  }
  return "";
}
