"use client";

import { useState } from "react";
import type { ProjectPlan, Task, Phase, TechStack } from "@/src/application/useCases/generateProjectPlan";
import type { FileRoadmap, ProjectFile } from "@/src/application/useCases/generateFileRoadmap";
import {
  FlaskConical,
  Loader2,
  Zap,
  Flag,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Globe,
  Cpu,
  Database,
  Server,
  CheckSquare,
  FileCode,
  Layout,
  Layers,
  FolderOpen,
  ListChecks,
} from "lucide-react";

// ── Config maps ───────────────────────────────────────────────────────────────

const priorityConfig: Record<Task["priority"], { label: string; icon: React.ReactNode }> = {
  alta:  { label: "Alta",  icon: <ArrowUp  className="h-3.5 w-3.5 text-red-400"    /> },
  media: { label: "Media", icon: <Minus    className="h-3.5 w-3.5 text-amber-400"  /> },
  baja:  { label: "Baja",  icon: <ArrowDown className="h-3.5 w-3.5 text-slate-500" /> },
};

const stackConfig: Record<keyof TechStack, { label: string; color: string; icon: React.ReactNode }> = {
  frontend:  { label: "Frontend",  color: "text-blue-400 bg-blue-950/60 border-blue-800/50",       icon: <Globe    className="h-3.5 w-3.5" /> },
  backend:   { label: "Backend",   color: "text-violet-400 bg-violet-950/60 border-violet-800/50", icon: <Cpu      className="h-3.5 w-3.5" /> },
  database:  { label: "Database",  color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/50", icon: <Database className="h-3.5 w-3.5" /> },
  devops:    { label: "DevOps",    color: "text-orange-400 bg-orange-950/60 border-orange-800/50", icon: <Server   className="h-3.5 w-3.5" /> },
};

const layerConfig: Record<ProjectFile["layer"], { label: string; color: string }> = {
  presentation:   { label: "presentation", color: "text-blue-400 bg-blue-950/60" },
  application:    { label: "application",  color: "text-violet-400 bg-violet-950/60" },
  domain:         { label: "domain",       color: "text-emerald-400 bg-emerald-950/60" },
  infrastructure: { label: "infra",        color: "text-orange-400 bg-orange-950/60" },
  config:         { label: "config",       color: "text-slate-400 bg-slate-800/60" },
};

function getFileIcon(path: string) {
  if (path.endsWith(".tsx")) return <Layout   className="h-4 w-4 text-blue-400/70 shrink-0" />;
  if (path.endsWith(".prisma")) return <Database className="h-4 w-4 text-emerald-400/70 shrink-0" />;
  return <FileCode className="h-4 w-4 text-slate-600 shrink-0" />;
}

// ── Shared components ─────────────────────────────────────────────────────────

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
      <span className="text-sm text-slate-400 font-mono">{label}</span>
    </div>
  );
}

function SectionHeader({ label, count, icon }: { label: string; count?: number; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      {icon && <span className="text-slate-500">{icon}</span>}
      <span className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-500">{label}</span>
      {count !== undefined && (
        <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs font-mono text-slate-400">
          {count}
        </span>
      )}
      <div className="flex-1 border-t border-slate-800" />
    </div>
  );
}

