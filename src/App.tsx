import "./App.css";
import { Component } from "react";
import React from "react";
import VarItem from "./components/VarItem";
import { iPlcVar } from "./components/iPlcVar";

interface iProps {}
interface iState {
  plc_vars: iPlcVar[];
  user_values: iPlcVar[];
}
var i = 0;
function getPlcVariables(): iPlcVar[] {
  return [
    {
      id: 1,
      type: "int",
      name: "state1",
      value: i++,
    },
    {
      id: 2,
      type: "float",
      name: "x",
      value: 2.4,
    },
    {
      id: 3,
      type: "bool",
      name: "enable",
      value: true,
    },
  ]
}

function getState(): iState {
  const ret: iState = {
    plc_vars: getPlcVariables(),
    user_values: [],
  };
  ret.user_values = ret.plc_vars.map((item) => Object.assign({}, item));
  return ret;
}

class App extends Component<iProps, iState> {
  state = getState();

  componentDidMount() {
    setInterval(()=>{this.setState({plc_vars: getPlcVariables()})}, 1000);
  }

  value_changed = (id: number, value: any) => {
    // this.state.user_values.filter((u_v) => u_v.id === id)[0].value = value;
    // this.setState({user_values: this.state.user_values});
  };
  
  resetValue = (id: number) => {

  }
  
  render() {
    return (
      <div className="App">
        {this.state.plc_vars.map((item) => (
          <VarItem
            key={item.id}
            varitem={item}
            user_value= {item.value}
            // {
            //   this.state.user_values.filter((u_v) => u_v.id === item.id)[0]
            //     .value
            // }
            value_change={this.value_changed}
            reset={this.resetValue}
          />
        ))}
      </div>
    );
  }
}

export default App;
