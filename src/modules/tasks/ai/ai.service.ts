import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  generateText(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private readonly apiKey = process.env.HF_API_KEY; // o process.env.DEEPSEEK_API_KEY
  private readonly baseUrl = 'https://router.huggingface.co/v1';
  private readonly model = 'deepseek-ai/DeepSeek-V3.2-Exp:novita';

  /**
   * Genera texto o sugerencias de tareas a partir de un prompt.
   */

async generateTask(message: string) {
  try {
    const prompt = `
Genera una tarea en formato JSON con los siguientes campos:
{
  "title": "Título breve de la tarea",
  "description": "Descripción clara y específica de la tarea",
  "tags": ["etiqueta1", "etiqueta2"]
}
Mensaje del usuario: "${message}"
    `;

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

    let content = response.data.choices[0].message?.content?.trim() || '';

    // Limpiar bloque de código ```json ... ```
    const codeBlockMatch = content.match(/```json([\s\S]*?)```/i);
    if (codeBlockMatch) {
      content = codeBlockMatch[1].trim();
    }

    // Intentamos parsear como JSON
    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || 'Tarea sin título',
        description: parsed.description || '',
        tags: parsed.tags || [],
      };
    } catch {
      // Si no es JSON válido, devolvemos texto simple
      return {
        title: message,
        description: content,
        tags: [],
      };
    }
  } catch (error) {
    console.error('Error en generateTask:', error.response?.data || error.message);
    throw new Error('Error al comunicarse con el modelo de DeepSeek');
  }
}

 async analyzeTasks(tasks: any[], question: string) {
    const prompt = `
El usuario tiene las siguientes tareas:

${JSON.stringify(tasks, null, 2)}

Pregunta del usuario: "${question}"

Analiza las tareas y responde en lenguaje natural, con claridad y utilidad.
`;

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

      return response.data.choices[0].message?.content?.trim();
    } catch (error) {
      console.error('Error en analyzeTasks:', error.response?.data || error.message);
      throw new Error('Error al comunicarse con el modelo de DeepSeek');
    }
  }


 async generateSubtasks(taskDescription: string) {
    const prompt = `
Divide la siguiente tarea en subtareas concretas. 
Devuelve un JSON válido en el siguiente formato:
{
  "subtasks": [
    { "title": "Subtarea 1", "description": "Descripción breve" },
    { "title": "Subtarea 2", "description": "Descripción breve" }
  ]
}

Tarea: "${taskDescription}"
    `;

    const response = await axios.post(
      `${this.baseUrl}/chat/completions`,
      {
        model: 'deepseek-ai/DeepSeek-V3.2-Exp:novita',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    // tratar de parsear el JSON que devuelva la IA
    try {
      let content = response.data?.choices?.[0]?.message?.content || '{}';

       content = content
      .replace(/^```json\s*/i, '') // elimina ```json al principio
      .replace(/^```/, '')         // elimina ``` al principio sin json
      .replace(/```$/, '')         // elimina ``` al final
      .trim();

      const parsed = JSON.parse(content);
      return parsed.subtasks || [];
    } catch (error) {
      console.error('Error parsing subtasks JSON:', error);
      return [];
    }
  }

  async summarizeTasks(tasks: any[]) {
  const prompt = `
Tienes las siguientes tareas:

${JSON.stringify(tasks, null, 2)}

Haz un resumen breve, destacando objetivos principales y tareas urgentes.
Devuelve en lenguaje natural.
  `;

  const response = await axios.post(`${this.baseUrl}/chat/completions`, {
    model: this.model,
    messages: [{ role: 'user', content: prompt }],
  }, {
    headers: { Authorization: `Bearer ${this.apiKey}` },
  });

  return response.data.choices[0].message?.content?.trim();
}

}

