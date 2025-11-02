// src/subtasks/subtasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from './entities/subtask.entity';
import { SubtasksService } from './subtasks.service';
import { SubtasksController } from './subtasks.controller';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subtask, Task])],
  controllers: [SubtasksController],
  providers: [SubtasksService],
  exports: [SubtasksService], // para poder usarlo en TasksModule
})
export class SubtasksModule {}
