<div align="center">
  <h1>react-state-sequencer</h1>
</div>

[![npm][npm]][npm]
[![build][build]][build]
[![Prettier][prettier]][prettier]

`react-state-sequencer` is a utility library that will let you make updates on your local state in a order.

Internally it runs each update inside [`setState` callback](https://reactjs.org/docs/react-component.html#setstate) of previous call making updates queued.
The behavior then is an escape hatch to react `setState` calls [batching](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous). An example:

```javascript
import React from "react";
import updateState from "react-state-sequencer";

class App extends React.Component {
  state = {
    counter: 0
  };

  componentDidMount() {
    updateState(
      { counter: 1 },
      { counter: 2 },
      prevState => ({ counter: prevState.counter + 1 })
    )(this);
  };

  render() {
    console.log(this.state.counter);
    return (
      <h2>{this.state.counter}</h2>
    );
  }
}
```

Result of console.log:

> 0
> 1
> 2
> 3

### You can also pass a function that returns a `Promise` as an argument

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
    counter: 1,
    showButton: true
  };

  countToThree = () => {
    updateState(
      { showButton: false, counter: 1 },
      delayBySecond,
      prevState => ({ counter: prevState.counter + 1 }),
      delayBySecond,
      prevState => ({ showButton: true, counter: prevState.counter + 1 })
    )(this);
  };

  render() {
    return (
      <div>
        {this.state.showButton && (
          <button onClick={this.countToThree}>count to three</button>
        )}
        <h2>{this.state.counter}</h2>
      </div>
    );
  }
}
```
[![Edit 04j11v7pn0](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/04j11v7pn0)

### Warning

It's an experimental idea, you may run into two issues:
- race conditions,
- updating the unmounted component

Both will most frequently happen when using Promises. You may get the following error:

> Warning: Can't call setState (or forceUpdate) on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.

This happens when the component gets unmounted before the Promise resolves (e.g. when a user changes the route). Some function holds a reference to a "dead" component and tries to update it. This should be avoided.

### Why?

Because I love local state (Yes, that's my chance to express that I like to keep things local unless there is a clear benefit of doing the opposite). Other than that it's just an experimental idea that popped to my head after I had to first unmount a children component before changing a number of a controlled tab (if not I would get a DOM exception).

<!--
Links:
-->

[npm]: https://badge.fury.io/js/react-state-sequencer.svg
[build]: https://travis-ci.org/Tomekmularczyk/react-state-sequencer.svg?branch=master
[prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square