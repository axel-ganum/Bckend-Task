import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.modules';
import { TasksModule } from './modules/tasks/tasks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './modules/tasks/ai/ai.module';

@Module({
  imports: [DatabaseModule, TasksModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
