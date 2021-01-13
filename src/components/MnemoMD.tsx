import React, { Component } from "react";
import VarItem from "./VarItem";
import { iPlcVar } from "./iPlcVar";
import Axios from "axios";
import parse from "url-parse";
import imgmarkline from "./md_mnemo/lay/markline.png";
import nmemoimg from "./md_mnemo/lay/ostov.png";
import imgY2 from "./md_mnemo/lay/Y2.png";
import imgY1 from "./md_mnemo/lay/Y1.png";
import MnemoBooleanPresentation from "./MnemoBooleanPresentation";

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

const plc_parameters_view: { [id: string]: any } = {
  Y1: {
    templateimage: imgY1,
    left: "130px",
    top: "310px",
  },
  Y2: {
    templateimage: imgY2,
    left: "160px",
    top: "276px",
  },
};

export default class MnemoMD extends Component<iProps, iState> {
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
    return (
      <div>
        <div
          style={{
            position: "relative",
            width: "1300px",
            height: "919px",
            margin: "0px",
            padding: "0px",
          }}
        >
          <img
            src={nmemoimg}
            alt="nmemoimg"
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              zIndex: -1,
            }}
          />


          {this.state.plc_vars.map((element, index) => {
            if (plc_parameters_view[element.name] !== undefined)
              return (
                <MnemoBooleanPresentation
                  key={`${element.id}_add_key_${this.state.additional_key}`}
                  varitem={element}
                  value_change={this.value_changed}
                  writeValue={this.writeValue}
                  useritem={this.state.user_var[index]}
                  templateimage={plc_parameters_view[element.name].templateimage}
                  left={plc_parameters_view[element.name].left}
                  top={plc_parameters_view[element.name].top}
                />
              );
          })}

          <img
            src={imgmarkline}
            alt="imgmarkline"
            style={{
              position: "absolute",
              left: "0px",
              top: "0px",
              zIndex: -1,
            }}
          />
        </div>
      </div>
    );
  }
}
