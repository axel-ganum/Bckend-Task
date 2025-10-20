import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Task } from '../modules/tasks/entities/task.entity';
import { Subtask } from 'src/modules/tasks/entities/subtask.entity';




@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true, // hace que process.env esté disponible en toda la app
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
        extra: {
          ssl: { rejectUnauthorized: false },
     },
      entities: [Task,Subtask],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
