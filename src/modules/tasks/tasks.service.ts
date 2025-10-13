import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { internalServerException } from 'src/common/exceptions/internal-server.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

 async create(dto: CreateTaskDto) {
    try {
      const task = this.taskRepository.create(dto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new internalServerException('Error creating task');
    }
  }

  async findAll() {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw new internalServerException('Error finding tasks');
    }
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, dto);
   try {
    return await this.taskRepository.save(task);
  } catch (error) {
    throw new internalServerException('Error updating task');
}
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    try {
    return await this.taskRepository.remove(task);
  } catch (error) {
    throw new internalServerException('Error removing task');
  }
  }
}
