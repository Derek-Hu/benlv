# Hooks
React 16.8.0 开始支持Hooks，可以让开发人员使用Function来编写组件，需要注意的是，使用时需要安装相应的React DOM组件。React Hooks是编写React代码的一种方式，如果不喜欢它，可以暂时不用，它是向后兼容的。

## Hooks出现解决的问题
在Hooks出现之前，为了复用组件的特性，需要对组件进行重构，并使用高阶组件来实现，随着高阶组件的嵌套层级加深，不利于代码的维护，因此需要一种更加简单清晰的方式，Hooks应运而生，它能更加便利的复用组件特性，且更能独立进行测试。

另外，React生命周期函数的使用，导致某些逻辑分散在多个生命周期函数中，如`componentDidMount`和`componentDidUpdate`方法可能做着同样的事情，即逻辑代码可能出现2次；`componentDidMount`可能负责相关初始化的工作，`componentWillUnmount`可能进行清理工作。从而不能很好的体现功能的完整性，容易引入潜在的问题。

组件的状态管理与生命周期紧密联系，状态管理不易抽离与独立，这也是许多开发人员引入第三方的状态管理库的原因，而第三方库的引入，也让代码变得更加复杂。

## Hooks为什么采用function而不是Class
经过实践发现，使用`class`时，需要理解`this`是如何工作的，在绑定事件时，需正确的处理`this`的指向；对于何时使用`function`和`class`，不同人的理解各不一样。

与`class`相比，使用`function`可以对代码进行更好的优化，如代码压缩、预编译技术（`Ahead-of-time-compilation`）、[`Component Folding`](https://github.com/facebook/react/issues/7323)等，因此，Hooks拥抱`function`。

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
其中`useState`则是众多`Hooks`之一，它接收一个参数作为初始化状态数据，返回状态和一个更新状态的函数，如状态`count`和函数`setCount`；`useState`可多次调用，在多次渲染时，它仍会正确的保持相应的状态。

`Hooks`只能在`function`中使用，为了解决`function`组件中不能实现`state`管理和`lifecycle`生命周期管理而出现，相当于`function`中`state`和`lifecycle`的钩子，这也是取名为`Hooks`的由来。

## 内在原理
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