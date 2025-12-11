import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../tasks.controller';
import { TasksService } from '../tasks.service';
import { AiService } from '../ai/ai.service';
import { Task } from '../entities/task.entity';
import { CreateTaskWithAiDto } from '../dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;
  let aiService: AiService;

  const mockTasksService = {
    createWithAi: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    generateSubtasksForTask: jest.fn(),
    analyzeTaskWithAi: jest.fn(),
    summarizeTasks: jest.fn(),
  };

  const mockAiService = {
    generateTask: jest.fn(),
    analyzeTasks: jest.fn(),
    generateSubtasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
    aiService = module.get<AiService>(AiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createWithAi', () => {
    it('should create a task with AI', async () => {
      const createTaskDto: CreateTaskWithAiDto = {
        message: 'Create a test task',
      };

      const result = { id: '1', title: 'AI Generated Task' };
      mockTasksService.createWithAi.mockResolvedValue(result);

      expect(await controller.createWithAi(createTaskDto)).toBe(result);
      expect(tasksService.createWithAi).toHaveBeenCalledWith(createTaskDto.message);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        { id: '1', title: 'Test Task 1' },
        { id: '2', title: 'Test Task 2' },
      ];
      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll('');
      expect(result).toBe(tasks);
      expect(tasksService.findAll).toHaveBeenCalledWith('');
    });

    it('should filter tasks when filter is provided', async () => {
      const filteredTasks = [{ id: '1', title: 'Completed Task', completed: true }];
      mockTasksService.findAll.mockResolvedValue(filteredTasks);

      const result = await controller.findAll('completed');
      expect(result).toBe(filteredTasks);
      expect(tasksService.findAll).toHaveBeenCalledWith('completed');
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const task = { id: '1', title: 'Test Task' };
      mockTasksService.findOne.mockResolvedValue(task);

      expect(await controller.findOne('1')).toBe(task);
      expect(tasksService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('generateSubtasks', () => {
    it('should generate subtasks for a task', async () => {
      const subtasks = [
        { id: '1', title: 'Subtask 1' },
        { id: '2', title: 'Subtask 2' },
      ];
      mockTasksService.generateSubtasksForTask.mockResolvedValue(subtasks);

      expect(await controller.generateSubtasks('1')).toBe(subtasks);
      expect(tasksService.generateSubtasksForTask).toHaveBeenCalledWith('1');
    });
  });

  describe('analyzeTaskWithAi', () => {
    it('should analyze tasks with AI', async () => {
      const analysis = {
        insights: 'Test insights',
        suggestions: 'Test suggestions',
      };
      mockTasksService.analyzeTaskWithAi.mockResolvedValue(analysis);

      expect(await controller.analyzeTaskWithAi('What should I work on?')).toBe(analysis);
      expect(tasksService.analyzeTaskWithAi).toHaveBeenCalledWith('What should I work on?');
    });
  });
});
