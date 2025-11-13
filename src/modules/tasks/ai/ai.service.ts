import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Task } from '../entities/task.entity';

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
    // Parsear el mensaje como JSON
    let taskData;
    try {
      taskData = JSON.parse(message);
    } catch (e) {
      // Si no es un JSON válido, manejarlo como texto plano
      taskData = { title: message };
    }

    const prompt = `
Genera una tarea detallada con la siguiente información:

Título: ${taskData.title}
${taskData.description ? `Descripción: ${taskData.description}\n` : ''}${taskData.priority ? `Prioridad: ${taskData.priority}\n` : ''}${taskData.dueDate ? `Fecha límite: ${new Date(taskData.dueDate).toLocaleDateString('es-ES', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}\n` : ''}

Por favor, genera una tarea bien estructurada, detallada y completa basada en la información proporcionada. 
Asegúrate de que la descripción sea clara y completa, sin cortes. 
Si es necesario, incluye subtareas o pasos para completar la tarea principal.`;

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

Responde en JSON con la siguiente estructura:
{
  "insights": "Un análisis claro y útil",
  "suggestions": "Sugerencias para mejorar"
}
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

    const content = response.data.choices[0].message?.content?.trim();

    // intentar parsear como JSON
    try {
      return JSON.parse(content);
    } catch {
      return {
        insights: content || 'No hay insights',
        suggestions: content || 'No hay sugerencias',
      };
    }

  } catch (error) {
    console.error('Error en analyzeTasks:', error.response?.data || error.message);
    throw new Error('Error al comunicarse con el modelo de DeepSeek');
  }
}


async generateSubtasks(taskDescription: string) {
  const prompt = `
Divide la siguiente tarea en subtareas claras (máximo 8). 
Cada subtarea debe tener un título y una breve descripción.

⚠️ IMPORTANTE:
- Devuelve SOLO un JSON válido.
- NO escribas texto fuera del JSON.
- Si no puedes seguir el formato, devuelve un JSON vacío: {"subtasks": []}

Formato esperado:
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
      temperature: 0.5,
      max_tokens: 400,
      stop: ['\n\n'], // corta antes de texto adicional
    },
    {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    },
  );

  try {
    let content = response.data?.choices?.[0]?.message?.content || '{}';

    // Log temporal (te lo muestro en consola para debug)
    console.log('🧠 RAW AI RESPONSE:', content);

    content = content
      .replace(/```json\s*/gi, '')
      .replace(/```/g, '')
      .trim();

    const match = content.match(/\{[\s\S]*\}/);
    const cleanJson = match ? match[0] : '{}';
    const parsed = JSON.parse(cleanJson);

    return parsed.subtasks?.slice(0, 8) || [];
  } catch (error) {
    console.error('Error parsing subtasks JSON:', error);
    return [];
  }
}


 async summarizeTasks(tasks: any[]) {
  const prompt = `
Resumí claramente las siguientes tareas en formato conciso:

${JSON.stringify(tasks, null, 2)}

Indicá los principales objetivos, estado y próximas acciones.
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

    const content = response.data.choices?.[0]?.message?.content?.trim();

    try {
      const parsed = JSON.parse(content);
      return parsed.summary ? parsed : { summary: content };
    } catch {
      return { summary: content || 'No se pudo generar un resumen.' };
    }
  } catch (error) {
    console.error('Error en summarizeTasks:', error.response?.data || error.message);
    throw new Error('Error al comunicarse con la IA para resumir tareas');
  }
} 
}