import { observable, computed, autorun, trace, getDependencyTree } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

class Todo {
  id = Math.random();
  @observable title;
  @observable finished = false;
  constructor(title) {
    this.title = title;
  }
}

class TodoList {
  @observable todos = [];
  @computed get unfinishedTodoCount() {
    return this.todos.filter(todo => !todo.finished).length;
  }
}

@observer
class TodoListView extends React.Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.todoList.todos.map(todo => (
            <TodoView todo={todo} key={todo.id} />
          ))}
        </ul>
        Tasks left: {this.props.todoList.unfinishedTodoCount}
        {/* <mobxDevtools.default /> */}
      </div>
    );
  }
}

const TodoView = observer(({ todo }) => (
  <li>
    <input type="checkbox" checked={todo.finished} onClick={() => (todo.finished = !todo.finished)} />
    {todo.title}
  </li>
));

const store = new TodoList();

const disposer = autorun(() => {
  console.log('Tasks left: ' + store.unfinishedTodoCount);
  // console.log(message.title);
  trace();
});

let message = observable({ likes: [] });

const tree = autorun(() => {
  console.log(message.likes.length);
});
message.likes.push('Jennifer');

console.log(getDependencyTree(disposer));
console.log(getDependencyTree(tree));

let students = observable({ likes: [] });

autorun(() => {
  console.log('students222', students.likes.join(', '));
  setTimeout(() => console.log('students', students.likes.join(', ')), 3000);
});
students.likes.push('Jennifer');

ReactDOM.render(<TodoListView todoList={store} />, document.getElementById('root'));

store.todos.push(new Todo('Get Coffee'), new Todo('Write simpler code'));
store.todos[0].finished = true;

// For Eval button
window.store = store;
