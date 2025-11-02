import { Controller, Patch, Delete, Param, Body, Get } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { Subtask } from './entities/subtask.entity';

@Controller('subtasks')
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Get('task/:taskId')
  async getByTask(@Param('taskId') taskId: string) {
    return this.subtasksService.findByTask(taskId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updates: Partial<Subtask>) {
    return this.subtasksService.update(id, updates);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.subtasksService.remove(id);
  }
}
