<p align="center">
  <img src="docs/images/landing-page.png" alt="3DAgent Landing" width="100%" />
</p>

# 3DAgent — 3D AI Agent Workspace

**3DAgent, yapay zeka ajanlarınızı gerçek zamanlı izleyip yönetebileceğiniz, tamamen Türkçe, açık kaynaklı bir 3D çalışma ortamıdır.**

Mevcut AI agent framework'leri (CrewAI, AutoGen, LangGraph, MetaGPT) güçlü araçlar sunar; ancak hepsinde ortak bir eksik vardır: **ajanlarınızın ne yaptığını görsel olarak takip edemezsiniz.** Terminal çıktıları ve log dosyaları arasında kaybolursunuz. Hangi ajanın hangi görevi üstlendiğini, birbirleriyle nasıl iletişim kurduğunu ve sürecin neresinde olduğunuzu anlamak için sürekli konsol izlemeniz gerekir.

3DAgent bu sorunu kökünden çözer. İzometrik 3D bir ofis ortamında ajanlarınızı masalarında çalışırken izler, görev atamalarını Kanban panosuyla yönetir, hafıza duvarıyla notlar paylaşır ve tüm bunları tek bir tarayıcı sekmesinden yaparsınız. Python bağımlılığı yoktur — tamamen web tabanlıdır.

### Neden 3DAgent?

- **Sektördeki tek 3D görsel çalışma alanı** — Ajanlar ofiste hareket eder, masalarında çalışır, görevlerini gerçek zamanlı takip edersiniz
- **Türk mitolojisinden 6 AI ajan** — Her birinin kendine özgü kişiliği, uzmanlık alanı ve 3D avatarı vardır
- **Entegre proje yönetimi** — Kanban panosu, Görev Kuyruğu ve Hafıza Duvarı ile ayrı araçlara ihtiyaç duymadan çalışırsınız
- **Tamamen Türkçe** — 1300+ çeviri anahtarı ile arayüzden hata mesajlarına her şey Türkçe
- **Açık kaynak ve ücretsiz** — Kendi sunucunuzda barındırabilirsiniz
- **Web tabanlı** — Next.js 16 + React 19 + Three.js üzerine kurulu, Python bağımlılığı yok
- **Çoklu LLM desteği** — OpenAI, Anthropic Claude, Google Gemini veya yerel modeller

