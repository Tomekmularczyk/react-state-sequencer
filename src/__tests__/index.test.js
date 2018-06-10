import React from "react";
import TestRenderer from "react-test-renderer";
import updateState from "../index";
import { DummyComponent } from "./testComponents";

const renderSpy = jest.spyOn(DummyComponent.prototype, "render");

describe("updateState", () => {
  beforeEach(() => {
    renderSpy.mockClear();
  });

  test("it updates the state", () => {
    const updater = updateState({ counter: 1 }, { counter: 2 }, { counter: 3 });

    const testRenderer = TestRenderer.create(
      <DummyComponent updateState={updater} />
    );
    const instance = testRenderer.getInstance();

    expect(instance.state.counter).toEqual(3);
  });

  test("re-renders component on each update", () => {
    const updater = updateState({ counter: 1 }, { counter: 2 }, { counter: 3 });

    const testRenderer = TestRenderer.create(
      <DummyComponent updateState={updater} />
    );
    const instance = testRenderer.getInstance();

    expect(instance.render).toHaveBeenCalledTimes(4); // 3 plus initial render
  });

  test("it accepts objects as well as function to setState", () => {
    const updater = updateState(
      { counter: 1 },
      prevState => ({ counter: prevState.counter + 1 }),
      prevState => ({ counter: prevState.counter + 1 })
    );

    const testRenderer = TestRenderer.create(
      <DummyComponent updateState={updater} />
    );
    const instance = testRenderer.getInstance();

    expect(instance.render).toHaveBeenCalledTimes(4);
    expect(instance.state.counter).toEqual(3);
  });

  test("it respects Promises as arguments and wait for them to resolve before running next state update", done => {
    let isPromiseAResolved = false;
    let isPromiseBResolved = false;
    const promiseProducerA = () =>
      new Promise(resolve => {
        isPromiseAResolved = true;
        resolve();
      });
    const promiseProducerB = () =>
      new Promise(resolve => {
        isPromiseBResolved = true;
        resolve();
      });

    const updater = updateState(
      promiseProducerA,
      prevState => ({ counter: prevState.counter + 1 }),
      prevState => ({ counter: prevState.counter + 1 }),
      promiseProducerB
    );

    const testRenderer = TestRenderer.create(
      <DummyComponent updateState={updater} />
    );
    const instance = testRenderer.getInstance();

    setTimeout(() => {
      expect(instance.render).toHaveBeenCalledTimes(3);
      expect(instance.state.counter).toEqual(2);
      expect(isPromiseAResolved && isPromiseBResolved).toBeTruthy();
      done();
    }, 1);
  });
});
