import React, { Component } from "react";
import { iPlcVar } from './iPlcVar';

interface iProps {
	key: any;
  varitem: any;
	user_value: any;
	value_change: Function;
	reset: (id: number) => void;
}
interface iState {
	user_value: any;
	value_class_name: string
}

export default class VarItem extends Component<iProps, iState> {
	state = {
		value_class_name: "varvalue",
		user_value: "any"
	}


  onChange = (e: { target: { value: any; name: any } }) => {
    const new_value = e.target.value;
	
		this.setState({ 'user_value': new_value });
		this.props.value_change(this.props.varitem.id, new_value);
	
		if (this.props.varitem.value.toString() !== new_value.toString())
      this.setState({ value_class_name: "varvalue different" });
		else 
			this.setState({ value_class_name: "varvalue" });

	};
	
	componentDidMount() {
		this.setState({user_value: this.props.user_value});
	}

  render() {
    return (
			<div style={{"padding": "1px"}}>
				<div className="varitem">
					<div className="varitem_name" >
						{this.props.varitem.name}
					</div>

					<div className="varitem_plcvalue" >
						{this.props.varitem.value.toString()}
					</div>
					<div className="varitem_uservalue">				
						<input 
						
							type="text"
							name="user_value"
							value={this.state.user_value}
							className={this.state.value_class_name}
							onChange={this.onChange}
							pattern={getPattern(this.props.varitem.type)}
						/>
						<input type="button" value="x" name="reset" onClick={(e) => this.props.reset(this.props.varitem.id)}/>
						<input type="button" value="write"/>
					</div>
				</div>
				<div style={{"clear": "both"}}></div>
			</div>
    );
  }
}

function getPattern(type: string): string {
  if (type === "int") {
    return "[0-9][0-9]*";
  }
  if (type === "float") {
    return "[0-9][0-9]*\\.[0-9][0-9]*";
  }
  if (type === "bool") {
    return "true|false|True|False";
  }
  return "";
}
