import { useState } from 'react';

import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { Todo } from './types';

const App = (): JSX.Element => {
  // NOTE the type should be specified in useState<T> and then TS will correctly infer the values' types
  const [todos, setTodos] = useState<Todo[]>([
    Todo.create('Finish the course!!'),
    Todo.create('Maybe learn Vue next?'),
  ]);

  const addTodo = (text: string): void => {
    setTodos((prevTodos) => [...prevTodos, Todo.create(text)]);

    // NOTE also valid
    // setTodos([...todos, Todo.create(text)]);
  };

  const deleteTodo = (id: string): void => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <NewTodo onAddTodo={addTodo} />
      <TodoList items={todos} onDeleteTodo={deleteTodo} />
    </div>
  );
};

export default App;
