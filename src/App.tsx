import "./App.css";
import { Component } from "react";
import React from "react";
import VarItem from "./components/VarItem";
import { iPlcVar } from "./components/iPlcVar";
import Axios from "axios";
import parse from "url-parse";

interface iProps {}
interface iState {
  plc_vars: iPlcVar[];

  // тут у нас будут храниться те значения,
  // которые мы на странице изменили, чтобы
  // иметь возможность отправить их скопом
  // на сервер
  user_var: iPlcVar[];
  additional_key: number;
}

function getState(): iState {
  const ret: iState = {
    plc_vars: [],
    user_var: [],
    additional_key: 0,
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
    Axios.get(`http://${parse(window.location.href).hostname}:5000/plc_vars`).then((res) => {
      this.setState((state, props) => ({
        plc_vars: res.data,
        user_var: JSON.parse(JSON.stringify(res.data)),
      }));
      //здесь происходит обновление по интервалу
      this.timerID = setInterval(() => {
        Axios.get(`http://${parse(window.location.href).hostname}:5000/plc_vars`).then((res) =>
          this.setState({ plc_vars: res.data })
        );
      }, 100);
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  value_changed = (changed_item: iPlcVar, value: any) => {
    // сохраняем значение в массив,
    // чтобы потом по этому массиву сделать обновление
    // сразу нескольких полей
    console.log(`value holdup ${value}`);
    const user_values = this.state.user_var;
    const index = user_values.findIndex((item) => item.id === changed_item.id);
    user_values[index].value = value;
    this.setState({ user_var: user_values });
  };

  //здесь происходит отправка запроса на запись значения
  writeValue = (changed_item: iPlcVar, value: any) => {
    // эмуляция общения с сервером
    const _state: iPlcVar[] = JSON.parse(JSON.stringify(this.state.plc_vars));
    const item = _state.find((item) => item.id === changed_item.id);
    if (item) item.value = value;
    this.setState({ plc_vars: _state });
    //-------------------

    return true;
  };

  updateAll = () => {
    //эмулируем общение с сервером
    const new_state = [...this.state.plc_vars];
    this.state.user_var.forEach((item) => {
      const new_val = new_state.find((n_item) => n_item.id === item.id);
      if (new_val) new_val.value = item.value;
    });
    this.setState({ plc_vars: new_state });
  };
  // обновляем значения в userVar
  resetAll = () => {
    const new_state = [...this.state.user_var];
    this.state.plc_vars.forEach((item) => {
      const new_val = new_state.find((n_item) => n_item.id === item.id);
      if (new_val) new_val.value = item.value;
    });
    this.setState((state, props) => ({
      additional_key: state.additional_key + 1,
    }));
  };
  render() {
    return (
      <div className="App">
        {this.state.plc_vars.map((item, index) => (
          <VarItem
            key={`${item.id}_add_key_${this.state.additional_key}`}
            varitem={item}
            value_change={this.value_changed}
            writeValue={this.writeValue}
            useritem={this.state.user_var[index]}
          />
        ))}
        <input
          type="button"
          onClick={(e) => this.updateAll()}
          value="writeAll"
        />
        <input
          type="button"
          onClick={(e) => this.resetAll()}
          value="resetAll"
        />
      </div>
    );
  }
}

export default App;
