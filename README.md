# TalkToAvatar - AI Avatar Video Creation App

Modern React Native (Expo) mobil uygulaması - Avatar'larla konuşma, metinden ses üretme, AI avatar video oluşturma ve seyahat asistanı özellikleri.

## 🚀 Özellikler

- **Text-to-Speech**: OpenAI TTS ile çok dilli, doğal ses üretimi
- **Avatar to Video**: Fal.ai Kling AI ile avatar videoları oluşturma
- **Travel Assistant**: Seyahat önerileri ve bilgilendirme
- **Custom Avatar Creation**: Google Gemini API ile özel avatar oluşturma
- **Multi-Language Support**: Otomatik çeviri ile çoklu dil desteği
- **Notifications System**: Real-time bildirimler (video hazır olunca)
- **History Management**: Ses ve video geçmişi yönetimi
- **Voice Recording**: Ses kaydı ile metin oluşturma (STT)
- **Modern UI**: Dark theme, glassmorphism efektleri, smooth animations

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator / Android Emulator veya fiziksel cihaz
- API Keys:
  - OpenAI API key (TTS ve STT için)
  - Fal.ai API key (Video oluşturma için)
  - Google AI API key (Custom avatar için)

## 🛠️ Kurulum

### 1. Projeyi İndirin

