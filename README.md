<p align="center">
  <img src="docs/images/landing-hero.png" alt="3DAgent Landing" width="100%" />
</p>

# 3DAgent — 3D AI Agent Workspace

**3DAgent, [Claw3D](https://github.com/iamlukethedev/Claw3D)'nin 3D ajan ofisi altyapısını alıp üzerine Türkçe lokalizasyon, sesli komut, şirket oluşturucu, playbook otomasyonu, marketplace ve çok daha fazlasını ekleyerek oluşturulmuş, açık kaynaklı bir 3D AI çalışma ortamıdır.**

Claw3D, AI ajanları 3D bir ofiste görselleştiren güçlü bir araçtır. Ancak orijinal hâliyle İngilizce, temasız ve ek özellikler konusunda sınırlıdır. 3DAgent, Claw3D'nin OpenClaw Gateway SDK'sını kullanarak tüm bu temeli korur ve sesli komut, AI şirket oluşturucu, playbook otomasyonu, skills marketplace, Spotify entegrasyonu, PWA desteği, tam Türkçe lokalizasyon ve daha fazlasını ekler.

### Claw3D vs 3DAgent

<p align="center">
  <img src="docs/images/landing-comparison.png" alt="Claw3D vs 3DAgent Karşılaştırma" width="100%" />
</p>

| Özellik | Claw3D | 3DAgent |
|---------|--------|---------|
| 3D İzometrik Ofis | ✅ | ✅ |
| OpenClaw / Hermes Gateway | ✅ | ✅ |
| Ajan Oluşturma & Düzenleme | ✅ | ✅ |
| Ofis Yerleşim Editörü | ✅ | ✅ |
| GitHub PR İnceleme | ✅ | ✅ |
| Türkçe Lokalizasyon (1300+ anahtar) | ❌ | ✅ |
| Türk Mitolojisi Ajan Teması | ❌ | ✅ |
| AI Şirket Oluşturucu | ❌ | ✅ |
| Sesli Komut (Whisper STT) | ❌ | ✅ |
| Sesli Yanıt (ElevenLabs TTS) | ❌ | ✅ |
| Telefon Kulübesi & SMS Kulübesi | ❌ | ✅ |
| Playbook Otomasyonu (Cron) | ❌ | ✅ |
| Görev Kuyruğu (4 Öncelik) | ❌ | ✅ |
| Bellek Duvarı (Post-it) | ❌ | ✅ |
| Skills Marketplace | ❌ | ✅ |
| Spotify Jukebox (SOUNDCLAW) | ❌ | ✅ |
| ATM / Hazine (Token Takip) | ❌ | ✅ |
| Kahvehane & Kapalıçarşı | ❌ | ✅ |
| SafeSkillScanner (20 Kural) | ❌ | ✅ |
| PWA (Çevrimdışı + Kurulabilir) | ❌ | ✅ |
| 5 Adımlı Onboarding Sihirbazı | ❌ | ✅ |
| Analitik Paneli | ❌ | ✅ |

> Fork: [iamlukethedev/Claw3D](https://github.com/iamlukethedev/Claw3D) | Lisans: MIT

<p align="center">
  <img src="docs/images/office-main.png" alt="3DAgent 3D Ofis" width="100%" />
</p>

---

## Özellikler

### 3D Retro Ofis
- Ajanların masalarında çalıştığı, hareket ettiği paylaşımlı 3D ortam
- Odalar arası navigasyon: GitHub odası, kahvehane, kapalıçarşı, beceri pazarı
- Olay tabanlı oda tetikleyicileri (NLP intent ile mesaj içeriğinden oda eşleme)
- Ofis düzeni builder'ı (`/office/builder`) ile özelleştirme
- Isı haritası ve iz takibi
- Atatürk portresi (altın çerçeveli `#8B7531`, spot ışıklı, 512x640 texture)
- Türk bayrağı direği

<p align="center">
  <img src="docs/images/ataturk-portrait.png" alt="Atatürk Portresi — 3D ofiste altın çerçeveli" width="220" />
  <br/>
  <em>Ofis duvarında altın çerçeveli Atatürk portresi</em>
</p>

### Türk Mitolojisi Temalı AI Ekibi

<p align="center">
  <img src="docs/images/landing-agents.png" alt="3DAgent Türk Mitolojisi Ajanları" width="100%" />
</p>

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

### 💎 Akıllı Auth — Türkiye'de Bir İlk (Smart Auth)

> **API faturaları tarihe karışıyor.** 3DAgent, Türkiye'de ilk kez mevcut CLI/SDK aboneliklerini otomatik algılayarak AI ajan maliyetini neredeyse sıfıra indiren açık kaynak projedir.

Türkiye'deki geliştiricilerin en büyük AI bariyeri maliyet. ChatGPT Plus $20/ay, Claude Pro $20/ay, API kredileri ayrı fatura… 3DAgent bu denklemi kökünden değiştiriyor:

- **Otomatik CLI/SDK Algılama:** Sunucu başlatılırken **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) ve **Google Gemini CLI** (`@google/gemini-cli`) kurulumları otomatik tespit edilir. Algılanan araç varsa ilgili stream fonksiyonu anında devreye girer — sıfır yapılandırma.
- **Gemini ile Tamamen Ücretsiz:** Google Gemini CLI'ın ücretsiz kotası sayesinde, hiç para ödemeden tam kapasiteli AI ajan ofisi çalıştırabilirsiniz. Türkiye'de bu imkânı sunan başka açık kaynak proje yok.
- **Claude Pro Aboneliğini Sonuna Kadar Kullan:** Zaten Claude Pro ödüyorsanız, aynı abonelikle 6 ajanı aynı anda çalıştırın — ekstra API kredisi yok, ekstra fatura yok.
- **Akıllı Fallback Zinciri:** `selectStreamFunction()` sırasıyla API SDK → CLI/SDK → Demo akışını dener. Hiçbir gerçek backend yoksa demo modu devreye girer — her koşulda çalışır.
- **Manuel API Key Desteği:** İsterseniz API anahtarlarını ortam değişkenleri veya ayarlar panelinden de girebilirsiniz.

### 3DAgent'a Özel Özellikler

<p align="center">
  <img src="docs/images/landing-features.png" alt="3DAgent'a Özel Özellikler" width="100%" />
</p>

### İmersif Ekranlar

<p align="center">
  <img src="docs/images/landing-immersive.png" alt="3DAgent Sürükleyici Ekranlar" width="100%" />
</p>

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
  <img src="docs/images/landing-hq-panels.png" alt="3DAgent 12 Karargâh Paneli" width="100%" />
</p>

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

<p align="center">
  <img src="docs/images/landing-tech-stack.png" alt="3DAgent Tech Stack" width="100%" />
</p>

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

- Güvenlik başlıkları (X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy vb.)
- IP bazlı rate limiting (yapılandırılabilir pencere ve limit)
- Yapılandırılabilir CORS
- Token tabanlı erişim kapısı (access-gate.js)
- Ed25519 cihaz kimlik doğrulama (device auth)
- Non-root Docker kullanıcı
- Gateway tokenları sunucu tarafında — tarayıcıda saklanmaz
- SafeSkillScanner ile tehlikeli komut tespiti (20 regex kuralı)
- WebSocket otomatik yeniden bağlantı (üstel geri çekilme)

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

### Landing Sayfası

<p align="center">
  <img src="docs/images/landing-full.png" alt="3DAgent Landing — Tam Sayfa" width="100%" />
  <br/>
  <em>Landing sayfasının tam görünümü</em>
</p>

| Ekran | Görüntü |
|-------|---------|
| Tam Sayfa | [landing-full.png](docs/images/landing-full.png) |
| Hero | [landing-hero.png](docs/images/landing-hero.png) |
| Claw3D vs 3DAgent | [landing-comparison.png](docs/images/landing-comparison.png) |
| Türk Mitolojisi Ajanları | [landing-agents.png](docs/images/landing-agents.png) |
| 3DAgent'a Özel Özellikler | [landing-features.png](docs/images/landing-features.png) |
| 12 Karargâh Paneli | [landing-hq-panels.png](docs/images/landing-hq-panels.png) |
| Sürükleyici Ekranlar | [landing-immersive.png](docs/images/landing-immersive.png) |
| Tech Stack | [landing-tech-stack.png](docs/images/landing-tech-stack.png) |
| CTA | [landing-cta.png](docs/images/landing-cta.png) |

### Uygulama

| Ekran | Görüntü |
|-------|---------|
| 3D Ofis | [office-main.png](docs/images/office-main.png) |
| Kanban Panosu | [kanban-board.png](docs/images/kanban-board.png) |
| HQ Karargâh | [settings-panel.png](docs/images/settings-panel.png) |
| Hafıza Duvarı | [memory-wall.png](docs/images/memory-wall.png) |
| Görev Kuyruğu | [task-queue.png](docs/images/task-queue.png) |
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

<p align="center">
  <img src="docs/images/landing-cta.png" alt="3DAgent — Hazır mısınız?" width="100%" />
</p>

## Lisans

MIT — Orijinal proje [iamlukethedev/Claw3D](https://github.com/iamlukethedev/Claw3D)'den fork edilmiştir.

Geliştirici: [Cemal Demirci]([https://cemal.cloud](https://www.linkedin.com/in/cemaldemirci/)) | [GitHub](https://github.com/cemal-demirci)
