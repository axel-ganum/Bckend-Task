import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask } from './entities/subtask.entity';
import { Task } from './entities/task.entity';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { internalServerException } from 'src/common/exceptions/internal-server.exception';

@Injectable()
export class SubtasksService {
  save(created: any) {
    throw new Error('Method not implemented.');
  }
  create(arg0: { title: any; description: any; task: Task; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Subtask)
    private readonly subtaskRepository: Repository<Subtask>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // ✅ Crear varias subtareas para una tarea
  async createManyForTask(task: Task, subtasks: { title: string; description: string }[]) {
    const created = subtasks.map((s) =>
      this.subtaskRepository.create({
        title: s.title,
        description: s.description,
        task,
      }),
    );

    try {
      return await this.subtaskRepository.save(created);
    } catch (error) {
      throw new internalServerException('Error al guardar subtareas');
    }
  }

  // ✅ Actualizar una subtarea (marcar como completada, cambiar título/desc)
  async update(id: string, updates: Partial<Subtask>) {
    const subtask = await this.subtaskRepository.findOne({ where: { id } });
    if (!subtask) throw new NotFoundException(`Subtask ${id} not found`);

    Object.assign(subtask, updates);
    try {
      return await this.subtaskRepository.save(subtask);
    } catch (error) {
      throw new internalServerException('Error al actualizar subtarea');
    }
  }

  // ✅ Eliminar una subtarea
  async remove(id: string) {
    const subtask = await this.subtaskRepository.findOne({ where: { id } });
    if (!subtask) throw new NotFoundException(`Subtask ${id} not found`);
    try {
      return await this.subtaskRepository.remove(subtask);
    } catch (error) {
      throw new internalServerException('Error al eliminar subtarea');
    }
  }

  // ✅ Obtener todas las subtareas de una tarea
  async findByTask(taskId: string) {
    return this.subtaskRepository.find({
      where: { task: { id: taskId } },
    });
  }
}
