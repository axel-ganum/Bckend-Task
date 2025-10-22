import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {  CreateTaskWithAiDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  aiService: any;
  constructor(private readonly tasksService: TasksService) {}

@Post('ai')
createWithAi(@Body() dto: CreateTaskWithAiDto ) {
  return this.tasksService.createWithAi(dto.message);
}


@Post('summarize')
  async summarizeTasks() {
    try {
      const tasks = await this.tasksService.findAll();

      if (!tasks.length) {
        throw new HttpException(
          'No hay tareas para resumir',
          HttpStatus.BAD_REQUEST,
        );
      }

      const summary = await this.aiService.summarizeTasks(tasks);

      return {
        success: true,
        summary,
      };
    } catch (error) {
      console.error('Error en /tasks/summarize:', error);
      throw new HttpException(
        'Error al generar el resumen con IA',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('analyze')
  async analyzeTaskWithAi(@Body('question') question: string) {
    return this.tasksService.analyzeTaskWithAi(question);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }


  @Post(':id/subtasks')
 async generateSubtasks(@Param('id') id: string) {
  return this.tasksService.generateSubtasksForTask(id);
 }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Task> {
    return this.tasksService.remove(id);
  }
}
