import { callClaude } from "@/src/infrastructure/aiService";

export interface Task {
  id: number;
  title: string;
  description: string;
  phase: string;
  priority: "alta" | "media" | "baja";
  estimatedHours: number;
}

export interface Phase {
  id: number;
  name: string;
  description: string;
  duration: string;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
}

export interface ProjectPlan {
  projectName: string;
  phases: Phase[];
  techStack: TechStack;
  tasks: Task[];
}

export async function generateProjectPlan(idea: string): Promise<ProjectPlan> {
  const prompt = `Eres un arquitecto de software senior. Tu trabajo es analizar la idea de una aplicación y devolver un plan de proyecto estructurado.

Idea del proyecto: "${idea}"

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta, sin texto adicional ni bloques de código:

{
  "projectName": "Nombre comercial del proyecto",
  "phases": [
    {
      "id": 1,
      "name": "Nombre de la fase",
      "description": "Qué se construye en esta fase",
      "duration": "X semanas"
    }
  ],
  "techStack": {
    "frontend": ["tecnología 1", "tecnología 2"],
    "backend": ["tecnología 1", "tecnología 2"],
    "database": ["tecnología 1"],
    "devops": ["tecnología 1", "tecnología 2"]
  },
  "tasks": [
    {
      "id": 1,
      "title": "Título de la tarea",
      "description": "Descripción técnica concreta de qué hay que hacer",
      "phase": "Nombre de la fase a la que pertenece",
      "priority": "alta" | "media" | "baja",
      "estimatedHours": 8
    }
  ]
}

Reglas:
- Genera entre 3 y 4 fases de desarrollo lógicas.
- Sugiere un stack tecnológico moderno y adecuado para la escala de la idea.
- Genera entre 8 y 12 tareas distribuidas entre las fases.
- Sé específico en las descripciones técnicas, no genérico.`;

  const raw = await callClaude(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("La IA no devolvió un JSON válido.");
  return JSON.parse(jsonMatch[0]) as ProjectPlan;
}
