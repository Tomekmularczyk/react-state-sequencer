import React from "react";
import updateState from "../index";

class DummyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  componentDidMount() {
    this.props.updateState(this);
  }

  render() {
    return null;
  }
}

export { DummyComponent };
