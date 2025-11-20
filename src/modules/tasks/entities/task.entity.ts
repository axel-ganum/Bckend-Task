import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Subtask } from './subtask.entity';


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
  

  @OneToMany(() => Subtask, subtask => subtask.task, { cascade: true })
  subtasks: Subtask[];
   @CreateDateColumn()
  createdAt: Date;

  // 🔄 Fecha de última actualización automática
  @UpdateDateColumn()
  updatedAt: Date;
}

