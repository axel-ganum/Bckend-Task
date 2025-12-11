import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../ai.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
    process.env.HF_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTask', () => {
    it('should generate a task with valid input', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Test Task',
                  description: 'Test Description',
                  subtasks: ['Subtask 1', 'Subtask 2'],
                }),
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.generateTask('Test Task');

      expect(result).toHaveProperty('title', 'Test Task');
      expect(result).toHaveProperty('description', expect.any(String));
      expect(result).toHaveProperty('status', 'pending');
    });

    it('should handle JSON input', async () => {
      const jsonInput = JSON.stringify({
        title: 'JSON Task',
        description: 'From JSON',
        priority: 'high',
      });

      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'JSON Task',
                  description: 'From JSON',
                  subtasks: [],
                }),
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.generateTask(jsonInput);
      expect(result.title).toBe('JSON Task');
      expect(result.priority).toBe('high');
    });

    it('should handle API errors', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'));

      await expect(service.generateTask('Test')).rejects.toThrow(
        'Error al comunicarse con el modelo de DeepSeek',
      );
    });
  });

  describe('analyzeTasks', () => {
    it('should analyze tasks and return insights', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: JSON.stringify({
                  insights: 'Test insights',
                  suggestions: 'Test suggestions',
                }),
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await service.analyzeTasks([], 'Test question');
      expect(result).toEqual({
        insights: 'Test insights',
        suggestions: 'Test suggestions',
      });
    });
  });

  describe('generateSubtasks', () => {
    it('should generate subtasks for a task', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              subtasks: [
                { title: 'Subtask 1' },
                { title: 'Subtask 2' }
              ]
            })
          }
        }]
      };

      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.generateSubtasks('Test task');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('title', 'Subtask 1');
      expect(result[1]).toHaveProperty('title', 'Subtask 2');
    });
  });
});
