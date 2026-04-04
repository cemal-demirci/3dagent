# CLAW3D

AI ajanlarınız için 3D çalışma alanı.

> Orijinal proje [iamlukethedev/Claw3D](https://github.com/iamlukethedev/Claw3D) tarafından geliştirilmiştir. Bu sürüm Türkçe lokalizasyon, otomatik kurulum, branding ve ek özelliklerle genişletilmiştir. MIT lisansı altında dağıtılmaktadır.

Claw3D, AI otomasyonunu görsel bir iş yerine dönüştürür — ajanlarınız paylaşımlı bir 3D ortamda birlikte çalışır, kod yazar, test eder ve görevleri yürütür.

**AI ekibiniz için bir ofis.**

---

## Hızlı Başlangıç

```bash
git clone https://github.com/cemal-demirci/claw3d.git
cd claw3d
npm install          # Sonunda "npm run setup çalıştırın" hatırlatması çıkar
npm run setup        # İnteraktif kurulum wizard'ı
npm run dev          # http://localhost:3000
```

`npm run setup` şunları otomatik halleder:
- Node.js ve npm sürüm kontrolü
- Claude CLI kurulum + OAuth giriş
- Gemini CLI kontrolü + auth
- `.env` dosyası oluşturma
- API key girişi (opsiyonel — CLI zaten yetişiyor)
- Demo gateway bağlantı testi

---

## Orijinal Özellikler

### 3D Retro Ofis
- Ajanların masalarında çalıştığı, hareket ettiği paylaşımlı 3D ortam
- Odalar, masalar, navigasyon, animasyonlar ve olay tabanlı aktivite ipuçları
- Ofis düzeni builder'ı (`/office/builder`) ile özelleştirme
- Isı haritası ve iz takibi

### Ajan Yönetimi
- Filo kenar çubuğundan ajan oluşturma, yapılandırma ve izleme
- Gerçek zamanlı sohbet + komut onaylama
- Oturum kontrolleri, yeni oturum başlatma
- Avatar özelleştirme ve ajan düzenleme
- Beyin dosyaları (personality, memory, tools) düzenleme
- Ajan yetenekleri (skills) yönetimi

### Gateway Mimarisi
- **OpenClaw** — Resmi gateway protokolü
- **Hermes** — WebSocket adaptörü ile alternatif runtime
- **Demo** — Gerçek backend olmadan ofisi keşfetmek için mock gateway
- **Custom** — Kendi orchestrator/runtime'ınızı bağlayın
- Same-origin WebSocket proxy (tarayıcı → Studio → Gateway)

### İmersif Ekranlar
- **GitHub Kod İnceleme Odası** — PR inceleme, diff görüntüleme, satır içi yorum
- **Kanban Panosu** — Sürükle-bırak görev yönetimi, ajan atama, playbook bağlama
- **ATM / Hazine** — Token kullanım defteri, ajan harcamaları, bütçe uyarıları
- **Telefon Kabini** — Ajanlarla sesli/yazılı iletişim
- **Mesajlaşma Kabini** — SMS tarzı mesajlaşma
- **Kahvehane** — Test ve sohbet köşesi
- **Kapalıçarşı** — Beceri pazarı (marketplace)

### HQ Karargah Panelleri
- **Inbox** — Gelen bildirimler ve onay istekleri
- **Geçmiş** — Oturum geçmişi ve loglar
- **Analitik** — Kullanım istatistikleri
- **Playbook'lar** — Otomatik iş akışları
- **Görev Panosu** — Kanban tarzı görev takibi

### Çoklu Ofis Desteği
- Uzak ofis bağlantısı (presence endpoint veya OpenClaw gateway)
- Salt okunur uzak ajan görüntüleme
- Etiket ve kaynak türü yapılandırması

### Ses Desteği
- ElevenLabs TTS ile sesli ajan yanıtları
- Ses seçimi ve hız ayarı
- Sesli mesaj kaydı

### Spotify Jukebox (SOUNDCLAW)
- Ofiste müzik çalma
- OAuth entegrasyonu

---

## Eklenen Özellikler (Bu Sürüm)

### Otomatik Kurulum Wizard'ı
- `npm run setup` — 6 adımlı renkli terminal wizard
- Claude CLI otomatik kurulum + OAuth login
- Gemini CLI kontrolü + Google auth
- `.env` otomatik oluşturma
- API key girişi (opsiyonel)
- Gateway bağlantı testi
- `npm install` sonrası hatırlatma mesajı

### Türkçe Lokalizasyon
- 1260+ çeviri anahtarı
- Tüm UI bileşenleri, onboarding, ayarlar, paneller Türkçe

### cemal.cloud Branding
- Sayfa başlığı: "Claw3D — by Cemal Demirci"
- Loading ekranında CLAW3D + cemal.cloud
- Onboarding wizard'da branding başlık ve footer
- Hakkında modalı (versiyon, geliştirici, teknolojiler, lisans)
- Settings panelinde "Hakkında" bölümü

### CLI/SDK Durum Badge'leri
- Gateway bağlantısında Claude Agent SDK durumu
- Gemini CLI auth durumu
- CLI aktifse API key formu yerine "Zaten yapılandırılmış" badge'i
- CLI yoksa sarı uyarı + yönlendirme

### Erişim Kapısı Ekranı (Access Gate)
- `STUDIO_ACCESS_TOKEN` ayarlıyken branded login formu
- Token girişi → cookie ayarla → otomatik yenileme
- Hatalı token'da görsel hata mesajı
- cemal.cloud branding

### Güvenlik Başlıkları
- X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- Referrer-Policy, Permissions-Policy
- HTTPS üzerinde HSTS (Strict-Transport-Security)
- Yapılandırılabilir CORS desteği (preflight dahil)

### Rate Limiting
- IP bazlı kayan pencere (sliding window) hız sınırlayıcı
- Sadece `/api/*` route'larını sınırlar, statik dosya ve WebSocket'i atlar
- `RATE_LIMIT_MAX` ve `RATE_LIMIT_WINDOW_MS` ile yapılandırma
- `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` başlıkları

### Yapılandırılmış Loglama (Structured Logging)
- JSON formatında stdout/stderr çıktı
- `LOG_LEVEL` ile seviye kontrolü (debug, info, warn, error)
- Sıfır bağımlılık — sadece Node.js built-in

### Health Check
- `/health` endpoint'i — durum, uptime, sürüm bilgisi
- Docker HEALTHCHECK ile entegre

### Docker Desteği
- Multi-stage Dockerfile (builder → runner)
- Non-root kullanıcı (`claw3d`, uid 1001)
- docker-compose.yml ile tek komutta çalıştırma
- Otomatik health check

### CI/CD (GitHub Actions)
- Push ve PR'da otomatik çalışır (main branch)
- Node.js 20 ve 22 matris testi
- Lint → Typecheck → Test → Build pipeline'ı

### Masaüstü Bildirimleri
- Tarayıcı Notification API entegrasyonu
- İzin isteme ve durum kontrolü
- Tab odakta değilken bildirim gönderme
- Settings panelinden yapılandırma

### Dışa/İçe Aktarma (Export/Import)
- `/api/studio/export` — Tüm ayarları JSON olarak indir
- `/api/studio/import` — JSON dosyasından ayarları yükle
- Settings panelinden tek tıkla erişim

### PWA Desteği
- `manifest.json` — Standalone uygulama modu
- SVG favicon (C3 logosu)
- Open Graph ve Twitter meta etiketleri
- Tema rengi: amber (#fbbf24)

### API Dokümantasyonu
- Tüm endpoint'ler belgelenmiş → [`API.md`](API.md)

---

## Teknik Altyapı

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 16, React 19, TypeScript |
| 3D Grafik | Three.js, React Three Fiber, Drei |
| Oyun Motoru | Phaser (builder ve interaktif yüzeyler) |
| Stil | Tailwind CSS 4 |
| AI SDK'lar | Claude Agent SDK, Google Gemini, OpenAI |
| Gerçek Zamanlı | WebSocket (ws) |
| Ses | ElevenLabs TTS |
| Test | Vitest (unit), Playwright (e2e) |
| Sunucu | Node.js custom server (HTTP/HTTPS + WebSocket proxy) |

---

## Proje Yapısı

```
claw3d/
├── server/                    # Node.js backend
│   ├── index.js               # Ana sunucu (HTTP/HTTPS + Next.js)
│   ├── access-gate.js         # Token kimlik doğrulama
│   ├── gateway-proxy.js       # WebSocket proxy
│   ├── rate-limiter.js        # IP bazlı hız sınırlayıcı
│   ├── security-headers.js    # Güvenlik başlıkları middleware
│   ├── logger.js              # Yapılandırılmış JSON logger
│   ├── demo-gateway-adapter.js # Demo gateway
│   └── hermes-gateway-adapter.js # Hermes adaptörü
│
├── scripts/
│   ├── setup.js               # Otomatik kurulum wizard'ı
│   └── postinstall-hint.js    # npm install sonrası ipucu
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── office/            # Ana ofis arayüzü
│   │   └── api/               # API route'ları
│   │
│   ├── features/
│   │   ├── office/            # Ofis UI + paneller
│   │   ├── agents/            # Ajan bileşenleri + state
│   │   ├── onboarding/        # Başlangıç wizard'ı
│   │   ├── retro-office/      # 3D retro ofis
│   │   ├── company-builder/   # Şirket oluşturucu
│   │   └── spotify-jukebox/   # Müzik çalar
│   │
│   └── lib/
│       ├── i18n/              # Türkçe çeviriler (1280+ key)
│       ├── gateway/           # Gateway iletişimi
│       ├── studio/            # Studio ayarları
│       ├── notifications.ts   # Masaüstü bildirimleri
│       └── voiceReply/        # ElevenLabs TTS
│
├── tests/unit/                # Unit testler (Vitest)
├── public/
│   ├── favicon.svg            # SVG favicon
│   └── manifest.json          # PWA manifest
├── .github/workflows/ci.yml   # CI/CD pipeline
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose
├── API.md                     # API dokümantasyonu
├── .env.example               # Ortam değişkeni şablonu
└── package.json               # v0.1.4
```

---

## Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_GATEWAY_URL` | Varsayılan gateway URL (build-time) |
| `DEBUG` | OpenClaw konsolunu göster (varsayılan: true) |
| `PORT` / `HOST` | Sunucu adresi |
| `STUDIO_ACCESS_TOKEN` | Uzak erişim için token koruması |
| `ANTHROPIC_API_KEY` | Claude API anahtarı |
| `GEMINI_API_KEY` | Gemini API anahtarı |
| `OPENAI_API_KEY` | OpenAI API anahtarı |
| `ELEVENLABS_API_KEY` | Sesli yanıt için ElevenLabs |
| `RATE_LIMIT_MAX` | Pencere başına max istek (varsayılan: 100) |
| `RATE_LIMIT_WINDOW_MS` | Pencere süresi ms (varsayılan: 60000) |
| `LOG_LEVEL` | Log seviyesi: debug, info, warn, error (varsayılan: info) |
| `CORS_ORIGIN` | CORS izin verilen origin (boşsa CORS kapalı) |

Tüm değişkenler için: [`.env.example`](.env.example)

---

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run setup` | İnteraktif kurulum wizard'ı |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run demo-gateway` | Demo gateway başlat |
| `npm run hermes-adapter` | Hermes adaptörünü başlat |
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
# Tarayıcıda: http://localhost:3000
# Gateway URL: ws://localhost:18789
```

### Uzak Gateway + Yerel Studio (Tailscale)
```bash
# Gateway host'ta:
tailscale serve --yes --bg --https 443 http://127.0.0.1:18789
# Studio'da URL: wss://<gateway-host>.ts.net
```

### Uzak Gateway + Yerel Studio (SSH)
```bash
ssh -L 18789:127.0.0.1:18789 user@<gateway-host>
# Studio'da URL: ws://localhost:18789
```

### Demo Modu (Backend Gerekmez)
```bash
npm run dev
# Demo backend otomatik başlar
# Studio'da "Demo backend" seçin
```

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Connect başarısız | Gateway URL ve token'ı kontrol edin |
| `EPROTO` hatası | `wss://` yerine `ws://` deneyin (TLS olmayan endpoint) |
| `INVALID_REQUEST` | Gateway çok eski — güncelleyin veya demo kullanın |
| `401 Studio access token` | `STUDIO_ACCESS_TOKEN` ayarlı, cookie eksik |
| CLI bulunamadı | `npm run setup` çalıştırın |

---

## Lisans

MIT — Orijinal proje [iamlukethedev](https://github.com/iamlukethedev/Claw3D) tarafından geliştirilmiştir.

Bu sürüm [Cemal Demirci](https://cemal.cloud) tarafından genişletilmiştir.
