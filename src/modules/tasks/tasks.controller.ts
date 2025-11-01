import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {  CreateTaskWithAiDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { AiService } from './ai/ai.service';

@Controller('tasks')
export class TasksController {

  constructor(private readonly tasksService: TasksService,
   private readonly aiService: AiService,
  ) {}

@Post('ai')
createWithAi(@Body() dto: CreateTaskWithAiDto ) {
  return this.tasksService.createWithAi(dto.message);
}

@Post('summarize')
async summarizeTasks() {
  return this.tasksService.summarizeTasks();
}



  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post('analyze')
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
