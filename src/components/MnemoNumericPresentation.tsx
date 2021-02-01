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
  changeable?: boolean;
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
    if (Number(e.target.value) >= 0 && Number(e.target.value) <=  32767)
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
    console.log(`value to send ${this.state.user_value}`);

    const write_val = new Promise<void>((resolve, reject) => {
      if (
        this.props.writeValue(this.props.varitem, this.state.user_value)
      ) {
        resolve();
      }
    });
    write_val.then(() => {
      // this.onChange({ target: { value: this.props.varitem.value, name: "" } });
      // this.setState({ user_value: value[0] });

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
            <div
              style={{
                // paddingLeft: "5px",
                fontSize: "14px",
                border: "0px",
                // paddingRight: "2px",
                borderRadius: "3px",
                width: "auto",
                display: "inline",
                // background: "#afa",
              }}
              >
              {this.props.varitem.name}
            </div> 
            {this.props.changeable ? (
            <div style={{display: "inline"}} >
            <input
              type="number"
              onChange = {this.onChange}
              onKeyUp = {(event)=>{if(event.key === "Enter") this.writeValue()}}
              value={this.state.user_value}
              style={{
                position: "absolute",
                left: "0px",
                top: "20px",
                paddingLeft: "5px",
                fontSize: "14px",
                border: "0.5px solid",
                paddingRight: "2px",
                borderRadius: "3px",
                width: "55px",
                background: this.state.user_value == this.props.varitem.value ? "#afa" : "#ffa",
              }}

            />
            <input type="button" value = "w"
            disabled = {this.state.user_value == this.props.varitem.value ? true:false}
            onClick={(e) => this.writeValue()}
                          style={{
                            position: "absolute",
                            left: "65px",
                            top: "20px",
                            paddingLeft: "2px",
                            fontSize: "14px",
                            border: "0.5px solid",
                            paddingRight: "2px",
                            borderRadius: "3px",
                            width: "20px",
                            background: "#0aa",
                          }}/>
            </div>
            ) : (
              <input
              type="text"
              disabled
              value={this.props.varitem.value}
              style={{
                position: "absolute",
                left: "0px",
                top: "20px",
                paddingLeft: "5px",
                fontSize: "14px",
                border: "0px",
                paddingRight: "2px",
                borderRadius: "3px",
                width: "55px",
                background: "#afa",
              }}

            />
            )}
          </div>
          )
        </div>
      </div>
    );
  }
}
