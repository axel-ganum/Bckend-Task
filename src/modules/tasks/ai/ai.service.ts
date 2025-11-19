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
Generá una tarea clara y breve basada en los siguientes datos:

Título: ${taskData.title}
${taskData.description ? `Descripción: ${taskData.description}\n` : ''}${taskData.priority ? `Prioridad: ${taskData.priority}\n` : ''}${taskData.dueDate ? `Fecha límite: ${new Date(taskData.dueDate).toLocaleDateString('es-ES')}\n` : ''}

Instrucciones para generar la tarea:
- La descripción debe tener entre 2 y 5 líneas.
- No generes textos largos ni secciones grandes.
- No uses encabezados tipo H1/H2.
- Si corresponde, agregá entre 3 y 7 subtareas simples.
- El contenido final debe ser práctico, conciso y fácil de leer.
- Nada de documentación extensa, pasos kilométricos ni bloques largos.

Formato:
{
  "title": "",
  "description": "",
  "subtasks": []
}
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
    const codeBlockMatch = content.match(/```(?:json)?\n?([\s\S]*?)```/i);
    if (codeBlockMatch) {
      content = codeBlockMatch[1].trim();
    }

    // Intentamos extraer un objeto JSON si existe
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
       return {
  title: parsed.title || taskData.title || 'Tarea sin título',
  description: parsed.description || content,
  priority: parsed.priority || taskData.priority,
  status: 'pending',
  dueDate: parsed.dueDate || taskData.dueDate,
  subtasks: parsed.subtasks || [],
  tags: parsed.tags || []
};

      } catch (e) {
        console.log('No se pudo parsear como JSON, usando texto plano');
      }
    }
const normalizePriority = (p) => {
  if (!p) return 'low';
  p = p.toLowerCase();

  if (['alta', 'high'].includes(p)) return 'high';
  if (['media', 'medium', 'medio'].includes(p)) return 'medium';
  if (['baja', 'low'].includes(p)) return 'low';

  return 'low';
};

    // Si no se pudo extraer JSON, devolvemos el contenido como descripción
   return {
  title: taskData.title || 'Tarea sin título',
  description: content,
  priority: normalizePriority(taskData.priority),
  status: 'pending',
  dueDate: taskData.dueDate,
  subtasks: [],
  tags: []
};

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
Genera subtareas simples, cortas y claras basadas en la siguiente tarea.

REGLAS IMPORTANTES:
- Máximo 8 subtareas.
- Cada subtarea debe tener un título de máximo 3 a 5 palabras.
- NO uses palabras largas ni frases extensas.
- La descripción es opcional. Si existe, debe tener máximo 8 a 12 palabras.
- El formato debe ser EXACTAMENTE un JSON válido.
- NO escribas texto fuera del JSON.
- Si no se puede generar subtareas, devuelve: {"subtasks": []}

Formato esperado:
{
  "subtasks": [
    { "title": "Título corto", "description": "Descripción breve opcional" }
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