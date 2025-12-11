import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from '../tasks.service';
import { Task } from '../entities/task.entity';
import { AiService } from '../ai/ai.service';
import { SubtasksService } from '../subtasks.service';
import { TaskCategory } from '../enum/task-category.enum';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let aiService: AiService;
  let subtasksService: SubtasksService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAiService = {
    generateTask: jest.fn(),
    analyzeTasks: jest.fn(),
    generateSubtasks: jest.fn(),
  };

  const mockSubtasksService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
        {
          provide: SubtasksService,
          useValue: mockSubtasksService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    aiService = module.get<AiService>(AiService);
    subtasksService = module.get<SubtasksService>(SubtasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createWithAi', () => {
    it('should create a task with AI-generated content', async () => {
      const aiResponse = {
        title: 'AI Generated Task',
        description: 'This is a test description',
        tags: ['test', 'ai'],
        priority: 'high',
        category: TaskCategory.PERSONAL,
      };

      const savedTask = {
        id: '1',
        ...aiResponse,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAiService.generateTask.mockResolvedValue(aiResponse);
      mockTaskRepository.create.mockReturnValue(savedTask);
      mockTaskRepository.save.mockResolvedValue(savedTask);

      const result = await service.createWithAi('Create a test task');

      expect(aiService.generateTask).toHaveBeenCalledWith('Create a test task');
      expect(taskRepository.create).toHaveBeenCalledWith({
        title: aiResponse.title,
        description: aiResponse.description,
        tags: aiResponse.tags,
        priority: aiResponse.priority,
        category: aiResponse.category,
      });
      expect(taskRepository.save).toHaveBeenCalledWith(savedTask);
      expect(result).toEqual(savedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks when no filter is provided', async () => {
      const tasks = [
        { id: '1', title: 'Task 1', completed: false },
        { id: '2', title: 'Task 2', completed: true },
      ];
      
      mockTaskRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(taskRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['subtasks'],
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(tasks);
    });

    it('should return only completed tasks when filter is "completed"', async () => {
      const completedTasks = [
        { id: '2', title: 'Completed Task', completed: true },
      ];
      
      mockTaskRepository.find.mockResolvedValue(completedTasks);

      const result = await service.findAll('completed');

      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { completed: true },
        relations: ['subtasks'],
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(completedTasks);
    });

    it('should return only pending tasks when filter is "pending"', async () => {
      const pendingTasks = [
        { id: '1', title: 'Pending Task', completed: false },
      ];
      
      mockTaskRepository.find.mockResolvedValue(pendingTasks);

      const result = await service.findAll('pending');

      expect(taskRepository.find).toHaveBeenCalledWith({
        where: { completed: false },
        relations: ['subtasks'],
        order: { createdAt: 'DESC' }
      });
      expect(result).toEqual(pendingTasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      };

      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await service.findOne('1');

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['subtasks']
      });
      expect(result).toEqual(task);
    });
  });
});
