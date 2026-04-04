# Claw3D API Referansı

Tüm API endpoint'leri `/api/` altında çalışır. WebSocket gateway hariç tüm route'lar rate limiting'e tabidir.

---

## Sistem

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/health` | GET | Sunucu durumu, uptime, versiyon |

---

## Gateway

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/gateway/ws` | WebSocket | Gateway proxy (rate limit hariç) |
| `/api/gateway/agent-state` | GET/POST | Ajan yaşam döngüsü durumu |
| `/api/gateway/media` | POST | Medya yükleme (gateway üzerinden) |
| `/api/gateway/skills/remove` | POST | Yetenek kaldırma |

---

## Ofis

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/office` | GET/PUT | Ofis durumu okuma/yazma |
| `/api/office/layout` | GET/PUT | Ofis düzeni kaydetme/yükleme |
| `/api/office/publish` | POST | Ofis düzenini yayınlama |
| `/api/office/presence` | GET | Ajan varlık anlık görüntüsü |
| `/api/office/call` | POST | Ajan çağrısı başlatma |
| `/api/office/text` | POST | Metin mesajı gönderme |
| `/api/office/remote-message` | POST | Uzak ajana mesaj iletme |
| `/api/office/browser-preview` | GET | Tarayıcı önizleme proxy |
| `/api/office/github` | GET/POST | GitHub entegrasyonu |

---

## Ofis — Sesli

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/office/voice/transcribe` | POST | Ses kaydını metne çevirme (Whisper) |
| `/api/office/voice/reply` | POST | TTS sesli yanıt (ElevenLabs) |

---

## Ofis — Standup

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/office/standup/config` | GET/PUT | Standup yapılandırması |
| `/api/office/standup/meeting` | GET/POST | Toplantı yönetimi |
| `/api/office/standup/run` | POST | Standup çalıştırma |

---

## Studio

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/studio` | GET/PUT | Studio ayarları (gateway URL, token, tercihler) |
| `/api/studio/export` | GET | Tüm ayarları JSON olarak dışa aktar |
| `/api/studio/import` | POST | JSON dosyasından ayarları içe aktar |

---

## Diğer

| Yol | Metod | Açıklama |
|-----|-------|----------|
| `/api/task-store` | GET/POST/DELETE | Görev kalıcılık deposu |
| `/api/path-suggestions` | GET | Dosya yolu otomatik tamamlama |
| `/api/runtime/custom` | ALL | Özel runtime proxy (CORS bypass) |

---

## Rate Limiting

- Pencere: 60 saniye (varsayılan)
- Limit: 120 istek/pencere (varsayılan)
- Sadece `/api/*` route'larına uygulanır
- `/api/gateway/ws` (WebSocket) hariç
- `/health` hariç

Yanıt header'ları:
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 118
X-RateLimit-Reset: 1714000000
```

429 aşımında:
```json
{ "error": "Too many requests. Please try again later." }
```

Ortam değişkenleri:
- `RATE_LIMIT_WINDOW_MS` — Pencere süresi (ms, varsayılan: 60000)
- `RATE_LIMIT_MAX` — Pencere başına istek limiti (varsayılan: 120)

---

## Kimlik Doğrulama

`STUDIO_ACCESS_TOKEN` ayarlıysa:
- Tüm HTTP istekleri `studio_access` cookie'si gerektirir
- WebSocket upgrade istekleri aynı cookie'yi kontrol eder
- API isteklerinde 401 JSON hatası döner
- Sayfa isteklerinde 401 metin hatası döner

---

## Health Check

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok",
  "uptime": 3600,
  "startedAt": "2026-04-04T10:00:00.000Z",
  "version": "0.1.4"
}
```
