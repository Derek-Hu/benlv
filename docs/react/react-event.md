---
title: Handling Event
order: 2
category: React
keyword: React, JavaScript
parentMenu:  
summary:
---

# Handling Event

事件绑定与 HTML 中的绑定区别：

- React 事件绑定使用驼峰式，HTML 中使用小写格式
- React 使用函数指定事件处理，HTML 使用字符串形式

Here, e is a synthetic event. React defines these synthetic events according to the W3C spec, so you don’t need to worry about cross-browser compatibility. See the SyntheticEvent reference guide to learn more.

## SyntheticEvent

React中组件绑定的事件都是SyntheticEvent的实例，对浏览器原生事件进行了包装，对外表现与原生事件有着相同对接口，符合W3C标准，包括stopPropagation() and preventDefault()方法。

如果需要获取原生事件，可以通过属性nativeEvent访问

The SyntheticEvent is pooled. This means that the SyntheticEvent object will be reused and all properties will be nullified after the event callback has been invoked. This is for performance reasons. As such, you cannot access the event in an asynchronous way.

If you want to access the event properties in an asynchronous way, you should call event.persist() on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.

```html
// HTML
<button onclick="activateLasers()">
  Activate Lasers
</button>

// React
<button onClick="{activateLasers}">
  Activate Lasers
</button>
```

- 与 HTML 中事件处理函数不同，React 中不能通过返回`false`来阻止默认行为，必须调用`preventDefault`方法

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

事件处理函数中需要注意`this`的使用，如果未进行 this 的绑定，`this`的值将未`undefined`，可以使用如下方法进行处理

- 构造函数 constructor 中进行绑定

```js
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }
```

- Class 属性定义式，使用箭头函数

```js
class LoggingButton extends React.Component {
  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log("this is:", this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

- 方法调用时使用箭头函数

```js
class LoggingButton extends React.Component {
  handleClick() {
    console.log("this is:", this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return <button onClick={e => this.handleClick(e)}>Click me</button>;
  }
}
```

- 绑定时可以传递参数

```html
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```
