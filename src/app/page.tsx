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
  Globe,
  Zap,
  KeyRound,
  Shield,
  Music,
  Building2,
  Gamepad2,
  LayoutDashboard,
  Terminal,
  MonitorSmartphone,
  MessageSquare,
  CalendarClock,
  StickyNote,
  ListTodo,
  BarChart3,
  Phone,
  Smartphone,
  GitPullRequest,
  Play,
  X as XIcon,
  CheckCircle2,
  ArrowRight,
  Star,
  Languages,
  Coffee,
  Landmark,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const heroStats = [
  { value: "24+", label: "API Endpoint" },
  { value: "12", label: "HQ Panel" },
  { value: "1300+", label: "Çeviri Anahtarı" },
  { value: "7", label: "Sürükleyici Ekran" },
];

const claw3dComparison: {
  feature: string;
  claw3d: "var" | "yok" | "kısmi";
  agent3d: "var" | "yok" | "kısmi";
}[] = [
  { feature: "3D İzometrik Ofis", claw3d: "var", agent3d: "var" },
  { feature: "OpenClaw / Hermes Gateway", claw3d: "var", agent3d: "var" },
  { feature: "Ajan Oluşturma & Düzenleme", claw3d: "var", agent3d: "var" },
  { feature: "Ofis Yerleşim Editörü", claw3d: "var", agent3d: "var" },
  { feature: "GitHub PR İnceleme", claw3d: "var", agent3d: "var" },
  { feature: "Demo Gateway (Backend Gereksiz)", claw3d: "var", agent3d: "var" },
  { feature: "Türkçe Lokalizasyon (1300+ anahtar)", claw3d: "yok", agent3d: "var" },
  { feature: "Türk Mitolojisi Ajan Teması", claw3d: "yok", agent3d: "var" },
  { feature: "AI Şirket Oluşturucu", claw3d: "yok", agent3d: "var" },
  { feature: "Sesli Komut (Whisper STT)", claw3d: "yok", agent3d: "var" },
  { feature: "Sesli Yanıt (ElevenLabs TTS)", claw3d: "yok", agent3d: "var" },
  { feature: "Telefon Kulübesi & SMS Kulübesi", claw3d: "yok", agent3d: "var" },
  { feature: "Playbook Otomasyonu (Cron)", claw3d: "yok", agent3d: "var" },
  { feature: "Görev Kuyruğu (4 Öncelik)", claw3d: "yok", agent3d: "var" },
  { feature: "Bellek Duvarı (Post-it)", claw3d: "yok", agent3d: "var" },
  { feature: "Skills Marketplace", claw3d: "yok", agent3d: "var" },
  { feature: "Spotify Jukebox (SOUNDCLAW)", claw3d: "yok", agent3d: "var" },
  { feature: "ATM / Hazine (Token Takip)", claw3d: "yok", agent3d: "var" },
  { feature: "Kahvehane & Kapalıçarşı", claw3d: "yok", agent3d: "var" },
  { feature: "SafeSkillScanner (20 Kural)", claw3d: "yok", agent3d: "var" },
  { feature: "PWA (Çevrimdışı + Kurulabilir)", claw3d: "yok", agent3d: "var" },
  { feature: "5 Adımlı Onboarding Sihirbazı", claw3d: "yok", agent3d: "var" },
  { feature: "Analitik Paneli", claw3d: "yok", agent3d: "var" },
  { feature: "Standup Toplantı Yönetimi", claw3d: "kısmi", agent3d: "var" },
];

