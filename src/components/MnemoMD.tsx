import React, { Component } from "react";

import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  withRouter,
  RouteComponentProps,
  Link,
} from "react-router-dom";

import { iPlcVar } from "./iPlcVar";
import Axios from "axios";
import parse from "url-parse";
import MnemoBooleanPresentation from "./MnemoBooleanPresentation";

import Page1 from "./md_mnemo/page1";
import Page2 from "./md_mnemo/page2";
import Page3 from "./md_mnemo/page3";
import SvgStyles from "./svgmd/SvgStyles";
import SvgStyleTag from "./svgmd/SvgStyleTag";
import MnemoNumericPresentation from "./MnemoNumericPresentation";
import MnemoBooleanPresentationStyled from "./MnemoBooleanPresentationStyled";

interface MatchParams {
  page_id: string;
}

interface iProps extends RouteComponentProps<MatchParams> {}
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

class MnemoMD extends Component<iProps, iState> {
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
    const page_number = Number(this.props.match.params.page_id);

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
          {page_number == 1 ? <Page1 /> : ""}
          {page_number == 2 ? this.page2_text() : ""}
          {page_number == 3 ? this.page3_text() : ""}
          {this.get_boolean_handle_text(
            "K5",
            "Реле включения/выключения распределения питания +24 (силовая нагрузка)",
            0,
            0
          )}
          <div
            style={{
              position: "absolute",
              left: "0px",
              top: "100px",
            }}
          >
            {this.get_FC_handle_text("FC1")}
          </div>
          <div
            style={{
              position: "absolute",
              left: "100px",
              top: "100px",
            }}
          >
            {this.get_FC_handle_text("FC2")}
          </div>
          <input
            style={{
              position: "absolute",
              left: "00px",
              top: "220px",
              width: "190px",
              background: "#f00",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "5px",
              fontSize: "20px",
            }}
            type="button"
            value="СТОП"
            onClick={() => {
              let upd_vars: iPlcVar[] = [
                ...[
                  this.state.plc_vars[this.getPlcVarIndexByName("FC1_command")],
                  this.state.plc_vars[this.getPlcVarIndexByName("FC2_command")],
                  this.state.plc_vars[this.getPlcVarIndexByName("FC1_freq")],
                  this.state.plc_vars[this.getPlcVarIndexByName("FC2_freq")],
                ],
              ];
              upd_vars.forEach((item) => (item.value = 0x0000));
              Axios.put(
                `http://${parse(window.location.href).hostname}:5000/plc_vars`,
                upd_vars
              );
            }}
          />
          <SvgStyleTag name="names" value={this.state.show_names} />
          <ul style={{ listStyle: "none", display: "inline" }}>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/1">1</Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/2">2</Link>
            </li>
            <li style={{ display: "inline", marginRight: "5px" }}>
              <Link to="/md/3">3</Link>
            </li>
          </ul>
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
  get_FC_handle_text = (fc_name: string) => {
    return (
      <div
        style={{
          // position: "relative",
          // left: "0px",
          // top: "100px",
          border: "solid #0f0 1px",
          width: "90px",
        }}
      >
        <div style={{ position: "relative", height: "45px", width: "90px" }}>
          {this.get_numeric_handle_text(fc_name + "_freq", "", 0, 0, true)}
        </div>
        <div>
          <input
            type="button"
            value="start"
            style={{ width: "45px" }}
            onClick={() => {
              this.writeValue(
                this.state.plc_vars[
                  this.getPlcVarIndexByName(fc_name + "_command")
                ],
                0x0001
              );
            }}
            disabled={
              this.state.plc_vars[
                this.getPlcVarIndexByName(fc_name + "_reset_error")
              ]?.value === true
            }
          />
          <input
            type="button"
            value="stop"
            style={{ width: "45px" }}
            onClick={() => {
              this.writeValue(
                this.state.plc_vars[
                  this.getPlcVarIndexByName(fc_name + "_command")
                ],
                0x0000
              );
            }}
            disabled={
              this.state.plc_vars[
                this.getPlcVarIndexByName(fc_name + "_reset_error")
              ]?.value === true
            }
          />
          <br />
          <input
            type="button"
            value="reset fault"
            style={{ width: "90px" }}
            onClick={() => {
              this.writeValue(
                this.state.plc_vars[
                  this.getPlcVarIndexByName(fc_name + "_command")
                ],
                0x0080
              );
            }}
            disabled={
              this.state.plc_vars[
                this.getPlcVarIndexByName(fc_name + "_reset_error")
              ]?.value === true
            }
          />
          <br />
          <input
            type="button"
            value="hard reset"
            style={{ width: "90px" }}
            onClick={() => {
              this.writeValue(
                this.state.plc_vars[
                  this.getPlcVarIndexByName(fc_name + "_reset_error")
                ],
                true
              );
            }}
            disabled={
              this.state.plc_vars[
                this.getPlcVarIndexByName(fc_name + "_reset_error")
              ]?.value === true
            }
          />
        </div>
      </div>
    );
  };
  get_numeric_handle_text = (
    prop_name: string,
    text: string,
    top: number,
    left: number,
    changeable?: boolean
  ) => {
    return this.getPlcVarIndexByName(prop_name) != -1 ? (
      <MnemoNumericPresentation
        key={`${
          this.state.plc_vars[this.getPlcVarIndexByName(prop_name)].id
        }_add_key_${this.state.additional_key}`}
        varitem={this.state.plc_vars[this.getPlcVarIndexByName(prop_name)]}
        value_change={this.value_changed}
        writeValue={this.writeValue}
        useritem={this.state.user_var[this.getPlcVarIndexByName(prop_name)]}
        left={`${left}px`}
        top={`${top}px`}
        text={text}
        changeable={changeable}
      />
    ) : (
      " "
    );
  };
  get_boolean_handle_text = (
    prop_name: string,
    text: string,
    top: number,
    left: number
  ) => {
    if (this.getPlcVarIndexByName("Y2") == -1) return "";
    return (
      <MnemoBooleanPresentationStyled
        key={`${
          this.state.plc_vars[this.getPlcVarIndexByName(prop_name)].id
        }_add_key_${this.state.additional_key}`}
        varitem={this.state.plc_vars[this.getPlcVarIndexByName(prop_name)]}
        value_change={this.value_changed}
        writeValue={this.writeValue}
        useritem={this.state.user_var[this.getPlcVarIndexByName(prop_name)]}
        left={`${left}px`}
        top={`${top}px`}
        text={text}
      />
    );
  };
  page2_text = () => {
    if (this.getPlcVarIndexByName("Y2") == -1) return "";

    return (
      <div>
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        <MnemoBooleanPresentationStyled
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
        {this.get_numeric_handle_text("BP4", "Датчик давления ДД4", 555, 630)}

        {this.get_boolean_handle_text(
          "HPV3_EN",
          "Регулятор расхода РР3",
          645,
          990
        )}
        {this.get_numeric_handle_text("YPP3_Iref", "", 685, 1140, true)}
        {this.get_boolean_handle_text("HPV3_RAMP", "", 665, 1140)}

        {this.get_boolean_handle_text(
          "HPV4_EN",
          "Регулятор расхода РР4",
          709,
          530
        )}
        {this.get_numeric_handle_text("YPP4_Iref", "", 749, 680, true)}
        {this.get_boolean_handle_text("HPV4_RAMP", "", 729, 680)}

        {this.get_numeric_handle_text("BP3", "Датчик давления ДД3", 565, 1010)}
        {this.get_numeric_handle_text("BP1", "Датчик давления ДД1", 550, 20)}
        {this.get_numeric_handle_text("SP4", "Рэле давления РД4", 585, 30)}
        {this.get_numeric_handle_text("SP1", "Рэле давления РД1", 623, 30)}
        {this.get_numeric_handle_text("SP2", "Рэле давления РД2", 682, 75)}
        {this.get_numeric_handle_text("SP3", "Рэле давления РД3", 720, 120)}
        {this.get_numeric_handle_text("BP2", "Датчик давления ДД2", 752, 160)}
        <Page2 />
      </div>
    );
  };

