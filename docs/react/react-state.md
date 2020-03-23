---
title: State
order: 5
category: React
keyword: React, JavaScript
parentMenu: State
summary:
---

把setState当作一个【请求】，而不是立即执行。React不保证setState立即执行。它可能会批量或者延迟执行。因此在setState后访问this.state是有问题的。

可以在componentDidUpdate或者setState回调函数中访问数据。他们二者都会在DOM更新后触发。通常建议使用componentDidUpdate

setState总是会触发再次渲染，除非shouldComponentUpdate返回false。因此，如果在shouldComponentUpdate或者条件判断中不好处理，当值相同时，尽量不调用setState，以避免再次渲染。

在同一周期内多次调用setState，他们将被合并，后面的值将覆盖前面当值。如下所示：
```js
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```
[https://reactjs.org/docs/react-component.html#setstate](https://reactjs.org/docs/react-component.html#setstate)

[https://stackoverflow.com/a/48610973/458193](https://stackoverflow.com/a/48610973/458193)

[https://github.com/facebook/react/issues/11527#issuecomment-360199710](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

React事件处理函数中的setState会进行批量合并操作，无论多少次调用、在多少个组件中被调用，都只会产生一次re-render，其中都数据是Shallow Merge。由于只有一次re-render，因此我们不会看到“中间状态”。

而对于非React Event Handler，如setTimeout、AJAX, await等response handle，setState会立即执行，我们将看到中间状态。

The this.state object is updated when we re-render the UI at the end of the batch.因此，如果需要访问preState，请使用setState(fn).

总之，是否批量合并提交，取决与是否处于React Event Handler中，这会带来困扰，因此React提供如下方法，显示的批量操作：
```js
promise.then(() => {
  // Forces batching
  ReactDOM.unstable_batchedUpdates(() => {
    this.setState({a: true}); // Doesn't re-render yet
    this.setState({b: true}); // Doesn't re-render yet
    this.props.setParentState(); // Doesn't re-render yet
  });
  // When we exit unstable_batchedUpdates, re-renders once
});
```
未来在React17中，可能将批量异步提交作为默认项，无论是否处于React Event Handler，

unstable代表未来该方法会被移除，不过在小版本中不会，因此在React17之前，可以放心使用。

Even if state is updated synchronously, props are not.

Right now the objects provided by React (state, props, refs) are internally consistent with each other. This means that if you only use those objects, they are guaranteed to refer to a fully reconciled tree (even if it’s an older version of that tree).

# State

1. 只能在构造器`constructor`中初始化`state`

```js
constructor(props) {
    super(props);
    this.state = {date: new Date()};
}
```

2. 修改`state`需调用`setState`方法，直接修`state`并不能导致界面重绘，更新 UI

```js
// Wrong
this.state.comment = "Hello";

// Correct
this.setState({ comment: "Hello" });
```

3. 可以单独更新`state`中某一个状态信息，React 将合并`state`的各个更新

```js
constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
}
componentDidMount() {
    fetchPosts().then(response => {
        this.setState({
            posts: response.posts
        });
    });

    fetchComments().then(response => {
        this.setState({
            comments: response.comments
        });
    });
}
```

4. `state`状态更新是异步的

- React 基于性能考虑，可能将多个`setState`调用合并为一个
- 由于`this.props`和`this.state`的更新可能是异步的，不能依赖它们来进行`state`状态的更新

如下代码可能会执行失败

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment
});
```

可以使用如下写法来修复此问题

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));

// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

然而以下代码仍然存在潜在的问题

```js
// Capturing values from the state outside of the setState callback.
let previousFoo = this.state.foo;
this.setState(function incrementFoo(previousState) {
  // BAD! Setting `foo` based on a potentially outdated
  // view of its current value: `foo` may have been updated
  // in the meantime by another call to `setState`.
  return { ...previousState, foo: previousFoo + 10 };
});
```

可以使用如下方法解决

```js
function incrementFooBy(delta) {
  return (previousState, currentProps) => {
    return { ...previousState, foo: previousState.foo + delta };
  };
}
class MyComponent extends React.Component {
  onClick = () => {
    this.setState(incrementFooBy(42));
  };
  render() {
    return <button onClick={onClick}>click me</button>;
  }
}
```

如下代码可演示`setState`异步行为

```js
import React from "react";
import ReactDOM from "react-dom";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  componentDidMount() {
    // Automatically update the state every 3 seconds.
    setInterval(this.updateState, 3000);
    // Update the state on mouse-down.
    // --
    // NOTE: We are implementing our own event binding here - not using the
    // React Element props to manage the event handler.
    document
      .getElementById("span")
      .addEventListener("mousedown", this.updateState);
  }

  tick() {
    this.setState({
      date: this.state.date + 100000
    });
  }

  updateState = event => {
    console.log("= = = = = = = = = = = =");
    console.log("EVENT:", event ? event.type : "timer");
    console.log("Pre-setState:", this.state.counter);
    this.setState({
      counter: this.state.counter + 1
    });
    console.log("Mid-setState:", this.state.counter);
    this.setState({
      counter: this.state.counter + 1
    });
    console.log("Post-setState:", this.state.counter);
  };
  render() {
    return (
      <div>
        <span id="span" onClick={this.updateState} className="button">
          "Counter at " + {this.state.counter}
        </span>
        <h1>Hello, world!</h1>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
```
