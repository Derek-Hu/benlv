# Hooks
React 16.8.0 开始支持Hooks，可以让开发人员使用Function来编写组件，需要注意的是，使用时需要安装对应版本的React DOM组件。React Hooks是编写React代码的一种方式，如果不喜欢它，可以暂时不用，它是向后兼容的。

## Hooks解决的痛点，为什么采用function而不是Class
### 痛点一：难以在组件之间实现状态管理的复用
在Hooks出现之前，为了复用状态管理逻辑，往往使用以下方法：
* 属性渲染（Render Props）
* 高阶组件（Higher-Order Components）

为了达到复用的目的，需要对组件进行重新组织，同时随着高阶组件的嵌套层级加深，不利于代码的维护，在React DevTools中，会发现“嵌套地狱”，组件被层层providers，consumers，higher-order components，render props等包围着，虽然可以通过React DevTools进行过滤，却可以从中发现：我们需要一种更加简单清晰的方式，来复用状态管理逻辑。

Hooks应运而生，优点是：
* 能实现复用状态管理的可复用
* 能独立进行测试

### 痛点二：随着复杂度升高，组件业务逻辑越来越难以理解
* 相同逻辑分散在多处。如`componentDidMount`和`componentDidUpdate`方法，可能做着同样的事情，即相同代码可能出现2次。
* 不相关逻辑出现在同一方法中。如`componentDidMount`中常常包含初始化逻辑，不同逻辑往往相对独立。
* 相关逻辑分散在不同方法。如`componentDidMount`可能负责相关初始化的工作，而`componentWillUnmount`需进行清理工作。

总之，不能很好的体现功能的完整性，容易引入潜在的问题。

组件业务逻辑复杂性增加，测试难以进行，质量难以保证，这也是许多人为什么会引入第三方状态管理库的原因，然而这些三方库往往引入其他内容进行抽象，开发人员往往在许多文件之间来回切换，组件的复用愈加麻烦。

### 痛点三：Class的使用对于开发人员/工具并不友好

除了代码的重新组织与复用难度较大，Class的存在也是一个障碍。
* 在不同的框架/组件中，`this`代表着什么各不相同，你需要去记忆并理解它，正确的处理`this`的指向。比如在事件绑定上；在Class Properties语法糖出现之前，代码将很繁琐。
* 对于何时使用Function Component与Class Component，不同开发人员常常意见不一，即使是经验丰富的人员。

另外，当使用Class组件时，工具在优化代码上，往往使得最优化路径失效。例如Class组件在代码压缩时不理想，热加载时不稳定等，以及应用于Angular等框架中的AOT Compile，Prepack中的Component Folding技术。

为了解决以上问题，Hooks拥抱Function组件，在Class组件中则不能使用。

## 初识Hooks
```js
import React, { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
其中`useState`则是众多`Hooks`之一，它接收一个参数作为初始化状态数据，返回当前状态以及一个更新状态的函数，如状态`count`和函数`setCount`；

* 初始化数据不要求为Object类型，也可以是普通类型，如`number`， `string`等。初始化数据只会在第一次执行时被用上。
* 更新状态的函数，如`setState`与Class中`this.setState`类似，区别是`setState`并不会对数据进行Merge合并操作。

`useState`可多次调用，在多次渲染时，React会保证相应状态的正确性。

### 什么是Hooks
`Hooks`是指能在`function`，即我们认识的`stateless component`中使用，并能给`function`增加某些特性的函数。例如`React`中内置的`Hooks`，如：

* `useState`解决了`function`组件不能支持`state`管理的问题，否则需要将`function`组件转化为`Class`组件才能支持`state`
* `useEffect`则为`function`组件，添加了类似`Class`组件中的`LifeCycle`生命周期事件

`Hooks`相当于`function`中的钩子，这也是取名为`Hooks`的由来。且每个`Hooks`调用都是独立的，因此我们可以在同一组件中调用同一`Hooks`多次。

当然，我们可以创建自定义的`Hooks`，不过，如前文所述，`useState`中初始化数据只会执行一次，后续的渲染中，初始化数据并不会被用到，这也是为什么它不取名为`createState`，因为`create`并不能准备描述该行为。因此React约定：

* `Hooks`的名称必须以`use`开头，这也是`Hooks`代码检测工具的约定，它能帮助我们发现`Hooks`在使用中的问题。

### 内在原理
Hooks是如何确保维护正确的状态`state`呢？如：
```js
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 2. Use an effect for persisting the form
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```
以上代码将在渲染过程中`useState`被调用多次，`name`与`surname`值可能与初始值不一样，React如何保证在调用`useState`时，正确地还原`name`与`surname`值呢？

答案是：**通过`useState`的调用顺序来保证**

调用顺序如下：
```js
// ------------
// 第一次渲染，执行顺序
// ------------
useState('Mary')           // 1. 初始化变量name为'Mary'
useEffect(persistForm)     // 2. 针对Form，设置Form行为
useState('Poppins')        // 3. 初始化变量surname为'Poppins'
useEffect(updateTitle)     // 4. 针对标题，设置相应行为

