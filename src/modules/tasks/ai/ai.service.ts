import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
    private readonly apiKey = process.env.HF_API_KEY;
  private readonly baseUrl = 'https://router.huggingface.co/v1';

  async generateText(prompt: string) {
    const model = 'deepseek-ai/DeepSeek-V3.2-Exp:novita';

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model,
        messages: [
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data.choices[0].message;
} 
}
