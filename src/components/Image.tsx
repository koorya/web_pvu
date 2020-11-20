import React, { Component } from "react";
import Axios from "axios";
import parse from "url-parse";

interface iProps {}
interface iState {
	image_key: any;
	imagesrc: string;
}

export default class Image extends Component<iProps, iState> {
  state = {
		image_key: 1,
		imagesrc: `http://${parse(window.location.href).hostname}:5000/image.png0`,
  };
  componentDidMount() {    
  }
  updateImage = () => {
		this.setState({image_key: this.state.image_key+1, imagesrc: `http://${parse(window.location.href).hostname}:5000/image.png${this.state.image_key}`});
  };

  render() {
    return (
      <div>
        <input
          type="button"
          value={`update image`}
          onClick={(e) => this.updateImage()}
        />
        <img
					key={this.state.image_key}
          src={this.state.imagesrc}
          alt="cam vid"
          width="100%"
        />
      </div>
    );
  }
}
