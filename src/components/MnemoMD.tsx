import React, { Component } from "react";
import { iPlcVar } from "./iPlcVar";
import Axios from "axios";
import parse from "url-parse";
import MnemoBooleanPresentation from "./MnemoBooleanPresentation";

import Page2 from "./md_mnemo/page2";
import SvgStyles from "./svgmd/SvgStyles";

interface iProps {}
interface iState {
  plc_vars: iPlcVar[];

  user_var: iPlcVar[];
  additional_key: number;
  show_names: boolean;
}

function getState(): iState {
  const ret: iState = {
    plc_vars: [],
    user_var: [],
    additional_key: 0,
    show_names: true,
  };
  return ret;
}

export default class MnemoMD extends Component<iProps, iState> {
  state = getState();
  svg_ref = React.createRef<HTMLDocument>();
  timerID: NodeJS.Timeout;
  constructor(props: iProps) {
    super(props);
    this.timerID = setTimeout(() => {}, 0);
  }
  componentDidMount() {
    Axios.get(
      `http://${parse(window.location.href).hostname}:5000/plc_vars`
    ).then((res) => {
      this.setState((state, props) => ({
        plc_vars: res.data,
        user_var: JSON.parse(JSON.stringify(res.data)),
      }));
      //здесь происходит обновление по интервалу
      this.timerID = setInterval(() => {
        Axios.get(
          `http://${parse(window.location.href).hostname}:5000/plc_vars`
        ).then((res) => this.setState({ plc_vars: res.data }));
      }, 500);
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
    changed_item = Object.assign({}, changed_item);
    changed_item.value = value;
    const prom = Axios.put(
      `http://${parse(window.location.href).hostname}:5000/plc_vars`,
      [changed_item]
    );
    prom.then((res) => console.log(`${changed_item.value} ${res.data}`));
    prom.catch((res) => console.log(`AXIOS PUT FAILED ${res}`));

    const item = _state.find((item) => item.id === changed_item.id);
    if (item) item.value = value;
    // this.setState({ plc_vars: _state });
    //-------------------

    return true;
  };

  updateAll = () => {
    //эмулируем общение с сервером
    const new_state = [...this.state.plc_vars];
    let upd_vars: iPlcVar[] = [];
    this.state.user_var.forEach((item) => {
      const new_val = new_state.find((n_item) => n_item.id === item.id);
      if (new_val && new_val.value !== item.value)
        upd_vars = [...upd_vars, item];
    });
    Axios.put(
      `http://${parse(window.location.href).hostname}:5000/plc_vars`,
      upd_vars
    );

    // this.setState({ plc_vars: new_state });
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

  getPlcVarIndexByName = (name: string): number => {
    let ret_index = -1;
    this.state.plc_vars.find((item, index) => {
      ret_index = index;
      return item.name === name;
    });
    return ret_index;
  };

  render() {
    return (
      <div style={{ backgroundColor: "#fff" }}>
        <div
          style={{
            position: "relative",
            width: "1300px",
            height: "919px",
            margin: "0px",
            padding: "0px",
          }}
        >
          {this.getPlcVarIndexByName("Y1") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y1")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y1")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y1")]}
              left="130px"
              top="310px"
              text="Распределитель Р1"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y2") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y2")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y2")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y2")]}
              left="160px"
              top="276px"
              text="Распределитель Р2"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y16") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y16")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y16")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y16")]}
              left="470px"
              top="110px"
              text=""
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y17") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y17")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y17")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y17")]}
              left="570px"
              top="115px"
              text="Распределитель Р12"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y18") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y18")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y18")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y18")]}
              left="700px"
              top="160px"
              text="Распределитель Р11"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y16") != -1 ? (
            <SvgStyles
              show_names={this.state.show_names}
              Y1={this.state.plc_vars[this.getPlcVarIndexByName("Y1")].value}
              Y2={this.state.plc_vars[this.getPlcVarIndexByName("Y2")].value}
              Y16={this.state.plc_vars[this.getPlcVarIndexByName("Y16")].value}
              Y17={this.state.plc_vars[this.getPlcVarIndexByName("Y17")].value}
              Y18={this.state.plc_vars[this.getPlcVarIndexByName("Y18")].value}
            />
          ) : (
            ""
          )}
          <Page2 />
          names:{"  "}
          <input
            type="button"
            onClick={() => {
              if (this.state.show_names) this.setState({ show_names: false });
              else this.setState({ show_names: true });
            }}
            value={this.state.show_names ? "hide" : "display"}
            style={{ position: "absolute" }}
          />
        </div>
      </div>
    );
  }
}
