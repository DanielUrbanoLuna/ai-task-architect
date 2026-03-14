# AI Task Architect

**Convierte cualquier idea de software en un plan de proyecto profesional en segundos.**
Describe tu app en lenguaje natural y la IA generará fases de desarrollo, stack tecnológico, tareas priorizadas con estimaciones de horas y un roadmap completo de arquitectura de archivos siguiendo Clean Architecture.

---

## Aviso importante: API Keys

> Este proyecto utiliza la **API de Claude (Anthropic)** para generar los planes mediante inteligencia artificial.
>
> Debido a los costes asociados al uso de modelos de lenguaje de pago, **no es posible incluir una API Key activa en el repositorio ni en la versión en vivo**. Cada consulta tiene un coste real por tokens consumidos.
>
> **Para ejecutar la aplicación con IA real necesitarás:**
> 1. Crear una cuenta en [console.anthropic.com](https://console.anthropic.com)
> 2. Generar una API Key personal con saldo disponible
> 3. Añadirla en un archivo `.env.local` en la raíz del proyecto:
>
> ```env
> ANTHROPIC_API_KEY=sk-ant-...
> ```
>
> **Sin API Key la app funciona igualmente en Modo Demo**, cargando un plan de proyecto de ejemplo real para que puedas evaluar la interfaz y las funcionalidades completas.

---

## Demo en vivo

La versión desplegada funciona en **Modo Demo** sin necesidad de ninguna configuración.

---

## Funcionalidades

- **Generador de plan de proyecto** — fases, duración estimada, stack tecnológico y tareas con prioridad y horas
- **Roadmap de archivos** — estructura de código completa organizada por capas de Clean Architecture
- **Modo Demo** — plan de ejemplo precargado cuando no hay API Key, con aviso visual claro
- **Filtros interactivos** — filtra tareas por fase y archivos por capa arquitectónica
- **Diseño profesional** — interfaz dark mode construida con Tailwind CSS y lucide-react

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Iconos | lucide-react |
| IA | Claude Opus (Anthropic SDK) |
| Arquitectura | Clean Architecture |

---

## Arquitectura

El proyecto sigue **Clean Architecture** con separación estricta de responsabilidades:

```
src/
├── domain/          # Entidades e interfaces (sin dependencias externas)
├── application/     # Casos de uso y lógica de negocio
│   ├── useCases/    # generateProjectPlan, generateFileRoadmap
│   └── demo/        # Datos de ejemplo para Modo Demo
├── infrastructure/  # Implementaciones concretas (Anthropic SDK)
└── presentation/    # Componentes de UI
app/
├── api/             # Rutas del servidor (Next.js Route Handlers)
└── page.tsx         # Página principal
```

El flujo de dependencias es siempre hacia adentro: `presentation → application → domain`. La capa de infraestructura implementa las interfaces definidas en dominio.

---

## Instalación local

```bash
# 1. Clona el repositorio
git clone https://github.com/DanielUrbanoLuna/ai-task-architect.git
cd ai-task-architect

# 2. Instala dependencias
npm install

# 3. Configura tu API Key (opcional — sin ella se activa el Modo Demo)
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# 4. Arranca el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Autor

**Daniel Urbano Luna**
[github.com/DanielUrbanoLuna](https://github.com/DanielUrbanoLuna)
