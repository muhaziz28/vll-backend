import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { z } from 'zod';
import { todoService } from './todo.service';
import { TodoCreateSchema, TodoUpdateSchema } from './todo.types';

export async function listTodos(_req: Request, res: Response) {
  const items = await todoService.list();
  res.json({ items });
}

export async function getTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (!id) return next(createError(400, 'id is required'));
  const item = await todoService.getById(id);
  if (!item) return next(createError(404, 'Todo not found'));
  res.json(item);
}

export async function createTodo(req: Request, res: Response, next: NextFunction) {
  const parse = TodoCreateSchema.safeParse(req.body);
  if (!parse.success) return next(createError(400, parse.error.message));
  const created = await todoService.create(parse.data);
  res.status(201).json(created);
}

export async function updateTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (!id) return next(createError(400, 'id is required'));
  const parse = TodoUpdateSchema.safeParse(req.body);
  if (!parse.success) return next(createError(400, parse.error.message));
  try {
    const updated = await todoService.update(id, parse.data);
    res.json(updated);
  } catch (e) {
    return next(createError(404, 'Todo not found'));
  }
}

export async function deleteTodo(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  if (!id) return next(createError(400, 'id is required'));
  try {
    await todoService.remove(id);
    res.status(204).send();
  } catch (e) {
    return next(createError(404, 'Todo not found'));
  }
}