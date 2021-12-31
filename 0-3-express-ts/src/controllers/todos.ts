import { TodoBody } from './../types/todo-body';
import { RequestHandler } from 'express';
import { Todo } from '../models/todo';
import { addTodo, fetchTodos, patchTodo, removeTodo } from '../store/todo-store';

export const getTodos: RequestHandler = (req, res, next) => {
  res.json({ todos: fetchTodos() });
};

// NOTE the RequestHandler type will allow TS to correctly infer the req, res and next types
export const createTodo: RequestHandler = (req, res, next) => {
  const todoText = (req.body as TodoBody).text;
  const newTodo = Todo.create(todoText);

  addTodo(newTodo);

  res.status(201).json({ message: 'Created Todo!', createdTodo: newTodo });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const id = req.params.id;

  const result = removeTodo(id);
  if (result === null) {
    res.status(404).json({ message: `Todo with id ${id} was not found!` });

    return;
  }

  res.status(200).json({ message: 'Succesfully deleted Todo!' });
};

export const updateTodo: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  const updatedTodo = req.body;

  const patchedTodo = patchTodo(id, updatedTodo);

  if (patchedTodo === null) {
    res.status(404).json({ message: `Todo with id ${id} was not found!` });

    return;
  }

  res.json({ message: 'Patched Todo!', patchedTodo });
};