const uniqueFeatures = [
  {
    icon: Languages,
    title: "Tam Türkçe Lokalizasyon",
    desc: "1300+ çeviri anahtarı ile arayüzün her karesi Türkçe. Onboarding, hata mesajları, ajan kişilikleri, playbook şablonları — hepsi yerelleştirilmiş.",
    tag: "Dil",
  },
  {
    icon: Building2,
    title: "AI Şirket Oluşturucu",
    desc: "Şirketinizi tanımlayın, AI roller ve sorumluluklar üretsin. Organizasyon şeması, yetki matrisi ve takım hiyerarşisi otomatik oluşturulur.",
    tag: "Organizasyon",
  },
  {
    icon: Mic,
    title: "Sesli Komut & Yanıt",
    desc: "Ajanlarınızla konuşun. Groq Whisper ile sesiniz yazıya dönüşür, ElevenLabs ile ajan size sesli yanıt verir. Telefon kulübesi deneyimi.",
    tag: "Ses",
  },
  {
    icon: CalendarClock,
    title: "Playbook Otomasyonu",
    desc: "Cron tabanlı zamanlayıcı ile otomatik görevler. Sabah brifingleri, gece kod incelemeleri, saatlik sağlık kontrolleri — hepsi kendi kendine çalışır.",
    tag: "Otomasyon",
  },
  {
    icon: ShoppingBag,
    title: "Skills Marketplace",
    desc: "Hazır skill keşfi, tek tıkla kurulum, bağımlılık yönetimi, API anahtar ayarları. Ajanlarınıza yeni yetenekler ekleyin.",
    tag: "Ekosistem",
  },
  {
    icon: Music,
    title: "Spotify Jukebox",
    desc: "Ofiste müzik çalsın. Spotify OAuth ile bağlanın, playlist arayın, parça seçin. Ajanlarınız bile müziği kontrol edebilir.",
    tag: "Eğlence",
  },
  {
    icon: Shield,
    title: "SafeSkillScanner",
    desc: "20 güvenlik kuralı ile tehlikeli komutları otomatik engeller. rm -rf, fork bomb, sudo escalation, credential sızıntısı — hiçbiri çalışmaz.",
    tag: "Güvenlik",
  },
  {
    icon: MonitorSmartphone,
    title: "PWA — Masaüstüne Kur",
    desc: "Tarayıcıdan yüklenebilir, çevrimdışı çalışır, otomatik güncelleme bildirimi. Bir tıkla masaüstünüze ekleyin.",
    tag: "Platform",
  },
  {
    icon: Coffee,
    title: "Kahvehane & Kapalıçarşı",
    desc: "Türk kültüründen esinlenen mekânlar. Kahvehanede sohbet edin, Kapalıçarşı'da skill alışverişi yapın.",
    tag: "Kültür",
  },
];

const hqPanels = [
  { icon: MessageSquare, name: "Gelen Kutusu", desc: "Bildirimler ve onay istekleri" },
  { icon: BarChart3, name: "Analitik", desc: "Kullanım metrikleri ve performans" },
  { icon: KanbanSquare, name: "Kanban", desc: "Sürükle-bırak görev panosu" },
  { icon: CalendarClock, name: "Playbook'lar", desc: "Zamanlı otomasyon iş akışları" },
  { icon: ListTodo, name: "Görev Kuyruğu", desc: "Ajanlar arası görev atama" },
  { icon: StickyNote, name: "Bellek Duvarı", desc: "Paylaşımlı post-it notlar" },
  { icon: ShoppingBag, name: "Marketplace", desc: "Skill keşfi ve kurulumu" },
  { icon: Music, name: "Jukebox", desc: "Spotify müzik kontrolü" },
  { icon: LayoutDashboard, name: "Geçmiş", desc: "Oturum logları ve denetim" },
  { icon: Network, name: "Ayarlar", desc: "Gateway ve tercihler" },
  { icon: Phone, name: "Telefon Kulübesi", desc: "Sesli ajan etkileşimi" },
  { icon: Smartphone, name: "SMS Kulübesi", desc: "Metin mesaj arayüzü" },
];

const immersiveScreens = [
  { icon: GitPullRequest, name: "GitHub", desc: "PR inceleme, diff, CI kontrol" },
  { icon: KanbanSquare, name: "Kanban", desc: "Tam ekran görev yönetimi" },
  { icon: Phone, name: "Telefon", desc: "Sesli arama simülasyonu" },
  { icon: Smartphone, name: "SMS", desc: "Mesajlaşma arayüzü" },
  { icon: Users, name: "Standup", desc: "Ekip toplantısı yönetimi" },
  { icon: Landmark, name: "ATM", desc: "Token kullanım takibi" },
  { icon: Building2, name: "Şirket", desc: "Organizasyon oluşturma" },
];

const agents = [
  { name: "Asena", role: "Lead Developer", color: "#f59e0b" },
  { name: "Umay", role: "UX / Tasarım", color: "#a78bfa" },
  { name: "Kayra", role: "DevOps", color: "#34d399" },
  { name: "Erlik", role: "QA / Güvenlik", color: "#f87171" },
  { name: "Tulpar", role: "Pazarlama", color: "#60a5fa" },
  { name: "Tengri", role: "Proje Yönetimi", color: "#fbbf24" },
];

