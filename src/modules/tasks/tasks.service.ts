import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { internalServerException } from 'src/common/exceptions/internal-server.exception';
import { AiService } from './ai/ai.service';
import { Subtask } from './entities/subtask.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Subtask) 
     private readonly subtaskRepository: Repository<Subtask>,
     
    private readonly aiService: AiService
  ) {}

async createWithAi(message: string) {
  // Llamamos a la IA para generar título, descripción y tags
  const aiTask = await this.aiService.generateTask(message);

  const task = this.taskRepository.create({
    title: aiTask.title,
    description: aiTask.description,
    tags: aiTask.tags,
  });

  try {
    return await this.taskRepository.save(task);
  } catch {
    throw new internalServerException('Error al crear tarea con IA');
  }
}


  async findAll() {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw new internalServerException('Error finding tasks');
    }
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
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
  // verificar que result tenga keys correctas
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

    return this.aiService.summarizeTasks(tasks);
  }

async generateSubtasksForTask(id: string) {
  const task = await this.findOne(id);

  const subtasks = await this.aiService.generateSubtasks(task.description);

  if (subtasks.length > 0) {
    const created = subtasks.map((s) =>
      this.subtaskRepository.create({ title: s.title, description: s.description, task }),
    );
    await this.subtaskRepository.save(created);
  }

  // Devolver task con subtasks cargadas
  return this.taskRepository.findOne({
    where: { id },
    relations: ['subtasks'],
  });
}


  
}
