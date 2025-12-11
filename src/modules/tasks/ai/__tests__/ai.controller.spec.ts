import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from '../ai.controller';
import { AiService } from '../ai.service';

describe('AiController', () => {
  let controller: AiController;
  let aiService: AiService;

  const mockAiService = {
    generateText: jest.fn(),
    generateTask: jest.fn(),
    analyzeTasks: jest.fn(),
    generateSubtasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    aiService = module.get<AiService>(AiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('test', () => {
    it('should call generateText with the provided prompt', async () => {
      const testPrompt = 'Test prompt';
      const expectedResult = 'Test response';
      
      mockAiService.generateText.mockResolvedValue(expectedResult);

      const result = await controller.test(testPrompt);

      expect(aiService.generateText).toHaveBeenCalledWith(testPrompt);
      expect(result).toBe(expectedResult);
    });

    it('should use default prompt when none is provided', async () => {
      const defaultPrompt = 'Hello world';
      const expectedResult = 'Default response';
      
      mockAiService.generateText.mockResolvedValue(expectedResult);

      const result = await controller.test('');

      expect(aiService.generateText).toHaveBeenCalledWith(defaultPrompt);
      expect(result).toBe(expectedResult);
    });
  });
});
