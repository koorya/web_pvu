import React, { Component } from "react";
import { iPlcVar } from "./iPlcVar";
import Axios from "axios";
import parse from "url-parse";
import MnemoBooleanPresentation from "./MnemoBooleanPresentation";

import Page2 from "./md_mnemo/page2";
import SvgStyles from "./svgmd/SvgStyles";
import SvgStyleTag from "./svgmd/SvgStyleTag";
import MnemoNumericPresentation from "./MnemoNumericPresentation";

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
    show_names: false,
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
              left="180px"
              top="313px"
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
              left="220px"
              top="278px"
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
              left="505px"
              top="118px"
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
              left="568px"
              top="118px"
              text="Распределитель Р11"
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
              text="Распределитель Р12"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y9") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y9")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y9")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y9")]}
              left="1020px"
              top="240px"
              text="Распределитель Р7"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y8") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y8")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y8")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y8")]}
              left="1200px"
              top="240px"
              text=""
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y10") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y10")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y10")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y10")]}
              left="760px"
              top="280px"
              text="Распределитель Р8"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y11") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y11")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y11")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y11")]}
              left="940px"
              top="280px"
              text=""
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y13") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y13")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y13")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y13")]}
              left="705px"
              top="344px"
              text="Распределитель Р9"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y12") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y12")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y12")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y12")]}
              left="880px"
              top="344px"
              text=""
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y14") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y14")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y14")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y14")]}
              left="630px"
              top="480px"
              text="Распределитель Р10"
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("Y15") != -1 ? (
            <MnemoBooleanPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("Y15")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("Y15")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("Y15")]}
              left="830px"
              top="480px"
              text=""
            />
          ) : (
            " "
          )}
          {this.getPlcVarIndexByName("BP4") != -1 ? (
            <MnemoNumericPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("BP4")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("BP4")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("BP4")]}
              left="630px"
              top="555px"
              text="Датчик давления ДД4"
            />
          ) : (
            " "
          )}
          
          {this.getPlcVarIndexByName("PP4") != -1 ? (
            <MnemoNumericPresentation
              key={`${
                this.state.plc_vars[this.getPlcVarIndexByName("PP4")].id
              }_add_key_${this.state.additional_key}`}
              varitem={this.state.plc_vars[this.getPlcVarIndexByName("PP4")]}
              value_change={this.value_changed}
              writeValue={this.writeValue}
              useritem={this.state.user_var[this.getPlcVarIndexByName("PP4")]}
              left="530px"
              top="709px"
              text="Разъем датчика положения золотника"
            />
          ) : (
            " "
          )}


          <Page2 />

          <SvgStyleTag name="names" value={this.state.show_names} />
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