// -------------
// 第二次渲染，执行顺序
// -------------
useState('Mary')           // 1. 读取/还原name变量值，并忽略初始化参数
useEffect(persistForm)     // 2. 针对Form，更新Form行为
useState('Poppins')        // 3. 读取/还原surname变量值，并忽略初始化参数
useEffect(updateTitle)     // 4. 针对标题，更新相应行为

// ...
```
因此，只要执行的顺序保持不变，`Hooks`则可以正确地维护状态信息，如果执行顺序发生变化，则可能出现问题。

例如，将代码修改为，`Hooks`的执行依赖相关条件：
```js
function Form() {
  // 1. Use the name state variable
  const [name, setName] = useState('Mary');

  // 🔴 We're breaking the first rule by using a Hook in a condition
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }

  // 3. Use the surname state variable
  const [surname, setSurname] = useState('Poppins');

  // 4. Use an effect for updating the title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```
假设第二次执行当时候，`name`为空，则执行顺序如下：
```js
// ------------
// 第一次渲染，执行顺序
// ------------
useState('Mary')           // 1. 初始化变量name为'Mary'
useEffect(persistForm)     // 2. 针对Form，设置Form行为
useState('Poppins')        // 3. 初始化变量surname为'Poppins'
useEffect(updateTitle)     // 4. 针对标题，设置相应行为

// -------------
// 第二次渲染，执行顺序
// -------------
useState('Mary')           // 1. 读取/还原name变量值，并忽略初始化参数
// useEffect(persistForm)  // 🔴 由于name第二次执行时，name为空，导致此Hooks未执行
useState('Poppins')        // 🔴 2 (but was 3). 读取/还原变量surname失败
useEffect(updateTitle)     // 🔴 3 (but was 4). 执行updateTitle失败

```

因此，在使用`Hooks`时，需要注意以下几点：
* React在多次渲染`function`组件时，`setState`将被多次调用，为了能正确的让React处理`state`，不要将`Hooks`放置在条件函数、循环语句或者内嵌函数中，否则可能出现状态管理的异常，而应将`setState`， `useEffect`等`Hooks`执行放置在最外层。这不仅仅针对`setState`，还包括其他`Hooks`，如`useEffect`等。
* `Hooks`只能在React `function`组件，或者自定义`hooks`中使用，请不要在普通的函数中使用。

为了自定对以上规则进行检测，React提供了[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)插件，只需集成到ESlint规则中即可。

## 内置Hooks
根据不同场景，React内置了许多不同的`Hooks`，当然，我们也可以定制自己的`Hooks`。

### 基础Hooks
1. `useState`
2. `useEffect`
3. `useContext`

### 其他Hooks
1. `useReducer`
2. `useEffect`
3. `useEffect`
4. `useEffect`
5. `useEffect`
6. `useEffect`
7. `useEffect`

## useEffect
`useEffect`在DOM更新后将被执行，相当于`componentDidMount`和`componentDidUpdate`。React在每次渲染时都会执行`useEffect`