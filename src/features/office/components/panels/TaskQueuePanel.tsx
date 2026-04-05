"use client";

import { useState, useCallback } from "react";
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Trash2,
  X,
} from "lucide-react";
import { t } from "@/lib/i18n";

/* ---------- types ---------- */

type TaskStatus = "pending" | "in_progress" | "completed";
type TaskPriority = "low" | "normal" | "high" | "urgent";

type TaskItem = {
  id: string;
  title: string;
  description: string;
  fromAgent: string;
  toAgent: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
};

/* ---------- constants ---------- */

const AGENTS = ["Asena", "Umay", "Kayra", "Erlik", "Tulpar", "Tengri"];

const STORAGE_KEY = "task-queue-items";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "#60a5fa",
  normal: "#fbbf24",
  high: "#f97316",
  urgent: "#ef4444",
};

const STATUS_LABEL_KEYS: Record<TaskStatus, Parameters<typeof t>[0]> = {
  pending: "taskQueue.pending",
  in_progress: "taskQueue.inProgress",
  completed: "taskQueue.completed",
};

const PRIORITY_LABEL_KEYS: Record<TaskPriority, Parameters<typeof t>[0]> = {
  low: "taskQueue.low",
  normal: "taskQueue.normal",
  high: "taskQueue.high",
  urgent: "taskQueue.urgent",
};

const STATUS_FILTERS: Array<"all" | TaskStatus> = [
  "all",
  "pending",
  "in_progress",
  "completed",
];

/* ---------- helpers ---------- */

const readTasks = (): TaskItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TaskItem[]) : [];
  } catch {
    return [];
  }
};

const writeTasks = (items: TaskItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — silently ignore */
  }
};

const formatTimestamp = (ts: number) => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/* ---------- sub-components ---------- */

function AgentAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-6 w-6 text-[9px]" : "h-7 w-7 text-[10px]";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/15 font-mono font-semibold tracking-wider text-amber-200 ${dim}`}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: PRIORITY_COLORS[priority] }}
      title={t(PRIORITY_LABEL_KEYS[priority])}
    />
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const base =
    "rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]";
  const variant =
    status === "pending"
      ? "border border-neutral-600 bg-neutral-800 text-neutral-300"
      : status === "in_progress"
        ? "border border-amber-500/30 bg-amber-500/15 text-amber-200"
        : "border border-emerald-500/30 bg-emerald-500/15 text-emerald-200";
  return <span className={`${base} ${variant}`}>{t(STATUS_LABEL_KEYS[status])}</span>;
}

/* ---------- main component ---------- */

