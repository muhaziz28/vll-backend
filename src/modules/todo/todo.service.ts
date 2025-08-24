import { prisma } from '@app/lib/prisma';
import { TodoCreateInput, TodoUpdateInput } from './todo.types';

class TodoService {
  async list() {
    return prisma.todo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    return prisma.todo.findUnique({ where: { id } });
  }

  async create(input: TodoCreateInput) {
    return prisma.todo.create({ data: input });
  }

  async update(id: string, input: TodoUpdateInput) {
    return prisma.todo.update({ where: { id }, data: input });
  }

  async remove(id: string) {
    return prisma.todo.delete({ where: { id } });
  }
}

export const todoService = new TodoService();