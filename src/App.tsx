import "./App.css";
import { Component } from "react";
import React from "react";
import VarItem from "./components/VarItem";
import { iPlcVar } from "./components/iPlcVar";

interface iProps {}
interface iState {
  plc_vars: iPlcVar[];
}
const plc_variables: iPlcVar[] = [
  {
    id: 1,
    type: "int",
    name: "state1",
    value: 0,
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
];
function getPlcVariables(): iPlcVar[] {
  return plc_variables;
}

function getState(): iState {
  const ret: iState = {
    plc_vars: getPlcVariables(),
  };
  return ret;
}

class App extends Component<iProps, iState> {
  state = getState();
  timerID: NodeJS.Timeout;
  constructor(props: iProps) {
    super(props);
    this.timerID = setTimeout(() => {}, 0);
  }
  componentDidMount() {
    this.timerID = setInterval(() => {
      plc_variables[0].value++;
      this.setState({ plc_vars: getPlcVariables() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  value_changed = (item: iPlcVar, value: any) => {
    // this.state.user_values.filter((u_v) => u_v.id === id)[0].value = value;
    // this.setState({user_values: this.state.user_values});
  };

  resetValue = (id: number) => {
    console.log(`reset value ${id}`);
  };
  writeValue = (id: number, value: any) => {
    const _state = getPlcVariables();
    const item = _state.find((item) => item.id === id);
    if (item) item.value = value;
    this.setState({ plc_vars: _state });
    return true;
  };

  render() {
    return (
      <div className="App">
        {this.state.plc_vars.map((item) => (
          <VarItem
            key={item.id}
            varitem={item}
            value_change={this.value_changed}
            reset={this.resetValue}
            writeValue={this.writeValue}
          />
        ))}
      </div>
    );
  }
}

export default App;
