"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Users,
  Mic,
  Network,
  ShoppingBag,
  KanbanSquare,
  Github,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: Box,
    title: "3D Workspace",
    desc: "Gerçek zamanlı 3D ofis ortamı. Ajanlarınızı sürükle-bırak ile yerleştirin.",
  },
  {
    icon: Users,
    title: "Multi-Agent",
    desc: "Birden fazla AI ajanını aynı anda yönetin, görev atayın ve izleyin.",
  },
  {
    icon: Mic,
    title: "Voice",
    desc: "Sesli komut ve yanıt. Groq Whisper + ElevenLabs entegrasyonu.",
  },
  {
    icon: Network,
    title: "Gateway",
    desc: "OpenClaw, Hermes ve custom gateway desteği. İstediğiniz LLM'i bağlayın.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Hazır skill'ler ve eklentiler. Topluluk katkılarıyla büyüyen ekosistem.",
  },
  {
    icon: KanbanSquare,
    title: "Kanban",
    desc: "Görev takip panosu. Ajanların ilerlemesini görsel olarak izleyin.",
  },
];

const installSteps = [
  { step: 1, cmd: "git clone https://github.com/cemal-demirci/3dagent.git" },
  { step: 2, cmd: "npm install" },
  { step: 3, cmd: "npm run dev" },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "Three.js",
  "Tailwind CSS 4",
  "TypeScript",
  "WebSocket",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-neutral-500 hover:text-amber-400 transition-colors shrink-0"
      aria-label="Kopyala"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0a0a0a] text-neutral-100">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
        <h1 className="font-display text-7xl sm:text-8xl md:text-9xl tracking-tight text-amber-400">
          3DAGENT
        </h1>
        <p className="mt-4 max-w-xl text-lg sm:text-xl text-neutral-400 font-sans">
          AI ajanlarınız için gerçek zamanlı 3D çalışma ortamı.
          <br className="hidden sm:block" />
          Sesli komut, multi-agent, marketplace — hepsi tek workspace&apos;te.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/cemal-demirci/3dagent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub&apos;dan İndir
          </a>
          <Link
            href="/office"
            className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-700 text-neutral-200 font-semibold rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Demo&apos;yu Dene
          </Link>
        </div>
        <div className="absolute bottom-8 animate-bounce text-neutral-600">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-amber-400 mb-16">
          ÖZELLİKLER
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-neutral-800 rounded-xl p-6 hover:border-amber-400/50 transition-colors group"
            >
              <f.icon className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-amber-400 mb-16">
          KURULUM
        </h2>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-neutral-500 text-sm font-mono">terminal</span>
          </div>
          <div className="p-6 space-y-4">
            {installSteps.map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="text-amber-400 font-mono text-sm shrink-0">
                  {s.step}.
                </span>
                <code className="font-mono text-sm text-neutral-300 flex-1 overflow-x-auto">
                  {s.cmd}
                </code>
                <CopyButton text={s.cmd} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="font-display text-4xl sm:text-5xl text-center text-amber-400 mb-16">
          TECH STACK
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 border border-neutral-700 rounded-full text-sm font-mono text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span>
            Cemal Demirci —{" "}
            <a
              href="https://cemal.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              cemal.cloud
            </a>
          </span>
          <a
            href="https://github.com/cemal-demirci/3dagent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