export function TaskQueuePanel() {
  const [tasks, setTasks] = useState<TaskItem[]>(readTasks);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [showForm, setShowForm] = useState(false);

  /* form state */
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formFrom, setFormFrom] = useState(AGENTS[0]);
  const [formTo, setFormTo] = useState(AGENTS[1]);
  const [formPriority, setFormPriority] = useState<TaskPriority>("normal");

  /* persist whenever tasks change (skip initial empty render) */
  const persist = useCallback((next: TaskItem[]) => {
    setTasks(next);
    writeTasks(next);
  }, []);

  /* ---- actions ---- */

  const addTask = () => {
    if (!formTitle.trim()) return;
    const newTask: TaskItem = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title: formTitle.trim(),
      description: formDesc.trim(),
      fromAgent: formFrom,
      toAgent: formTo,
      status: "pending",
      priority: formPriority,
      createdAt: Date.now(),
    };
    persist([newTask, ...tasks]);
    setFormTitle("");
    setFormDesc("");
    setFormPriority("normal");
    setShowForm(false);
  };

  const cycleStatus = (id: string) => {
    const order: TaskStatus[] = ["pending", "in_progress", "completed"];
    persist(
      tasks.map((task) => {
        if (task.id !== id) return task;
        const idx = order.indexOf(task.status);
        return { ...task, status: order[(idx + 1) % order.length] };
      }),
    );
  };

  const removeTask = (id: string) => {
    persist(tasks.filter((task) => task.id !== id));
  };

  /* ---- derived ---- */

  const filtered =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const counts: Record<"all" | TaskStatus, number> = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  /* ---- filter label map ---- */
  const filterLabel: Record<"all" | TaskStatus, Parameters<typeof t>[0]> = {
    all: "taskQueue.all",
    pending: "taskQueue.pending",
    in_progress: "taskQueue.inProgress",
    completed: "taskQueue.completed",
  };

  /* ---- render ---- */

  return (
    <section className="flex h-full min-h-0 flex-col">
      {/* header */}
      <div className="border-b border-amber-500/15 px-4 py-3">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
            {t("taskQueue.title")}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-1 rounded border border-amber-500/25 bg-amber-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200 transition-colors hover:border-amber-400/45 hover:text-amber-100"
          >
            {showForm ? (
              <X className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
            {t("taskQueue.addTask")}
          </button>
        </div>
      </div>

      {/* add form */}
      {showForm ? (
        <div className="space-y-2 border-b border-amber-500/10 bg-neutral-900/80 px-4 py-3">
          <input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={t("taskQueue.titlePlaceholder")}
            className="w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 font-mono text-[11px] text-white/90 outline-none placeholder:text-white/30 focus:border-amber-500/40"
          />
          <textarea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder={t("taskQueue.descPlaceholder")}
            rows={2}
            className="w-full resize-none rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 font-mono text-[11px] text-white/90 outline-none placeholder:text-white/30 focus:border-amber-500/40"
          />
          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                {t("taskQueue.from")}
              </span>
              <select
                value={formFrom}
                onChange={(e) => setFormFrom(e.target.value)}
                className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 font-mono text-[10px] text-white/80 outline-none"
              >
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                {t("taskQueue.to")}
              </span>
              <select
                value={formTo}
                onChange={(e) => setFormTo(e.target.value)}
                className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 font-mono text-[10px] text-white/80 outline-none"
              >
                {AGENTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                {t("taskQueue.priority")}
              </span>
              <select
                value={formPriority}
                onChange={(e) =>
                  setFormPriority(e.target.value as TaskPriority)
                }
                className="rounded border border-neutral-700 bg-neutral-800 px-1.5 py-1 font-mono text-[10px] text-white/80 outline-none"
              >
                {(
                  ["low", "normal", "high", "urgent"] as TaskPriority[]
                ).map((p) => (
                  <option key={p} value={p}>
                    {t(PRIORITY_LABEL_KEYS[p])}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={addTask}
            disabled={!formTitle.trim()}
            className="mt-1 w-full rounded border border-amber-500/30 bg-amber-500/15 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200 transition-colors hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("taskQueue.addTask")}
          </button>
        </div>
      ) : null}

      {/* filter tabs */}
      <div
        role="tablist"
        className="grid grid-cols-4 border-b border-amber-500/10"
      >
        {STATUS_FILTERS.map((s) => {
          const active = s === filter;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(s)}
              className={`border-r border-amber-500/10 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors last:border-r-0 ${
                active
                  ? "bg-amber-500/10 text-amber-100"
                  : "text-white/40 hover:bg-white/5 hover:text-white/70"
              }`}
            >
              {t(filterLabel[s])}{" "}
              <span className="text-white/25">{counts[s]}</span>
            </button>
          );
        })}
      </div>

      {/* task list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 ? (
          <div className="px-2 py-6 text-center font-mono text-[11px] text-white/35">
            {t("taskQueue.empty")}
          </div>
        ) : (
          filtered.map((task) => (
            <div
              key={task.id}
              className="mb-2 rounded border border-neutral-800 bg-neutral-900/95 px-3 py-3 transition-colors hover:border-amber-500/20"
            >
              {/* top row: priority dot + title + status badge */}
              <div className="flex items-start gap-2">
                <PriorityDot priority={task.priority} />
                <span className="min-w-0 flex-1 font-mono text-[11px] font-semibold leading-4 text-white/90">
                  {task.title}
                </span>
                <StatusBadge status={task.status} />
              </div>

              {/* description */}
              {task.description ? (
                <div className="mt-2 line-clamp-2 pl-4 font-mono text-[11px] leading-4 text-white/50">
                  {task.description}
                </div>
              ) : null}

              {/* agents row */}
              <div className="mt-2.5 flex items-center gap-1.5 pl-4">
                <AgentAvatar name={task.fromAgent} size="sm" />
                <ArrowRight className="h-3 w-3 text-white/25" />
                <AgentAvatar name={task.toAgent} size="sm" />
                <span className="ml-auto font-mono text-[9px] text-white/30">
                  {formatTimestamp(task.createdAt)}
                </span>
              </div>

              {/* action buttons */}
              <div className="mt-2.5 flex items-center gap-2 pl-4">
                <button
                  type="button"
                  onClick={() => cycleStatus(task.id)}
                  className="inline-flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50 transition-colors hover:border-amber-500/30 hover:text-amber-200"
                >
                  {task.status === "pending" ? (
                    <Clock className="h-3 w-3" />
                  ) : task.status === "in_progress" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {task.status === "pending"
                    ? t("taskQueue.inProgress")
                    : task.status === "in_progress"
                      ? t("taskQueue.completed")
                      : t("taskQueue.pending")}
                </button>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="inline-flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50 transition-colors hover:border-rose-500/30 hover:text-rose-300"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("taskQueue.delete")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
