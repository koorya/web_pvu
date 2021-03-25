import React, { Component } from "react";
import VarItem from "./VarItem";
import { iPlcVar } from "./iPlcVar";
import Axios from "axios";
import parse from "url-parse";

interface iProps {}
interface iState {
  plc_vars: iPlcVar[];

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

const descriptions: { [name: string]: string } = {
  Base_Fork_L: "описание переменной Base_Fork_L",
  Base_Fork_R: "описание переменной Base_Fork_R",
  End_Fork_L: "описание переменной End_Fork_L",
  End_Fork_L2: "описание переменной End_Fork_L2",
  End_Fork_R: "описание переменной End_Fork_R",
  End_Fork_R2: "описание переменной End_Fork_R2",
  HMI_Battery_Procent: "описание переменной HMI_Battery_Procent",
  HMI_Battery_Voltage: "описание переменной HMI_Battery_Voltage",
  HMI_Cargo_Angle: "описание переменной HMI_Cargo_Angle",
  HMI_Cargo_H_State: "описание переменной HMI_Cargo_H_State",
  HMI_Cargo_Height: "описание переменной HMI_Cargo_Height",
  HMI_Dist_Bottom: "описание переменной HMI_Dist_Bottom",
  HMI_Dist_Top: "описание переменной HMI_Dist_Top",
  HMI_HandBrake: "описание переменной HMI_HandBrake",
  HMI_Turttle: "описание переменной HMI_Turttle",
  HMI_Seat: "описание переменной HMI_Seat",
  HMI_Targ_Angle: "описание переменной HMI_Targ_Angle",
  HMI_Curr_Angle: "описание переменной HMI_Curr_Angle",
  HMI_Speed: "описание переменной HMI_Speed",
  HMI_Matrix_Step_Angles: "описание переменной HMI_Matrix_Step_Angles",
  HMI_US1: "описание переменной HMI_US1",
  HMI_US2: "описание переменной HMI_US2",
  HMI_US3: "описание переменной HMI_US3",
  HMI_US4: "описание переменной HMI_US4",
  HMI_US5: "описание переменной HMI_US5",
  HMI_US6: "описание переменной HMI_US6",
  HMI_Reverse: "описание переменной HMI_Reverse",
  HMI_Forward: "описание переменной HMI_Forward",
  HMI_Joystick2_Kind: "описание переменной HMI_Joystick2_Kind",
};

export default class VarList_mt extends Component<iProps, iState> {
  state = getState();

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

  render() {
    let joyskik_deskript = "";
    const joystick_destriptions = [
      "Пропорциональныое задание угла поворота",
      "Дискретное задание угла поворота",
      "Управление гидравликой подъемника",
    ];

    const joystick_value = this.state.plc_vars[
      this.getPlcVarIndexByName("HMI_Joystick2_Kind")
    ]?.value;
    if (joystick_value !== undefined)
      joyskik_deskript = joystick_destriptions[joystick_value];

    return (
      <div>
        <div style={{ width: "25%", float: "left", marginRight: "2%" }}>
          {this.state.plc_vars.map((item, index) =>
            index < 35 &&
            item.name !== "HMI_Joystick2_Kind" &&
            item.name !== "HMI_Forward" &&
            item.name !== "HMI_Reverse" ? (
              <VarItem
                key={`${item.id}_add_key_${this.state.additional_key}`}
                varitem={item}
                descript={descriptions[item.name]}
                value_change={this.value_changed}
                writeValue={this.writeValue}
                useritem={this.state.user_var[index]}
              />
            ) : (
              ""
            )
          )}
        </div>

        {/* <div style={{ width: "49%", float: "left" }}>
          {this.state.plc_vars.map((item, index) =>
            index >= 15 ? (
              <VarItem
                key={`${item.id}_add_key_${this.state.additional_key}`}
                varitem={item}
                value_change={this.value_changed}
                writeValue={this.writeValue}
                useritem={this.state.user_var[index]}
              />
            ) : (
              ""
            )
          )}
        </div> */}

        <div style={{ fontSize: "30pt" }}>{joyskik_deskript}</div>
        <div style={{ fontSize: "30pt" }}>
          {this.state.plc_vars[this.getPlcVarIndexByName("HMI_Forward")]?.value
            ? "Движение вперед"
            : this.state.plc_vars[this.getPlcVarIndexByName("HMI_Reverse")]
                ?.value
            ? "Движение назад"
            : "Остановка (режим ожидания)"}
        </div>

        <div style={{ clear: "both" }}></div>
      </div>
    );
  }

  getPlcVarIndexByName = (name: string): number => {
    let ret_index = -1;
    this.state.plc_vars.find((item, index) => {
      ret_index = index;
      return item.name === name;
    });
    return ret_index;
  };
}