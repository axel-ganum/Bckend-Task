import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Subtask } from './subtask.entity';

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

