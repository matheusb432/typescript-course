import { Todo } from '../types';

import './TodoList.css';

interface TodoListProps {
  items: Todo[];
  onDeleteTodo: (id: string) => void;
}

const TodoList = ({ items: todos, onDeleteTodo }: TodoListProps): JSX.Element => {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button
            style={{ color: 'red', fontWeight: 'bold' }}
            onClick={() => onDeleteTodo(todo.id)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