function DemoBanner() {
  return (
    <div className="border-b border-amber-900/40 bg-amber-950/20">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-2">
        <FlaskConical className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        <p className="text-xs text-amber-400/90 font-mono">
          Ejecutando en modo demo.{" "}
          <span className="text-amber-500/70">
            Para usar IA real, configura tu{" "}
            <code className="rounded bg-amber-900/50 px-1 py-0.5 text-amber-300">ANTHROPIC_API_KEY</code>.
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Plan sections ─────────────────────────────────────────────────────────────

function PhasesSection({ phases }: { phases: Phase[] }) {
  return (
    <div>
      <SectionHeader label="Fases" count={phases.length} icon={<Flag className="h-3.5 w-3.5" />} />
      <div className="flex flex-col gap-2">
        {phases.map((phase, i) => (
          <div
            key={phase.id}
            className="flex items-start gap-4 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3.5 hover:border-slate-700 transition-colors"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30">
              <span className="font-mono text-xs font-bold text-indigo-400">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-100">{phase.name}</span>
                <span className="flex items-center gap-1 rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs font-mono text-slate-400">
                  <Clock className="h-3 w-3" />
                  {phase.duration}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{phase.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackSection({ techStack }: { techStack: TechStack }) {
  return (
    <div>
      <SectionHeader label="Tech Stack" icon={<Layers className="h-3.5 w-3.5" />} />
      <div className="grid grid-cols-2 gap-2.5">
        {(Object.keys(techStack) as (keyof TechStack)[]).map((key) => {
          const cfg = stackConfig[key];
          return (
            <div
              key={key}
              className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 hover:border-slate-700 transition-colors"
            >
              <div className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold border mb-3 ${cfg.color}`}>
                {cfg.icon}
                {cfg.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack[key].map((tech) => (
                  <span key={tech} className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksSection({ tasks, phases }: { tasks: Task[]; phases: Phase[] }) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? tasks : tasks.filter((t) => t.phase === active);
  const totalHours = tasks.reduce((s, t) => s + t.estimatedHours, 0);

  return (
    <div>
      <SectionHeader label="Tareas" count={tasks.length} icon={<ListChecks className="h-3.5 w-3.5" />} />

      {/* Stats */}
      <div className="flex gap-5 mb-4 font-mono text-xs">
        <span className="flex items-center gap-1.5 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-slate-300">{totalHours}h</span> estimadas
        </span>
        <span className="flex items-center gap-1.5 text-slate-500">
          <ArrowUp className="h-3.5 w-3.5 text-red-400" />
          <span className="text-slate-300">{tasks.filter((t) => t.priority === "alta").length}</span> prioridad alta
        </span>
      </div>

      {/* Phase tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {["all", ...phases.map((p) => p.name)].map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              active === p
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            }`}
          >
            {p === "all" ? "todas" : p}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((task) => {
          const p = priorityConfig[task.priority];
          return (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3.5 hover:border-slate-700 transition-colors group"
            >
              <div className="mt-0.5 shrink-0">{p.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                  {task.title}
                </p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{task.description}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {task.estimatedHours}h
                </span>
                <span className="font-mono text-xs text-slate-600">{task.phase}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FileRoadmapSection({ roadmap }: { roadmap: FileRoadmap }) {
  const [activeLayer, setActiveLayer] = useState<ProjectFile["layer"] | "all">("all");

  const layers = Array.from(new Set(roadmap.files.map((f) => f.layer))) as ProjectFile["layer"][];
  const filtered = activeLayer === "all" ? roadmap.files : roadmap.files.filter((f) => f.layer === activeLayer);

  const grouped = filtered.reduce<Record<string, ProjectFile[]>>((acc, file) => {
    const folder = file.path.split("/").slice(0, 2).join("/");
    (acc[folder] ??= []).push(file);
    return acc;
  }, {});

  return (
    <div>
      <SectionHeader label="Roadmap de archivos" count={roadmap.files.length} icon={<FolderOpen className="h-3.5 w-3.5" />} />

      {/* Layer tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {(["all", ...layers] as const).map((l) => (
          <button
            key={l}
            onClick={() => setActiveLayer(l)}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono transition-colors ${
              activeLayer === l
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            }`}
          >
            {l === "all" ? "todas las capas" : layerConfig[l].label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(grouped).map(([folder, files]) => (
          <div key={folder}>
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="h-3.5 w-3.5 text-slate-600" />
              <p className="font-mono text-xs text-slate-600">{folder}/</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {files.map((file) => {
                const layer = layerConfig[file.layer];
                const filename = file.path.split("/").pop() ?? file.path;
                const dir = file.path.split("/").slice(0, -1).join("/");
                return (
                  <div
                    key={file.path}
                    className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 hover:border-slate-700 transition-colors"
                  >
                    {getFileIcon(file.path)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-mono text-xs text-slate-600">{dir}/</span>
                        <span className="font-mono text-sm font-semibold text-slate-100">{filename}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{file.description}</p>
                    </div>
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-mono ${layer.color}`}>
                      {layer.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [idea, setIdea] = useState("");
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [roadmap, setRoadmap] = useState<FileRoadmap | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [error, setError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  async function handleGeneratePlan() {
    if (!idea.trim()) return;
    setLoadingPlan(true);
    setError("");
    setPlan(null);
    setRoadmap(null);
    setIsDemo(false);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setIsDemo(data.isDemo ?? false);
      setPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleGenerateRoadmap() {
    if (!plan) return;
    setLoadingRoadmap(true);
    setError("");
    setRoadmap(null);

    try {
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error desconocido");
      setRoadmap(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoadingRoadmap(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-mono font-semibold text-slate-100 text-sm">AI Task Architect</span>
          </div>
          <span className="font-mono text-xs text-slate-600">claude-opus-4-6</span>
        </div>
      </header>

      {/* Demo banner */}
      {isDemo && <DemoBanner />}

      <main className="mx-auto max-w-3xl px-4 py-8">

        {/* Input card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Convertidor de ideas en realidad</h1>
          <p className="mt-1 mb-5 text-xs text-slate-500 font-mono">Describe tu proyecto y la IA generará el plan completo</p>

          <label className="mb-2 block font-mono text-xs font-semibold uppercase tracking-widest text-slate-500">
            Idea del proyecto
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 resize-none transition-all"
            rows={4}
            placeholder="Ej: Una marketplace de servicios para freelancers con pagos integrados, chat en tiempo real y sistema de valoraciones…"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleGeneratePlan}
              disabled={loadingPlan || !idea.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-mono text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loadingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loadingPlan ? "Generando…" : "Generar plan"}
            </button>

            {plan && (
              <button
                onClick={handleGenerateRoadmap}
                disabled={loadingRoadmap}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/50 px-5 py-2.5 font-mono text-sm font-semibold text-indigo-400 hover:bg-indigo-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingRoadmap ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCode className="h-4 w-4" />}
                {loadingRoadmap ? "Analizando…" : "Roadmap de archivos"}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 font-mono text-xs text-red-400">
            <span className="shrink-0">✕</span>
            {error}
          </div>
        )}

        {(loadingPlan || loadingRoadmap) && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
            {loadingPlan  && <Spinner label="Arquitecto IA analizando la idea…" />}
            {loadingRoadmap && <Spinner label="Mapeando estructura de archivos…" />}
          </div>
        )}

        {plan && !loadingPlan && (
          <div className="mt-6 flex flex-col gap-4">

            {/* Project header */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/40 px-5 py-5">
              <p className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-600">Proyecto</p>
              <h2 className="font-mono text-2xl font-bold tracking-tight text-slate-100">{plan.projectName}</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3 py-3">
                  <Flag className="h-4 w-4 text-indigo-400 shrink-0" />
                  <div>
                    <p className="font-mono text-xs text-slate-500">Fases</p>
                    <p className="font-mono text-xl font-bold text-slate-100">{plan.phases.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3 py-3">
                  <CheckSquare className="h-4 w-4 text-violet-400 shrink-0" />
                  <div>
                    <p className="font-mono text-xs text-slate-500">Tareas</p>
                    <p className="font-mono text-xl font-bold text-slate-100">{plan.tasks.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3 py-3">
                  <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-mono text-xs text-slate-500">Horas</p>
                    <p className="font-mono text-xl font-bold text-slate-100">
                      {plan.tasks.reduce((s, t) => s + t.estimatedHours, 0)}h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
              <PhasesSection phases={plan.phases} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
              <StackSection techStack={plan.techStack} />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4">
              <TasksSection tasks={plan.tasks} phases={plan.phases} />
            </div>

            {roadmap && !loadingRoadmap && (
              <div className="rounded-2xl border border-indigo-900/40 bg-slate-900/80 px-5 py-4">
                <FileRoadmapSection roadmap={roadmap} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
