import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AiModule } from './ai/ai.module';
import { SubtasksModule } from './subtask.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AiModule,
  SubtasksModule
],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
