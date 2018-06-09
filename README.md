## react-state-sequencer [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

`react-state-sequencer` is a utility library that will let you make updates on your local react state in a order.

Internally it uses [setState callback](https://reactjs.org/docs/react-component.html#setstate) and runs each update inside callback of previous `setState` call.
The behavior then is an escape hatch to [react setState batching](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous). An example:

```javascript
import React from "react";
import updateState from "react-state-sequencer";

export default class App extends React.Component {
  state = {
    counter: 1
  };

  handleButtonClick = () => {
    updateState(
      { counter: 1 },
      { counter: 2 },
      prevState => ({ counter: prevState.counter + 1 })
    )(this);
  };

  render() {
    console.log(this.state.counter);
    return (
      <div>
        <button onClick={this.handleButtonClick}>update state</button>
        <h2>{this.state.counter}</h2>
      </div>
    );
  }
}
```

Result of console.log:
> 1
> 2
> 3

### You can also pass function that returns Promise as argument

The following example will print 1, 2, 3 every second:

```javascript
import React from "react";
import updateState from "react-state-sequencer";

const delayBySecond = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });

export default class App extends React.Component {
  state = {
    counter: 1
  };

  countToThree = () => {
    updateState(
      { counter: 1 },
      delayBySecond,
      { counter: 2 },
      delayBySecond,
      { counter: 3 }
    )(this);
  };

  render() {
    return (
      <div>
        <button onClick={this.countToThree}>count to three</button>
        <h2>{this.state.counter}</h2>
      </div>
    );
  }
}
```

### Warning

Be careful when using Promises. You may run into the following error:

> Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

This happens when the component gets unmounted before the Promise resolves (e.g. when a user changes the route). Some function holds a reference to a "dead" component and tries to update it. This should be avoided.
