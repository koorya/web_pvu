import React from "react";
import MemoHydraulicCirctuit from "./svg/image";

class HydraulicCircuit extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  componentDidMount() {}

  click = (obj) => {
    if (obj.id === "Y4_5") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y4"],
          this.props.plc_vars["Y5"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y1_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y1"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y2_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y2"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y3_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y3"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y6_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y6"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y7_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y7"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y18_"){
      let upd_vars = [
        ...[
          this.props.plc_vars["Y18"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y16_17") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y16"],
          this.props.plc_vars["Y17"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y8_9") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y8"],
          this.props.plc_vars["Y9"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y10_11") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y10"],
          this.props.plc_vars["Y11"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y12_13") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y12"],
          this.props.plc_vars["Y13"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
    } else if (obj.id === "Y14_15") {
      let upd_vars = [
        ...[
          this.props.plc_vars["Y14"],
          this.props.plc_vars["Y15"],
        ],
      ];
      upd_vars.forEach(el => el.value = false);
      this.props.handler(upd_vars);
  
    }else {
      if (this.props.plc_vars[obj.id] !== undefined) {
        console.log("someone clicked");
        let upd_vars = [
          ...[
            this.props.plc_vars[obj.id],
          ],
        ];
        upd_vars.forEach(el => el.value = !el.value);
        this.props.handler(upd_vars);      }
    }
  };
  render() {
    return (
      <div>
        <MemoHydraulicCirctuit
          Y1 = {this.props.plc_vars.Y1.value}
          Y1_ = {!this.props.plc_vars.Y1.value}
          Y2 = {this.props.plc_vars.Y2.value}
          Y2_ = {!this.props.plc_vars.Y2.value}
          Y3 = {this.props.plc_vars.Y3.value}
          Y3_ = {!this.props.plc_vars.Y3.value}
          Y4 = {this.props.plc_vars.Y4.value}
          Y5 = {this.props.plc_vars.Y5.value}
          Y4_5 = {!this.props.plc_vars.Y4.value && !this.props.plc_vars.Y5.value}
          Y6 = {this.props.plc_vars.Y6.value}
          Y6_ = {!this.props.plc_vars.Y6.value}
          Y7 = {this.props.plc_vars.Y7.value}
          Y7_ = {!this.props.plc_vars.Y7.value}
          Y8 = {this.props.plc_vars.Y8.value}
          Y9 = {this.props.plc_vars.Y9.value}
          Y8_9 = {!this.props.plc_vars.Y8.value && !this.props.plc_vars.Y9.value}
          Y10 = {this.props.plc_vars.Y10.value}
          Y11 = {this.props.plc_vars.Y11.value}
          Y10_11 = {!this.props.plc_vars.Y10.value && !this.props.plc_vars.Y11.value}
          Y12 = {this.props.plc_vars.Y12.value}
          Y13 = {this.props.plc_vars.Y13.value}
          Y12_13 = {!this.props.plc_vars.Y12.value && !this.props.plc_vars.Y13.value}
          Y14 = {this.props.plc_vars.Y14.value}
          Y15 = {this.props.plc_vars.Y15.value}
          Y14_15 = {!this.props.plc_vars.Y14.value && !this.props.plc_vars.Y15.value}
          Y16 = {this.props.plc_vars.Y16.value}
          Y17 = {this.props.plc_vars.Y17.value}
          Y16_17 = {!this.props.plc_vars.Y16.value && !this.props.plc_vars.Y17.value}
          Y18 = {this.props.plc_vars.Y18.value}
          Y18_ = {!this.props.plc_vars.Y18.value}
          HPV1_EN = {this.props.plc_vars.HPV1_EN.value}
          HPV2_EN = {this.props.plc_vars.HPV2_EN.value}
          HPV3_EN = {this.props.plc_vars.HPV3_EN.value}
          HPV4_EN = {this.props.plc_vars.HPV4_EN.value}

          clickfn={(el) => this.click(el.target)}
        />
      </div>
    );
  }
}

export default HydraulicCircuit;
