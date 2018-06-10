'use strict';

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var updateState = function updateState() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (_this) {
    if (args.length === 0) return;

    var next = args[0],
        rest = args.slice(1);

    if (typeof next === "function") {
      var promise = next(_this.state);
      if (typeof promise.then === "function") {
        promise.then(function () {
          return updateState.apply(undefined, toConsumableArray(rest))(_this);
        });
        return;
      }
    }
    _this.setState(next, function () {
      return updateState.apply(undefined, toConsumableArray(rest))(_this);
    });
  };
};

module.exports = updateState;
