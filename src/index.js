const updateState = (...args) => _this => {
  if (args.length === 0) return;

  const [next, ...rest] = args;
  if (typeof next === "function") {
    const promise = next(_this.state);
    if (typeof promise.then === "function") {
      promise.then(() => updateState(...rest)(_this));
      return;
    }
  }
  _this.setState(next, () => updateState(...rest)(_this));
};

export default updateState;