const installSteps = [
  { step: 1, cmd: "git clone https://github.com/cemal-demirci/3dagent.git" },
  { step: 2, cmd: "npm install" },
  { step: 3, cmd: "npm run dev" },
];

const gettingStartedSteps = [
  {
    num: 1,
    icon: Globe,
    title: "Uygulamayı Aç",
    desc: "Tarayıcınızdan 3DAgent'a erişin veya PWA olarak kurun. Python, venv, pip — hiçbirine gerek yok.",
  },
  {
    num: 2,
    icon: Zap,
    title: "Bağlan veya Demo Dene",
    desc: "Gateway'e bağlanın veya \"Demo ile Başla\" ile hiç backend kurmadan keşfetmeye başlayın.",
  },
  {
    num: 3,
    icon: KeyRound,
    title: "Ajanları Çalıştır",
    desc: "LLM sağlayıcınızı yapılandırın — Claude, GPT, Gemini, Groq — ve 6 kişilik AI takımınız hazır.",
  },
];

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI" },
  { name: "Three.js", category: "3D" },
  { name: "React Three Fiber", category: "3D" },
  { name: "Phaser 3", category: "Editör" },
  { name: "Tailwind CSS 4", category: "Stil" },
  { name: "TypeScript 5", category: "Dil" },
  { name: "WebSocket", category: "Gerçek Zamanlı" },
  { name: "Serwist", category: "PWA" },
  { name: "Vitest", category: "Test" },
  { name: "Playwright", category: "E2E" },
  { name: "Docker", category: "Dağıtım" },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

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

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 border border-amber-400/30 rounded-full text-[11px] font-mono uppercase tracking-[0.16em] text-amber-400/80 mb-4">
      {children}
    </span>
  );
}

