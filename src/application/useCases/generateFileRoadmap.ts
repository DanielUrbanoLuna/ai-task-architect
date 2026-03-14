import { callClaude } from "@/src/infrastructure/aiService";
import type { ProjectPlan } from "./generateProjectPlan";

export interface ProjectFile {
  path: string;
  description: string;
  layer: "presentation" | "application" | "domain" | "infrastructure" | "config";
}

export interface FileRoadmap {
  files: ProjectFile[];
}

export async function generateFileRoadmap(plan: ProjectPlan): Promise<FileRoadmap> {
  const prompt = `Eres un arquitecto de software senior especializado en Next.js y Clean Architecture.

Dado el siguiente plan de proyecto, genera la lista exacta de archivos .ts y .tsx que hay que crear para que la aplicación funcione. Sigue estrictamente la estructura de Clean Architecture con las carpetas: src/domain, src/application, src/infrastructure, src/presentation y app/ (para rutas Next.js).

Plan del proyecto:
- Nombre: ${plan.projectName}
- Fases: ${plan.phases.map((p) => p.name).join(", ")}
- Frontend: ${plan.techStack.frontend.join(", ")}
- Backend: ${plan.techStack.backend.join(", ")}
- Base de datos: ${plan.techStack.database.join(", ")}
- Tareas: ${plan.tasks.map((t) => t.title).join(", ")}

Responde ÚNICAMENTE con un JSON válido con esta estructura, sin texto adicional:

{
  "files": [
    {
      "path": "ruta/exacta/del/archivo.tsx",
      "description": "Qué hace este archivo en una frase",
      "layer": "presentation" | "application" | "domain" | "infrastructure" | "config"
    }
  ]
}

Reglas:
- Genera entre 15 y 25 archivos.
- Los paths deben ser rutas reales dentro del proyecto Next.js (app/, src/domain/, src/application/, src/infrastructure/, src/presentation/).
- Usa .tsx para componentes React y .page.tsx para páginas. Usa .ts para todo lo demás.
- Incluye archivos de tipos, repositorios, casos de uso, componentes, páginas y configuración.
- Sé específico: nada de "utils.ts" genéricos; cada archivo debe tener un propósito claro.`;

  const raw = await callClaude(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("La IA no devolvió un JSON válido.");
  return JSON.parse(jsonMatch[0]) as FileRoadmap;
}
