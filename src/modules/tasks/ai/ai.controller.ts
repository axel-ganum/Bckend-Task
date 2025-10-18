import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('test')
  async test(@Query('prompt') prompt: string) {
    return this.aiService.generateText(prompt || 'Hello world');
  }


    @Post('create-with-ai')
  async createWithAi(@Body('message') message: string) {
    return this.aiService.generateTask(message);
  }

}
