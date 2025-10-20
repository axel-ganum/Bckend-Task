import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AiModule } from './ai/ai.module';
import { Subtask } from './entities/subtask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask]), AiModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