```bash
git clone <repository-url>
cd TalkToAvatar
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

veya

```bash
yarn install
```

### 3. Environment Dosyasını Yapılandırın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# OpenAI API (TTS ve STT için)
OPENAI_API_KEY=sk-XXXXX

# Fal.ai API (Video oluşturma için)
FAL_API_KEY=your-fal-api-key

# Google AI API (Custom avatar için)
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 4. API Key'leri Nasıl Alınır

**OpenAI API Key:**
1. https://platform.openai.com/api-keys adresine gidin
2. Hesap oluşturun veya giriş yapın
3. "Create new secret key" butonuna tıklayın
4. API key'i kopyalayın ve `.env` dosyasına ekleyin

**Fal.ai API Key:**
1. https://fal.ai/ adresine gidin
2. Hesap oluşturun
3. Dashboard'dan API Key oluşturun
4. API key'i `.env` dosyasına ekleyin

**Google AI API Key:**
1. https://aistudio.google.com/app/apikey adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API key'i `.env` dosyasına ekleyin

### 5. Geliştirme Sunucusunu Başlatın

```bash
npm start
```

veya

```bash
yarn start
```

### 6. Cihazda Çalıştırın

- **iOS**: Terminal'de `i` tuşuna basın veya Expo Go uygulamasıyla QR kodu tarayın
- **Android**: Terminal'de `a` tuşuna basın veya Expo Go uygulamasıyla QR kodu tarayın
- **Web**: Terminal'de `w` tuşuna basın

## 📁 Proje Yapısı

```
TalkToAvatar/
├── src/
│   ├── components/              # Yeniden kullanılabilir bileşenler
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Header.js
│   │   ├── AvatarCard.js
│   │   ├── Toast.js
│   │   ├── ConfirmDialog.js
│   │   ├── ValidationMessage.js
│   │   ├── LanguageSelector.js
│   │   ├── VoiceSelector.js
│   │   ├── DashboardLayout.js
│   │   └── LoadingDots.js
│   ├── screens/                 # Uygulama ekranları
│   │   ├── SplashScreen.js
│   │   ├── WelcomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── ProfileScreen.js
│   │   ├── SelectAvatarScreen.js
│   │   ├── CreateCustomAvatarScreen.js
│   │   ├── TextToSpeechScreen.js
│   │   ├── AvatarToVideoScreen.js
│   │   ├── SualingoScreen.js
│   │   ├── TravelAssistantScreen.js
│   │   ├── PastAudioListScreen.js
│   │   ├── PastVideosListScreen.js
│   │   └── VideoViewingScreen.js
│   ├── services/               # API servisleri
│   │   ├── apiClient.js       # Centralized Axios instance
│   │   ├── openAI.js          # OpenAI TTS/STT
│   │   ├── falAI.js           # Fal.ai Video
│   │   ├── googleAI.js        # Google Gemini
│   │   ├── authAPI.js         # Authentication API
│   │   ├── audiosAPI.js       # Audios API
│   │   ├── videosAPI.js       # Videos API
│   │   └── customAvatarsAPI.js # Custom Avatars API
│   ├── context/                # React Context API
│   │   ├── AuthContext.js
│   │   ├── ToastContext.js
│   │   ├── NotificationContext.js
│   │   └── index.js
│   ├── navigation/             # Navigasyon yapılandırması
│   │   └── AppNavigator.js
│   ├── constants/              # Sabitler
│   │   ├── theme.js
│   │   ├── images.js
│   │   └── index.js
│   └── utils/                  # Utility fonksiyonları
│       └── notificationMessages.js
├── backend/                     # Ruby on Rails backend
│   ├── app/
│   │   ├── controllers/        # API Controllers
│   │   ├── models/             # Database Models
│   │   ├── mailers/            # Email mailers
│   │   └── views/              # Email templates
│   ├── config/                 # Rails configuration
│   │   ├── database.yml
│   │   ├── routes.rb
│   │   └── initializers/
│   ├── db/                     # Database migrations & seeds
│   │   ├── migrate/
│   │   ├── schema.rb
│   │   └── seeds.rb
│   └── Gemfile                 # Ruby dependencies
├── database/                    # SQL scripts & schema
│   ├── database_schema.sql
│   ├── insert_sentence_translations.sql
│   ├── supabase_notifications_setup.sql
│   └── supabase_security_fixes.sql
├── docs/                        # Documentation
│   ├── BACKEND_SETUP_GUIDE.md
│   ├── BackendDatabaseEntegrasyonDetail.md
│   ├── Details.md
│   ├── falai.md
│   ├── talkToAvatariyilestirme.md
│   └── ... (other documentation files)
├── assets/                      # Görseller ve statik dosyalar
│   ├── logo.png
│   ├── icon.png
│   ├── man.gif
│   ├── woman.gif
│   ├── yusuf.jpg
│   └── eda.jpg
├── App.js                       # Ana uygulama giriş noktası
├── package.json
├── babel.config.js
├── app.json                     # Expo yapılandırması
└── .env                         # Environment değişkenleri (git'e eklemeyin!)
```

## 🎯 Kullanım

### Text-to-Speech Mode
1. Avatar seçin (varsayılan veya özel)
2. Metin girin veya ses kaydedin
3. Ses ve dil seçin
4. Ses dosyası oluşturun
5. Oynatın veya geçmişe kaydedin

### Avatar to Video Mode
1. Avatar seçin
2. Video için metin yazın
3. Ses ve dil seçin (metin otomatik çevrilir)
4. Video adı girin
5. Video oluşturun (2-5 dakika)
6. Video hazır olunca bildirim alın
7. Videoyu izleyin veya galeriye kaydedin

### Travel Assistant Mode
1. Seyahat planınız hakkında konuşun veya yazın
2. AI asistanı öneriler sunar
3. Ses kayıtlarını dinleyin
4. Geçmiş konuşmaları görüntüleyin

### Custom Avatar Creation
1. "Create Custom Avatar" butonuna tıklayın
2. Fotoğraf yükleyin
3. Avatar adı girin
4. AI avatar oluşturun
5. Özel avatarınızı kullanın

## 🔧 Yapılandırma

Tüm yapılandırma ayarları `.env` dosyasında tutulur:

- **OPENAI_API_KEY**: OpenAI API anahtarı (TTS ve STT için - gerekli)
- **FAL_API_KEY**: Fal.ai API anahtarı (Video oluşturma için - gerekli)
- **GOOGLE_AI_API_KEY**: Google AI API anahtarı (Custom avatar için - gerekli)

## 💾 Veri Saklama

### AsyncStorage
Kullanıcı verileri yerel olarak AsyncStorage'da saklanır:
- Ses geçmişi (`@audio_history`)
- Video geçmişi (`@video_history`)
- Özel avatarlar (`@custom_avatars`)
- Bildirimler (`@notifications`)

### Dosya Saklama
- Ses dosyaları: `FileSystem.documentDirectory` (geçici)
- Video dosyaları: `FileSystem.documentDirectory` (geçici)
- Export: Galeriye kaydedilen dosyalar

### Bildirimler
- Real-time bildirim sistemi (Context API)
- Video hazır olunca otomatik bildirim
- Okundu/okunmadı takibi
- AsyncStorage ile kalıcı saklama

## 🎨 Özellikler Detayları

### Çok Dilli Destek
- Otomatik çeviri (OpenAI GPT)
- Seçilen dile göre metin çevirisi
- Video prompt'u otomatik çevrilmiş metinle oluşturulur
- Desteklenen diller: İngilizce, Türkçe, Almanca, Fransızca, İspanyolca, ve daha fazlası

### Bildirim Sistemi
- Real-time bildirimler (Context API)
- Video hazır olunca otomatik bildirim
- Header'da kırmızı badge ile okunmamış sayısı
- Modal ile bildirimleri görüntüleme
- Okunmuş/okunmamış ayrımı
- Bildirime tıklayınca ilgili sayfaya yönlendirme

### Video İşleme
- Fal.ai Kling AI ile profesyonel video oluşturma
- Avatar + Ses + Metin kombinasyonu
- Video hazır olunca bildirim
- Video oynatıcı (tekrar oynatma desteği)
- Galeriye export

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**"Module not found" hatası:**
```bash
# node_modules'ı temizleyip yeniden yükleyin
rm -rf node_modules
npm install
```

**API Key hatası:**
- `.env` dosyasında API key'lerin doğru yazıldığından emin olun
- `react-native-dotenv` yapılandırmasını kontrol edin
- API key'lerin geçerli olduğunu kontrol edin

**Video oluşturma hatası:**
- Fal.ai API key'inin geçerli olduğundan emin olun
- İnternet bağlantısını kontrol edin
- Video oluşturma 2-5 dakika sürebilir, bekleyin

**Ses kaydedilemiyor:**
- Cihaz izinlerini kontrol edin
- Microphone izni verildiğinden emin olun

**Bildirimler görünmüyor:**
- AsyncStorage izinlerini kontrol edin
- Uygulamayı yeniden başlatın

### Geliştirme İpuçları

**Cache temizleme:**
```bash
# Expo cache'i temizle
npx expo start -c

