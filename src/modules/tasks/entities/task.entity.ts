import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Subtask } from './subtask.entity';
import { TaskCategory } from '../enum/task-category.enum';


export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}


@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

    @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.LOW,
  })
  priority: TaskPriority;

  @Column({ default: false })
  completed: boolean;

  @Column({
    type: 'enum',
    enum: TaskCategory,
    default: TaskCategory.PERSONAL,
  })
  category: TaskCategory;

  @OneToMany(() => Subtask, subtask => subtask.task, { cascade: true })
  subtasks: Subtask[];

  @CreateDateColumn()
  createdAt: Date;

  // 🔄 Fecha de última actualización automática
  @UpdateDateColumn()
  updatedAt: Date;
}

