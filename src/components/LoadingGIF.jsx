import React, { Component } from "react";

export default class LoadingGIF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.setState({
        show: this.props.show,
      });
    }
  }
  render() {
    return (
      <div
        style={{ display: this.state.show ? "flex" : "none" }}
        className="loading-gif"
      >
        <sp-label class="loading-text">Loading...</sp-label>
      </div>
    );
  }
}
