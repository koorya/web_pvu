import React, { Component } from "react";
// import Axios from "axios";
import parse from "url-parse";

interface iProps {}
interface iState {
  image_showed: boolean;
	image_key: any;
	imagesrc: string;
}

export default class Image extends Component<iProps, iState> {
  state = {
    image_showed: false,
		image_key: 1,
		imagesrc: `http://${parse(window.location.href).hostname}:5000/image.png0`,
  };
  componentDidMount() {    
  }
  updateImage = () => {
		this.setState({image_showed: true, image_key: this.state.image_key+1, imagesrc: `http://${parse(window.location.href).hostname}:5000/image.png${this.state.image_key}`});
  };

  render() {
    return (
      <div>
        <input
          type="button"
          value={`update image`}
          onClick={(e) => this.updateImage()}
        />
        <div className="ImageDiv">
          <img
            key={this.state.image_key}
            src={(this.state.image_showed ? this.state.imagesrc : "")}
            alt="cam vid"
          />
        </div>
      </div>
    );
  }
}