  page3_text = () => {
    if (this.getPlcVarIndexByName("Y2") == -1) return "";

    return (
      <div>
        {this.get_boolean_handle_text("Y3", "Распределитель Р3", 643, 508)}
        {this.get_boolean_handle_text("Y4", "Распределитель Р4", 475, 30)}
        {this.get_boolean_handle_text("Y5", "", 475, 220)}
        {this.get_boolean_handle_text("Y6", "Распределитель Р5", 740, 510)}
        {this.get_boolean_handle_text("Y7", "Распределитель Р6", 693, 514)}

        {this.get_boolean_handle_text(
          "HPV1_EN",
          "Регулятор расхода РР1",
          465,
          540
        )}
        {this.get_numeric_handle_text("YPP1_Iref", "", 505, 690, true)}
        {this.get_boolean_handle_text("HPV1_RAMP", "", 485, 690)}

        {this.get_boolean_handle_text(
          "HPV2_EN",
          "Регулятор расхода РР1",
          265,
          140
        )}
        {this.get_numeric_handle_text("YPP2_Iref", "", 305, 290, true)}
        {this.get_boolean_handle_text("HPV2_RAMP", "", 285, 290)}

        {this.get_numeric_handle_text("SP12", "Рэле давления Д12", 20, 694)}
        {this.get_numeric_handle_text("SP11", "Рэле давления Д11", 52, 750)}
        {this.get_numeric_handle_text("SP10", "Рэле давления Д10", 80, 808)}
        {this.get_numeric_handle_text("SP9", "Рэле давления Д9", 110, 861)}
        {this.get_numeric_handle_text("SP8", "Рэле давления Д8", 140, 915)}
        {this.get_numeric_handle_text("SP7", "Рэле давления Д7", 170, 976)}
        {this.get_numeric_handle_text("SP6", "Рэле давления Д6", 200, 1034)}
        {this.get_numeric_handle_text("SP5", "Рэле давления Д5", 233, 1084)}

        <Page3 />
      </div>
    );
  };
}

export default withRouter(MnemoMD);