function ComparisonCell({ status }: { status: "var" | "yok" | "kısmi" }) {
  if (status === "var")
    return <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (status === "kısmi")
    return (
      <span className="inline-block w-4 h-4 mx-auto text-center text-amber-400 font-mono text-xs leading-4">
        ~
      </span>
    );
  return <XIcon className="w-4 h-4 text-neutral-600 mx-auto" />;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [devOpen, setDevOpen] = useState(false);

  return (
    <div className="bg-[#0a0a0a] text-neutral-100 overflow-x-hidden">
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">
        {/* Subtle glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
          }}
        />

        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400/60 mb-6">
          Claw3D Fork &middot; OpenClaw Gateway SDK &middot; Açık Kaynak
        </p>

        <h1 className="font-display text-7xl sm:text-8xl md:text-9xl tracking-tight text-amber-400">
          3DAGENT
        </h1>

        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-neutral-400 font-sans leading-relaxed">
          <a
            href="https://github.com/iamlukethedev/Claw3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-200 underline underline-offset-2 decoration-amber-400/30"
          >
            Claw3D
          </a>
          &apos;nin 3D ajan ofisi altyapısını aldık,{" "}
          <span className="text-neutral-200 font-medium">
            Türkçe lokalizasyon, sesli komut, şirket oluşturucu, playbook
            otomasyonu, marketplace
          </span>{" "}
          ve çok daha fazlasını ekledik. Orijinalinde olmayan{" "}
          <span className="text-amber-300">18+ yeni özellik</span> ile
          Türkiye&apos;nin ilk 3D AI ajan çalışma ortamı.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/office"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors text-lg"
          >
            <Play className="w-5 h-5" />
            Hemen Başla
          </Link>
          <a
            href="https://github.com/cemal-demirci/3dagent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-700 text-neutral-200 font-semibold rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors text-lg"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12">
          {heroStats.map((s) => (
            <div key={s.label} className="text-center">
              <span className="font-display text-3xl sm:text-4xl text-amber-400">
                {s.value}
              </span>
              <p className="mt-1 text-xs font-mono uppercase tracking-[0.14em] text-neutral-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 animate-bounce text-neutral-600">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CLAW3D vs 3DAGENT COMPARISON TABLE                          */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Karşılaştırma</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            CLAW3D vs 3DAGENT
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
            3DAgent,{" "}
            <a
              href="https://github.com/iamlukethedev/Claw3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:underline"
            >
              Claw3D
            </a>
            &apos;nin (
            <Star className="inline w-3.5 h-3.5 text-amber-400/70" /> 1.1K)
            üzerine inşa edilmiştir. Orijinalin tüm özelliklerini korurken,
            aşağıdaki tabloda görülen <strong className="text-neutral-200">18+ yeni
            özellik</strong> eklenmiştir.
          </p>
        </div>

        <div className="border border-neutral-800 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] bg-neutral-900 border-b border-neutral-800">
            <div className="px-4 py-3 text-[11px] font-mono uppercase tracking-[0.14em] text-neutral-500">
              Özellik
            </div>
            <div className="px-2 py-3 text-center text-[11px] font-mono uppercase tracking-[0.14em] text-neutral-500">
              Claw3D
            </div>
            <div className="px-2 py-3 text-center text-[11px] font-mono uppercase tracking-[0.14em] text-amber-400">
              3DAgent
            </div>
          </div>
          {/* Table rows */}
          {claw3dComparison.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_80px_80px] sm:grid-cols-[1fr_100px_100px] border-b border-neutral-800/50 ${
                i % 2 === 0 ? "bg-transparent" : "bg-neutral-900/30"
              } ${row.claw3d === "yok" ? "" : ""}`}
            >
              <div className="px-4 py-2.5 text-sm text-neutral-300">
                {row.feature}
                {row.claw3d === "yok" && (
                  <span className="ml-2 text-[9px] font-mono uppercase tracking-[0.12em] text-amber-400/60 border border-amber-400/20 rounded px-1 py-0.5">
                    yeni
                  </span>
                )}
              </div>
              <div className="px-2 py-2.5 flex items-center justify-center">
                <ComparisonCell status={row.claw3d} />
              </div>
              <div className="px-2 py-2.5 flex items-center justify-center">
                <ComparisonCell status={row.agent3d} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TURKISH MYTHOLOGY AGENTS                                    */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Türk Mitolojisi</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            6 HAZIR AI AJANI
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
            Claw3D&apos;de varsayılan ajan teması yoktur. 3DAgent, Türk
            mitolojisinden ilham alan 6 ajan ile gelir — her birinin kişiliği,
            rolleri ve beyin dosyaları özelleştirilebilir.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {agents.map((a) => (
            <div
              key={a.name}
              className="border border-neutral-800 rounded-xl p-4 text-center hover:border-amber-400/40 transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center font-display text-xl text-black"
                style={{ backgroundColor: a.color }}
              >
                {a.name[0]}
              </div>
              <h3 className="font-semibold text-sm">{a.name}</h3>
              <p className="text-[11px] text-neutral-500 mt-1">{a.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  UNIQUE FEATURES — Claw3D'de Olmayan                         */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Orijinalinde Yok</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            3DAGENT&apos;A ÖZEL ÖZELLİKLER
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
            Bu özellikler Claw3D&apos;nin orijinal sürümünde bulunmaz. 3DAgent,
            orijinal kod tabanını genişleterek tamamen yeni bir deneyim katmanı
            sunar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueFeatures.map((f) => (
            <div
              key={f.title}
              className="border border-neutral-800 rounded-xl p-6 hover:border-amber-400/40 transition-colors group relative"
            >
              <span className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-[0.14em] text-neutral-600 border border-neutral-800 rounded px-1.5 py-0.5">
                {f.tag}
              </span>
              <f.icon className="w-8 h-8 text-amber-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HQ PANELS                                                   */}
      {/* ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Karargâh</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            12 KARARGÂH PANELİ
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
            Sağ kenar çubuğundaki karargâh, ofisinizin beynidir. Her panel farklı
            bir yönetim katmanı sunar.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {hqPanels.map((p) => (
            <div
              key={p.name}
              className="flex items-start gap-3 border border-neutral-800 rounded-lg px-4 py-3 hover:border-amber-400/30 transition-colors"
            >
              <p.icon className="w-4 h-4 text-amber-400/70 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium">{p.name}</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  IMMERSIVE SCREENS                                           */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Sürükleyici Deneyim</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            7 SÜRÜKLEYİCİ EKRAN
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-neutral-400 leading-relaxed">
            Ofisteki nesnelere tıklayın, tam ekran sürükleyici modlara geçin.
            GitHub PR inceleyin, standup toplantısı yönetin veya ATM&apos;den
            token harcamalarını izleyin.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {immersiveScreens.map((s) => (
            <div
              key={s.name}
              className="inline-flex items-center gap-2 border border-neutral-800 rounded-full px-5 py-2.5 hover:border-amber-400/40 transition-colors group"
            >
              <s.icon className="w-4 h-4 text-amber-400/70 group-hover:text-amber-400 transition-colors" />
              <span className="text-sm font-medium">{s.name}</span>
              <span className="text-[10px] text-neutral-600 hidden sm:inline">
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  GATEWAY SUPPORT                                             */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Çoklu Gateway</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            İSTEDİĞİNİZ BACKEND&apos;İ BAĞLAYIN
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "OpenClaw",
              desc: "Resmi WebSocket RPC protokolü",
            },
            {
              name: "Hermes",
              desc: "Alternatif runtime adaptörü",
            },
            {
              name: "Demo",
              desc: "Backend gereksiz, anında test",
            },
            {
              name: "Özel",
              desc: "Kendi orchestrator'ınızı bağlayın",
            },
          ].map((g) => (
            <div
              key={g.name}
              className="border border-neutral-800 rounded-xl p-5 text-center hover:border-amber-400/40 transition-colors"
            >
              <Network className="w-6 h-6 text-amber-400 mx-auto mb-3" />
              <h3 className="font-semibold text-sm">{g.name}</h3>
              <p className="text-[11px] text-neutral-500 mt-1">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  GETTING STARTED                                             */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Başlangıç</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            3 ADIMDA HAZIR
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gettingStartedSteps.map((s) => (
            <div
              key={s.num}
              className="border border-neutral-800 rounded-xl p-8 text-center hover:border-amber-400/50 transition-colors group"
            >
              <span className="font-display text-5xl text-amber-400">
                {s.num}
              </span>
              <s.icon className="w-8 h-8 text-neutral-500 group-hover:text-amber-400 transition-colors mx-auto mt-4 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Developer CLI Accordion */}
        <div className="mt-10">
          <button
            onClick={() => setDevOpen(!devOpen)}
            className="flex items-center gap-2 mx-auto text-neutral-500 hover:text-amber-400 transition-colors text-sm font-mono"
          >
            <Terminal className="w-4 h-4" />
            <ChevronDown
              className={`w-4 h-4 transition-transform ${devOpen ? "rotate-180" : ""}`}
            />
            Geliştiriciler için CLI kurulumu
          </button>
          {devOpen && (
            <div className="mt-4 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden max-w-3xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-neutral-500 text-sm font-mono">
                  terminal
                </span>
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
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TECH STACK                                                  */}
      {/* ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <SectionTag>Altyapı</SectionTag>
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            TECH STACK
          </h2>
          <p className="mt-4 text-neutral-400">
            Modern web teknolojileri — Python bağımlılığı sıfır.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech.name}
              className="group px-4 py-2 border border-neutral-700 rounded-full text-sm font-mono text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              {tech.name}
              <span className="ml-1.5 text-[10px] text-neutral-600 group-hover:text-amber-400/50">
                {tech.category}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                  */}
      {/* ============================================================ */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="border border-amber-400/20 rounded-2xl bg-gradient-to-br from-amber-400/5 to-transparent p-10 sm:p-14 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-amber-400">
            HAZIR MISINIZ?
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-neutral-400 leading-relaxed">
            3DAgent açık kaynak ve ücretsiz. Hemen deneyin, demo modda backend
            kurmadan tüm özellikleri keşfedin.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/office"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors text-lg"
            >
              <ExternalLink className="w-5 h-5" />
              Demo&apos;yu Aç
            </Link>
            <a
              href="https://github.com/cemal-demirci/3dagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-600 text-neutral-200 font-semibold rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              Kaynak Kodu
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-neutral-800 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl text-amber-400">
                3DAGENT
              </span>
              <span className="text-xs text-neutral-600 font-mono">
                v0.1.4
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a
                href="https://github.com/iamlukethedev/Claw3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                Orijinal: Claw3D
              </a>
              <a
                href="https://cemal.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition-colors"
              >
                cemal.cloud
              </a>
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
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-800/50 text-center">
            <p className="text-xs text-neutral-600 font-mono">
              Claw3D &middot; OpenClaw Gateway SDK üzerine inşa edilmiştir
              &middot; MIT Lisans &middot; Cemal Demirci
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