# Metro bundler cache'i temizle
npm start -- --reset-cache
```

**Log görüntüleme:**
- iOS: Simulator'da logları görmek için `⌘ + D` → "Debug"
- Android: `adb logcat` komutu ile logları görüntüleyin

## 📝 Notlar

- Expo SDK 54 kullanılmaktadır
- React Navigation v7 ile navigasyon yönetimi
- Context API ile state management (Auth, Toast, Notifications)
- AsyncStorage ile yerel veri saklama
- Ruby on Rails backend (API v1)
- Supabase PostgreSQL database
- Dark theme optimize edilmiş
- Cross-platform (iOS, Android, Web)
- Responsive tasarım

## 📚 Dokümantasyon

Detaylı dokümantasyon için `docs/` klasörüne bakın:
- [Backend Setup Guide](docs/BACKEND_SETUP_GUIDE.md) - Rails backend kurulum ve yapılandırma
- [Database Integration Details](docs/BackendDatabaseEntegrasyonDetail.md) - Supabase entegrasyon detayları
- [Project Details](docs/Details.md) - Proje detayları ve özellikler
- [Fal.ai Integration](docs/falai.md) - Video API entegrasyonu
- [Improvement Plan](docs/talkToAvatariyilestirme.md) - Proje iyileştirme planı

## 🗄️ Database

SQL script'leri `database/` klasöründe bulunmaktadır:
- `database_schema.sql` - Supabase database şeması
- `insert_sentence_translations.sql` - Sualingo cümle çevirileri
- `supabase_notifications_setup.sql` - Bildirim sistemi kurulumu
- `supabase_security_fixes.sql` - Güvenlik yapılandırması

## 🔐 Güvenlik

- API key'ler `.env` dosyasında saklanır (git'e eklenmez)
- `.gitignore` dosyasında `.env` tanımlıdır
- Production'da API key'leri güvenli sunucuda saklayın
- Client-side'da API key'leri expose etmekten kaçının

## 📱 Desteklenen Platformlar

- ✅ iOS (Expo Go, Standalone)
- ✅ Android (Expo Go, Standalone)
- ✅ Web (Sınırlı özellikler)

## 🎯 Gelecek Özellikler

- [ ] Cloud storage entegrasyonu
- [ ] Çoklu avatar ile video
- [ ] Sosyal medya paylaşımı
- [ ] Premium özellikler
- [ ] Offline mod desteği

## 📝 Lisans

Internal development and testing only.

## 👨‍💻 Geliştirici

Sadıkcan TULUK - sadikcantuluk@gmail.com

## 🤝 Katkıda Bulunma

Bu proje TalkToAvatar mobil uygulamasının bir parçasıdır. Mevcut kod tabanında belirlenen kodlama standartlarına ve bileşen pattern'lerine uyun.

---

**Not**: Bu uygulama geliştirme aşamasındadır. Production kullanımı için ek güvenlik ve optimizasyonlar gereklidir.
