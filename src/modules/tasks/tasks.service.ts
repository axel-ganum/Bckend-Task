import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
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
  } catch (error) {
    throw new InternalServerErrorException('Error al crear tarea con IA', error.message);
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
    const updateTaskDto = { ...task };
    const result = await this.taskRepository.update(id, updateTaskDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
    return this.taskRepository.findOne({ where: { id } });
  } catch (error) {
    throw new InternalServerErrorException('Error al actualizar la tarea', error.message);
}
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    try {
    await this.taskRepository.delete(id);
    return { message: 'Tarea eliminada correctamente' };
  } catch (error) {
    throw new InternalServerErrorException('Error al eliminar la tarea', error.message);
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
    throw new InternalServerErrorException('No se pudo generar el resumen de tareas', error.message);
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
