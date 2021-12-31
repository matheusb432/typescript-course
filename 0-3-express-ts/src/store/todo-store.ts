// NOTE custom 'store' to make on-memory CRUD operations a bit more simple

import { Todo } from '../models/todo';

let todos: Todo[] = [];

const fetchTodos = () => [...todos];

function addTodo(todo: Todo): void {
  todos = [...todos, todo];
}

function removeTodo(id: string): null | undefined {
  if (todos.length === 0) return null;

  const filteredList = todos.filter((t) => t.id !== id);

  if (filteredList.length === todos.length) return null;

  todos = todos.filter((t) => t.id !== id);
}

function patchTodo(id: string, todo: Todo): Todo | null {
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) return null;

  const updatedTodos = [...todos];
  updatedTodos[todoIndex] = { ...todos[todoIndex], ...todo };

  todos = updatedTodos;

  return { ...todos[todoIndex] };
}

export { fetchTodos, addTodo, removeTodo, patchTodo };
