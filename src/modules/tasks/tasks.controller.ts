import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {  CreateTaskWithAiDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

@Post('ai')
createWithAi(@Body() dto: CreateTaskWithAiDto ) {
  return this.tasksService.createWithAi(dto.message);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Task> {
    return this.tasksService.remove(id);
  }
}
