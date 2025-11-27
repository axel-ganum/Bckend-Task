import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { internalServerException } from 'src/common/exceptions/internal-server.exception';
import { AiService } from './ai/ai.service';
import { SubtasksService } from './subtasks.service';
import { TaskCategory } from './enum/task-category.enum';

@Injectable()
export class TasksService {
  subtaskRepository: any;
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
     private readonly subtasksService: SubtasksService,
     private readonly aiService: AiService
  ) {}

async createWithAi(message: string) {
  // Llamamos a la IA para generar título, descripción y tags
  const aiTask = await this.aiService.generateTask(message);

  const task = this.taskRepository.create({
    title: aiTask.title,
    description: aiTask.description,
    tags: aiTask.tags,
    priority: aiTask.priority ?? 'low',
    category: aiTask.category ?? TaskCategory.PERSONAL,
  });

  try {
    return await this.taskRepository.save(task);
  } catch {
    throw new internalServerException('Error al crear tarea con IA');
  }
}

async findAll(filter?: string) {
  try {
    let where = {};

    if (filter === 'completed') {
      where = { completed: true };
    }

    if (filter === 'pending') {
      where = { completed: false };
    }

    return await this.taskRepository.find({
      where,
      relations: ['subtasks'],
      order: { createdAt: 'DESC' as const },
    });
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw new Error('No se pudieron obtener las tareas');
  }
}


  // TasksService
async findOne(id: string) {
  const task = await this.taskRepository.findOne({
    where: { id },
    relations: ['subtasks'], // << esto es clave
  });
  if (!task) throw new NotFoundException(`Task ${id} not found`);
  return task;
}




  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, dto);
   try {
    return await this.taskRepository.save(task);
  } catch (error) {
    throw new internalServerException('Error updating task');
}
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    try {
    return await this.taskRepository.remove(task);
  } catch (error) {
    throw new internalServerException('Error removing task');
  }
  }

async analyzeTaskWithAi(question: string) {
  const tasks = await this.taskRepository.find();
  const result = await this.aiService.analyzeTasks(tasks, question);

  return {
    insights: result.insights || 'No hay insights',
    suggestions: result.suggestions || 'No hay sugerencias',
  };
}


async summarizeTasks() {
  const tasks = await this.findAll();

  if (!tasks.length) {
    throw new BadRequestException('No hay tareas para resumir');
  }

  try {
    const summary = await this.aiService.summarizeTasks(tasks);
    return summary;
  } catch (error) {
    console.error('Error al resumir tareas:', error.message);
    throw new internalServerException('No se pudo generar el resumen de tareas');
  }
}



async generateSubtasksForTask(id: string) {
  const task = await this.findOne(id);
  const subtasks = await this.aiService.generateSubtasks(task.description);

  if (!subtasks || subtasks.length === 0) {
    return { message: 'La IA no generó subtareas', task };
  }

  // Limpiar y eliminar duplicados
  const uniqueSubtasks = subtasks
    .map((s) => ({
      title: s.title.trim(),
      description: s.description?.trim() || '',
    }))
    .filter(
      (s, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.title.toLowerCase() === s.title.toLowerCase() ||
            t.title.toLowerCase().includes(s.title.toLowerCase()) ||
            s.title.toLowerCase().includes(t.title.toLowerCase()),
        ),
    )
    .slice(0, 8);

  // Guardar todas las subtareas usando SubtasksService
  await this.subtasksService.createManyForTask(task, uniqueSubtasks);

  // Devolver tarea con subtareas actualizadas
  return this.taskRepository.findOne({
    where: { id },
    relations: ['subtasks'],
  });
}



  

  
}
