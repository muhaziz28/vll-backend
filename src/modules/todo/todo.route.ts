import { Router } from 'express';
import { listTodos, getTodo, createTodo, updateTodo, deleteTodo } from './todo.controller';

export const todoRouter = Router();

todoRouter.get('/', listTodos);
todoRouter.get('/:id', getTodo);
todoRouter.post('/', createTodo);
todoRouter.put('/:id', updateTodo);
todoRouter.delete('/:id', deleteTodo);