> Fork: [iamlukethedev/Claw3D](https://github.com/iamlukethedev/Claw3D) | Lisans: MIT

<p align="center">
  <img src="docs/images/office-main.png" alt="3DAgent 3D Ofis" width="100%" />
</p>

---

## Özellikler

### 3D Retro Ofis
- Ajanların masalarında çalıştığı, hareket ettiği paylaşımlı 3D ortam
- Odalar, masalar, navigasyon, animasyonlar ve olay tabanlı aktivite ipuçları
- Ofis düzeni builder'ı (`/office/builder`) ile özelleştirme
- Isı haritası ve iz takibi
- Atatürk portresi (altın çerçeveli, spot ışıklı)
- Türk bayrağı direği

<p align="center">
  <img src="docs/images/ataturk-portrait.png" alt="Atatürk Portresi — 3D ofiste altın çerçeveli" width="220" />
  <br/>
  <em>Ofis duvarında altın çerçeveli Atatürk portresi</em>
</p>

### Türk Mitolojisi Temalı AI Ekibi
6 hazır ajan, Türk mitolojisinden ilham alan isim ve kişiliklerle:

| Ajan | Rol | Vibe |
|------|-----|------|
| Asena | Baş Geliştirici | Kod yazan dişi kurt |
| Umay | UX/Tasarım | Kullanıcıyı koruyan ana tanrıça |
| Kayra | DevOps & Altyapı | Dünyayı düzenleyen yaratıcı tanrı |
| Erlik | QA & Güvenlik | Yeraltının bekçi tanrısı |
| Tulpar | Pazarlama & İçerik | Kanatları rüzgâr olan savaş atı |
| Tengri | Proje Yönetimi | Gökyüzü tanrısı, büyük resmi gören |

Her ajanın kendi tanıtım ekranı, uzmanlık alanları, kişilik dosyaları (SOUL.md, IDENTITY.md, AGENTS.md) ve 3D avatarı vardır.

### Şirket Kurma (Company Builder)
- Tek bir istemden AI tabanlı şirket oluşturma
- Türkçe isim, rol, sorumluluk ve kişilik otomatik üretimi
- Organizasyon şeması önizleme
- Rol ekleme/çıkarma/düzenleme
- Mevcut ajanları otomatik değiştirme

### Ajan Yönetimi
- Filo kenar çubuğundan ajan oluşturma, yapılandırma ve izleme
- Gerçek zamanlı sohbet + komut onaylama
- Ajan tanıtım ekranı: rol, uzmanlık alanları, kişilik özeti
- Avatar özelleştirme ve beyin dosyaları düzenleme
- Ajan yetenekleri (skills) yönetimi

### Gateway Mimarisi
- **OpenClaw** — Resmi gateway protokolü
- **Hermes** — WebSocket adaptörü ile alternatif runtime
- **Demo** — Gerçek backend olmadan ofisi keşfetmek için mock gateway
- **Custom** — Kendi orchestrator/runtime'ınızı bağlayın
- Same-origin WebSocket proxy (tarayıcı → Studio → Gateway)

### İmersif Ekranlar

<p align="center">
  <img src="docs/images/kanban-board.png" alt="3DAgent Kanban Panosu" width="100%" />
</p>

| Ekran | Açıklama |
|-------|----------|
| GitHub Kod İnceleme Odası | PR inceleme, diff, satırıcı yorum |
| Kanban Panosu | Sürükle-bırak görev yönetimi, ajan atama |
| ATM / Hazine | Token kullanım defteri, bütçe uyarıları |
| Telefon Kabini | Sesli/yazılı ajan iletişimi |
| Mesajlaşma Kabini | SMS tarzı mesajlaşma |
| Kahvehane | Test ve sohbet köşesi |
| Kapalıçarşı | Beceri pazarı (marketplace) |

### HQ Karargâh Panelleri

<p align="center">
  <img src="docs/images/settings-panel.png" alt="3DAgent Karargâh" width="100%" />
</p>

- **Gelen Kutusu** — Bildirimler ve onay istekleri
- **Geçmiş** — Oturum geçmişi ve denetim günlüğü
- **Kanban** — Görev yönetimi panosu
- **Playbook'lar** — Otomatik iş akışları ve zamanlanmış görevler
- **Görev Kuyruğu** — Ajanlar arası görev atama ve takibi
- **Hafıza Duvarı** — Ajanlar arası paylaşımlı not sistemi
- **Analitik** — Kullanım, harcama ve performans metrikleri

### Hafıza Duvarı (Memory Wall)

<p align="center">
  <img src="docs/images/memory-wall.png" alt="3DAgent Hafıza Duvarı" width="100%" />
</p>

- Ajanlar arası paylaşımlı post-it not sistemi
- 5 renk seçeneği ile görsel kategorizasyon
- Yazar ismi ve zaman damgası
- localStorage ile kalıcı depolama

### Görev Kuyruğu (Task Queue)

<p align="center">
  <img src="docs/images/task-queue.png" alt="3DAgent Görev Kuyruğu" width="100%" />
</p>

- Ajanlar arası görev atama sistemi
- 4 öncelik seviyesi (düşük, normal, yüksek, acil)
- 3 durum takibi (beklemede, devam ediyor, tamamlandı)
- 6 preset ajan arasında görev yönlendirme
- Filtreleme ve localStorage kalıcılığı

### Güvenlik (SafeSkillScanner)
- Ajan komutlarını regex tabanlı güvenlik taraması
- 20 kural: dosya sistemi, ağ, kimlik bilgileri, yetki yükseltme
- Tehlikeli komutlar engellenir, uyarılar bildirilir
- `rm -rf /`, fork bomb, `curl | bash` gibi pattern'ler yakalanır

### Ses Desteği
- **Groq Whisper** ile sesli mesaj transkripsiyon
- **ElevenLabs TTS** ile sesli ajan yanıtları
- Ses seçimi ve hız ayarı
- Türkçe hata mesajları

### PWA & Çevrimdışı Destek
- Service worker (Serwist) ile çevrimdışı çalışma
- Güncelleme bildirimi banner'ı
- Uygulamayı ana ekrana ekleme (standalone)
- Otomatik ikon üretimi (192x192, 512x512)

### Türkçe Lokalizasyon
- 1300+ çeviri anahtarı
- Tüm UI bileşenleri, onboarding, ayarlar, paneller Türkçe
- Şirket kurma, ajan kişilikleri, hata mesajları Türkçe
- AI prompt'ları Türkçe içerik üretir

### Çoklu Ofis Desteği
- Uzak ofis bağlantısı (presence endpoint veya OpenClaw gateway)
- Salt okunur uzak ajan görüntüleme
- Etiket ve kaynak türü yapılandırması

### Spotify Jukebox (SOUNDCLAW)
- Ofiste müzik çalma
- OAuth entegrasyonu

---

## Hızlı Başlangıç

### 1. Kaynak Koddan

```bash
git clone https://github.com/cemal-demirci/3dagent.git
cd 3dagent
npm install
npm run setup        # İnteraktif kurulum wizard'ı
npm run dev          # http://localhost:3000
```

`npm run setup` şunları otomatik halleder:
- Node.js ve npm sürüm kontrolü
- Claude CLI kurulum + OAuth giriş
- Gemini CLI kontrolü + auth
- `.env` dosyası oluşturma
- API key girişi (opsiyonel)
- Demo gateway bağlantı testi

### 2. Docker ile

```bash
docker compose up -d
# http://localhost:3000
```

### 3. Demo Modu (Backend Gerekmez)

```bash
npm run dev
# Demo backend otomatik başlar (port 18789)
# Bağlantı ekranında "Demo ile Başla" butonuna tıklayın
```

---

## Teknik Altyapı

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| 3D Grafik | Three.js, React Three Fiber, Drei |
| Oyun Motoru | Phaser (builder ve interaktif yüzeyler) |
| Stil | Tailwind CSS 4 |
| AI SDK'lar | Claude Agent SDK, Google Gemini, OpenAI |
| Gerçek Zamanlı | WebSocket (ws) |
| Ses | Groq Whisper (STT), ElevenLabs (TTS) |
| PWA | Serwist (service worker) |
| Test | Vitest (unit), Playwright (e2e) |
| Sunucu | Node.js custom server (HTTP/HTTPS + WS proxy) |
| CI/CD | GitHub Actions (lint → typecheck → test → build) |

---

## Proje Yapısı

```
3dagent/
├── server/                    # Node.js backend
│   ├── index.js               # Ana sunucu (HTTP/HTTPS + Next.js)
│   ├── access-gate.js         # Token kimlik doğrulama
│   ├── gateway-proxy.js       # WebSocket proxy
│   ├── rate-limiter.js        # IP bazlı hız sınırlandırıcı
│   ├── security-headers.js    # Güvenlik başlıkları
│   ├── logger.js              # JSON logger
│   ├── demo-gateway-adapter.js # Demo gateway (mock AI)
│   └── hermes-gateway-adapter.js # Hermes adaptörü
│
├── scripts/
│   ├── setup.js               # Otomatik kurulum wizard'ı
│   ├── generate-pwa-icons.mjs # PWA ikon üretici
│   └── take-screenshots.mjs   # README ekran görüntüsü üretici
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout + metadata + PWA
│   │   ├── page.tsx           # Landing sayfası
│   │   ├── office/            # Ana ofis arayüzü
│   │   ├── offline/           # Çevrimdışı fallback
│   │   ├── sw.ts              # Service worker kaynağı
│   │   └── api/               # API route'ları
│   │
│   ├── features/
│   │   ├── agents/            # Ajan bileşenleri, state, işlemler
│   │   ├── office/            # Ofis UI, paneller, imersif ekranlar
│   │   │   └── components/panels/  # HQ panelleri
│   │   │       ├── MemoryWallPanel.tsx  # Hafıza Duvarı
│   │   │       └── TaskQueuePanel.tsx   # Görev Kuyruğu
│   │   ├── retro-office/      # 3D retro ofis motoru
│   │   ├── company-builder/   # Şirket oluşturucu
│   │   ├── onboarding/        # Başlangıç wizard'ı
│   │   ├── pwa/               # PWA güncelleme banner'ı
│   │   └── spotify-jukebox/   # Müzik çalar
│   │
│   └── lib/
│       ├── i18n/              # Türkçe çeviriler (1300+ key)
│       ├── gateway/           # Gateway iletişimi
│       ├── agents/            # Preset ajanlar, kişilik dosyaları
│       ├── security/          # SafeSkillScanner güvenlik modülü
│       ├── studio/            # Studio ayarları
│       ├── voiceReply/        # ElevenLabs TTS
│       ├── openclaw/          # Ses transkripsiyon (Groq Whisper)
│       └── notifications.ts   # Masaüstü bildirimleri
│
├── tests/                     # Unit + E2E testler
├── docs/                      # Mimari, API, rehber dokümanları
├── public/                    # Statik dosyalar, PWA manifest, ikonlar
├── .github/workflows/         # CI/CD pipeline
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose
└── package.json               # v0.1.4
```

---

## Ortam Değişkenleri

| Değişken | Açıklama | Varsayılan |
|----------|----------|------------|
| `PORT` | Sunucu portu | 3000 |
| `HOST` | Sunucu adresi | 0.0.0.0 |
| `DEBUG` | OpenClaw konsol | true |
| `STUDIO_ACCESS_TOKEN` | Uzak erişim tokeni | — |
| `DEMO_ADAPTER_PORT` | Demo gateway portu | 18789 |
| `ANTHROPIC_API_KEY` | Claude API | — |
| `GEMINI_API_KEY` | Gemini API | — |
| `OPENAI_API_KEY` | OpenAI API | — |
| `GROQ_API_KEY` | Groq Whisper + LLM | — |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS | — |
| `ELEVENLABS_VOICE_ID` | Ses seçimi | — |
| `RATE_LIMIT_MAX` | Pencere başına max istek | 120 |
| `RATE_LIMIT_WINDOW_MS` | Pencere süresi (ms) | 60000 |
| `LOG_LEVEL` | Log seviyesi | info |
| `CORS_ORIGIN` | CORS izni | — |

Tüm değişkenler: [`.env.example`](.env.example)

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run setup` | İnteraktif kurulum wizard'ı |
| `npm run dev` | Geliştirme sunucusu (demo gateway dahil) |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run demo-gateway` | Bağımsız demo gateway |
| `npm run hermes-adapter` | Hermes adaptörünü başlat |
| `npm run generate:pwa-icons` | PWA ikonlarını üret |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrol |
| `npm run test` | Unit testler (Vitest) |
| `npm run e2e` | E2E testler (Playwright) |
| `docker compose up -d` | Docker ile çalıştır |

---

## Bağlantı Senaryoları

### Yerel Gateway + Yerel Studio
```bash
npm run dev
# http://localhost:3000 → ws://localhost:18789
```

### Uzak Gateway (Tailscale)
```bash
# Gateway host'ta:
tailscale serve --yes --bg --https 443 http://127.0.0.1:18789
# Studio'da URL: wss://<gateway-host>.ts.net
```

### Uzak Gateway (SSH Tünel)
```bash
ssh -L 18789:127.0.0.1:18789 user@<gateway-host>
# Studio'da URL: ws://localhost:18789
```

### Demo Modu
```bash
npm run dev
# Demo backend otomatik başlar, "Demo ile Başla" tıklayın
```

---

## Güvenlik

- Güvenlik başlıkları (X-Content-Type-Options, X-Frame-Options, HSTS, vb.)
- IP bazlı rate limiting
- Yapılandırılabilir CORS
- Token tabanlı erişim kapısı
- Non-root Docker kullanıcı
- Gateway tokenları sunucu tarafında — tarayıcıda saklanmaz
- SafeSkillScanner ile tehlikeli komut tespiti (20 regex kuralı)

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Bağlantı başarısız | Gateway URL ve token'ı kontrol edin |
| `EPROTO` hatası | `wss://` yerine `ws://` deneyin |
| `INVALID_REQUEST` | Gateway eski — güncelleyin veya demo kullanın |
| `401 Studio access token` | `STUDIO_ACCESS_TOKEN` ayarlı, cookie eksik |
| CLI bulunamadı | `npm run setup` çalıştırın |
| GROQ API key hatası | Ayarlar → AI Anahtarları'ndan key ekleyin |
| Kanban açılmıyor | Demo gateway bağlantısını kontrol edin |

---

## Ekran Görüntüleri

| Ekran | Görüntü |
|-------|---------|
| Landing Sayfası | [landing-page.png](docs/images/landing-page.png) |
| 3D Ofis | [office-main.png](docs/images/office-main.png) |
| Kanban Panosu | [kanban-board.png](docs/images/kanban-board.png) |
| HQ Karargâh | [settings-panel.png](docs/images/settings-panel.png) |
| Hafıza Duvarı | [memory-wall.png](docs/images/memory-wall.png) |
| Görev Kuyruğu | [task-queue.png](docs/images/task-queue.png) |
| Atatürk Portresi | [ataturk-portrait.png](docs/images/ataturk-portrait.png) |
| Ofis Builder | [office-builder.png](docs/images/office-builder.png) |

---

## Dokümantasyon

| Dosya | İçerik |
|-------|--------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Sistem mimarisi ve tasarım kararları |
| [API.md](API.md) | API endpoint dokümantasyonu |
| [VISION.md](VISION.md) | Proje vizyonu ve hedefleri |
| [ROADMAP.md](ROADMAP.md) | Geliştirme yol haritası |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Katkı rehberi |
| [CREATING_SKILLS.md](CREATING_SKILLS.md) | Yetenek oluşturma rehberi |
| [SECURITY.md](SECURITY.md) | Güvenlik politikası |
| [CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md) | Kod haritası ve okuma sırası |

---

## Lisans

MIT — Orijinal proje [iamlukethedev/Claw3D](https://github.com/iamlukethedev/Claw3D)'den fork edilmiştir.

Geliştirici: [Cemal Demirci](https://cemal.cloud) | [GitHub](https://github.com/cemal-demirci)
