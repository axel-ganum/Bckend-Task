import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.HF_API_KEY; // o process.env.DEEPSEEK_API_KEY
  private readonly baseUrl = 'https://router.huggingface.co/v1';
  private readonly model = 'deepseek-ai/DeepSeek-V3.2-Exp:novita';

  /**
   * Genera texto o sugerencias de tareas a partir de un prompt.
   */
  async generateTask(prompt: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const message = response.data.choices[0].message?.content;

      // Intentamos parsear la respuesta como JSON (si la IA devuelve estructura)
      try {
        const parsed = JSON.parse(message);
        return {
          title: parsed.title || prompt,
          description: parsed.description || '',
          tags: parsed.tags || [],
        };
      } catch {
        // Si no es JSON, devolvemos texto plano
        return {
          title: prompt,
          description: message || '',
          tags: [],
        };
      }
    } catch (error) {
      console.error('Error en generateTask:', error.response?.data || error.message);
      throw new Error('Error al comunicarse con el modelo de DeepSeek');
    }
  }
}

