# Gelistirme Yol Haritasi

3DAgent'in kisa ve orta vadeli gelistirme plani.

---

## v0.2 — Simdiki Oncelikler

### Tamamlandi
- [x] Gorsel kurulum ekrani (CLI yerine 3 adimli kart tasarimi)
- [x] PWA destegi (Serwist service worker, cevrimdisi sayfa, guncelleme banner'i)
- [x] Turkce lokalizasyon (1300+ ceviri anahtari)
- [x] Turk mitolojisi temali 6 preset ajan (Asena, Umay, Kayra, Erlik, Tulpar, Tengri)
- [x] Sirket kurma ekrani tam Turkce (isim, rol, sorumluluk, kisilik uretimi)
- [x] Demo gateway mock AI yanitlari (dogal Turkce, karakter odakli)
- [x] GROQ API key entegrasyonu (env + UI)
- [x] Ses transkripsiyon (Groq Whisper) + TTS (ElevenLabs)
- [x] Kanban panosu duzeltmesi
- [x] Ajan tanitim ekrani (rol, uzmanlik alanlari, kisilik ozeti)
- [x] Chat input genislik duzeltmesi
- [x] Guvenlik basliklari, rate limiting, structured logging
- [x] Docker + CI/CD pipeline
- [x] Erisim kapisi (access gate) ekrani

### Devam Eden
- [ ] Runtime guvenilirlik iyilestirmeleri (gateway event handling, transport recovery)
- [ ] Ofis mimarisi sadeslestirme (merkezi intent katmani)
- [ ] Acik kaynak hazirlik (dokumantasyon, CI, public-safe defaults)

---

## v0.3 — Toplanti ve Is Birligi

### Toplanti / Broadcast Modu
- [ ] Tum ekiple tek seferde konusma (toplanti masasi)
- [ ] Ana konulari tek seferde verip is paylasimi yapma
- [ ] Toplanti ozetleme ve karar kaydi
- [ ] Ajan arasi gorev delegasyonu

### Ajan Iliskiler Haritasi
- [ ] Hangi ajanlar birbirleriyle is birligi yapiyor — gorsel harita
- [ ] Is teslimi (handoff) yapılandirmasi
- [ ] Otomatik yonlendirme kurallari

### Paylasimli Hafiza
- [ ] Ajanlar arasi paylasilan baglam (cross-agent MEMORY.md)
- [ ] Sirket genelinde bilgi tabani

---

## v0.4 — Gelismis Otomasyon

### Coklu Ajan Orkestrasyon
- [ ] Sirali is akislari (PM → Gelistirici → QA)
- [ ] Paralel gorev dagitimi
- [ ] Otomatik handoff tetikleyicileri

### Gorsel Ofis Otomasyonu
- [ ] Tekrarlayan davranislari ofis uzerinden yapilandirma
- [ ] Oda bazli otomatik aksiyonlar
- [ ] Olay tetiklemeli is akislari

### Heartbeat Builder
- [ ] Zamanlanmis otomasyonlari tek UI'da birlestirme
- [ ] HEARTBEAT.md + playbook + cron birlesimi
- [ ] Rehberli kurulum arayuzu

---

## v0.5 — Platform Olgunlasma

### Sablon ve Preset Kutuphanesi
- [ ] Yeniden kullanilabilir ajan sablonlari
- [ ] Prompt ve playbook kutuphanesi
- [ ] Topluluk sablonlari

### Filo Yonetim Matrisi
- [ ] Toplu ajan izin kontrolu
- [ ] Fleet genelinde arac erisim matrisi

### Saglik Panosu
- [ ] Gateway durumu, basarisiz calistirilmalar, heartbeat sorunlari
- [ ] Bagimlilik ve entegrasyon kontrolleri
- [ ] Tek operasyonel gorunum

### Config Diff ve Rollback
- [ ] Gateway yapilandirma degisikliklerini inceleme
- [ ] Guvenli geri alma

---

## Urun Fikirleri (Backlog)

- Konusmadan ajan olusturma (basarili sohbet → yeni ajan)
- Senaryo simulatoru (coklu ajan prova ve test)
- Paylasimli kullanici profil merkezi (USER.md senkronizasyonu)
- Gercek ajan inbox'u ve gorev kuyrugu
- Yetenek installer uyumluluk kontrolleri genisletmesi
- Daha zengin dunya olusturma araclari

---

## Katki Icin Iyi Baslangic Alanlari

- Dokumantasyon ve gelistirici onboarding iyilestirmeleri
- Unit test eklemeleri (runtime workflow, ofis intent)
- Tek ozellik alaninda UI polish
- Eski ornekleri ve placeholder metinleri guncelleme

## Buyuk Calismalardan Once

- `README.md`, `CODE_DOCUMENTATION.md` ve `KNOWN_ISSUES.md` okuyun
- Buyuk mimari degisikliklerden once GitHub issue acin veya baglantin
