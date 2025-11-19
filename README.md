# TalkToAvatar - AI Avatar Video Creation & Language Learning App

Modern React Native (Expo) mobil uygulaması - Avatar'larla konuşma, metinden ses üretme, AI avatar video oluşturma, dil öğrenme (Sualingo) ve seyahat asistanı özellikleri.

## 🚀 Özellikler

### Core Features
- **Text-to-Speech**: OpenAI TTS ile çok dilli, doğal ses üretimi
- **Avatar to Video**: Fal.ai Kling AI ile avatar videoları oluşturma
- **Sualingo**: AI destekli dil öğrenme platformu (6 seviye, gerçek zamanlı telaffuz değerlendirmesi)
- **Travel Assistant**: Seyahat önerileri ve bilgilendirme
- **Custom Avatar Creation**: Google Gemini API ile özel avatar oluşturma
- **Multi-Language Support**: Otomatik çeviri ile çoklu dil desteği
- **Course Management**: Kurs oluşturma, yönetme ve ilerleme takibi
- **Notifications System**: Real-time bildirimler (video hazır olunca)
- **History Management**: Ses, video ve kayıt geçmişi yönetimi
- **Voice Recording**: Ses kaydı ile metin oluşturma (STT)
- **Modern UI**: Dark theme, glassmorphism efektleri, smooth animations

### Performance & Caching
- **React Query Integration**: Gelişmiş caching ve state management
- **Optimistic Updates**: Anında UI güncellemeleri
- **Background Sync**: Otomatik veri senkronizasyonu
- **70-80% API Call Reduction**: Cache sayesinde performans iyileştirmesi
- **90%+ Faster Tab Switches**: Cache hit ile anında veri gösterimi

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator / Android Emulator veya fiziksel cihaz
- Ruby 3.0+ (Backend için)
- PostgreSQL / Supabase (Backend database için)
- API Keys:
  - OpenAI API key (TTS ve STT için)
  - Fal.ai API key (Video oluşturma için)
  - Google AI API key (Custom avatar için)
  - Backend API endpoint (Sualingo ve Course management için)

## 🛠️ Kurulum

### 1. Projeyi İndirin

```bash
git clone <repository-url>
cd TalkToAvatar
```

### 2. Frontend Bağımlılıklarını Yükleyin

```bash
npm install
```

veya

```bash
yarn install
```

### 3. Backend Kurulumu

Backend için ayrı kurulum gereklidir. Detaylar için:
- [Backend Setup Guide](docs/BACKEND_SETUP_GUIDE.md)
- [Backend README](backend/README.md)

### 4. Environment Dosyasını Yapılandırın

Proje kök dizininde `.env` dosyası oluşturun:

```env
# OpenAI API (TTS ve STT için)
OPENAI_API_KEY=sk-XXXXX

# Fal.ai API (Video oluşturma için)
FAL_API_KEY=your-fal-api-key

# Google AI API (Custom avatar için)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Backend API (Sualingo ve Course management için)
RAILS_API_URL=http://localhost:3000/api/v1
# veya production URL
# RAILS_API_URL=https://your-api-domain.com/api/v1
```

### 5. API Key'leri Nasıl Alınır

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

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm start
```

veya

```bash
yarn start
```

### 7. Cihazda Çalıştırın

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
│   │   ├── CourseProgressCard.js
│   │   ├── ProgressBar.js
│   │   ├── PronunciationResult.js
│   │   ├── SkeletonComponents.js
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
│   │   ├── SualingoScreen.js      # Dil öğrenme ekranı
│   │   ├── CoursesScreen.js       # Kurs yönetimi ekranı
│   │   ├── CourseDetailScreen.js  # Kurs detay ekranı
│   │   ├── CoursePracticeScreen.js
│   │   ├── TravelAssistantScreen.js
│   │   ├── PastAudioListScreen.js
│   │   ├── PastVideosListScreen.js
│   │   ├── PastRecordingsListScreen.js
│   │   └── VideoViewingScreen.js
│   ├── services/               # API servisleri
│   │   ├── apiClient.js       # Centralized Axios instance
│   │   ├── openAI.js          # OpenAI TTS/STT
│   │   ├── falAI.js           # Fal.ai Video
│   │   ├── googleAI.js        # Google Gemini
│   │   ├── authAPI.js         # Authentication API
│   │   ├── audiosAPI.js       # Audios API
│   │   ├── videosAPI.js       # Videos API
│   │   ├── customAvatarsAPI.js # Custom Avatars API
│   │   ├── coursesAPI.js      # Course management API
│   │   ├── recordingsAPI.js   # Recording API
│   │   ├── reportsAPI.js      # Pronunciation reports API
│   │   ├── analysesAPI.js     # Performance analyses API
│   │   ├── practiceSentencesAPI.js # Practice sentences API
│   │   └── railsAPI.js        # Rails backend API
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCourseQueries.js      # React Query hooks for courses
│   │   ├── useCourseStatistics.js   # Computed statistics hook
│   │   ├── useCourseProgress.js     # Course progress hook
│   │   ├── useCourses.js            # Legacy courses hook
│   │   └── useUserData.js           # User data management
│   ├── context/                # React Context API
│   │   ├── AuthContext.js
│   │   ├── ToastContext.js
│   │   ├── NotificationContext.js
│   │   └── index.js
│   ├── navigation/             # Navigasyon yapılandırması
│   │   └── AppNavigator.js
│   ├── config/                 # Yapılandırma dosyaları
│   │   └── queryClient.js      # React Query configuration
│   ├── constants/              # Sabitler
│   │   ├── theme.js
│   │   ├── images.js
│   │   └── index.js
│   └── utils/                  # Utility fonksiyonları
│       ├── queryCacheLogger.js    # Cache logging & monitoring
│       ├── streakCalculator.js    # Streak calculation
│       ├── userStorage.js         # User storage utilities
│       ├── imageCache.js          # Image caching
│       ├── imageCompression.js    # Image compression
│       ├── backgroundQueue.js     # Background task queue
│       └── notificationMessages.js
├── backend/                     # Ruby on Rails backend
│   ├── app/
│   │   ├── controllers/        # API Controllers
│   │   │   └── api/v1/         # API v1 endpoints
│   │   ├── models/             # Database Models
│   │   ├── services/           # Business logic services
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
│   ├── docs/                   # Backend documentation
│   │   ├── API_DOCUMENTATION.md
│   │   ├── FFMPEG_SETUP.md
│   │   └── SUPABASE_SETUP.md
│   └── Gemfile                 # Ruby dependencies
├── database/                    # SQL scripts & schema
│   ├── database_schema.sql
│   ├── create_practice_sentences.sql
│   ├── insert_practice_sentences.sql
│   ├── insert_sentence_translations.sql
│   ├── supabase_notifications_setup.sql
│   └── supabase_security_fixes.sql
├── docs/                        # Documentation
│   ├── BACKEND_SETUP_GUIDE.md
│   ├── BackendDatabaseEntegrasyonDetail.md
│   ├── Details.md
│   └── falai.md
├── assets/                      # Görseller ve statik dosyalar
│   ├── logo.jpg
│   ├── icon.png
│   ├── man.gif
│   ├── woman.gif
│   ├── yusuf.jpg
│   └── eda.jpg
├── App.js                       # Ana uygulama giriş noktası
├── package.json
├── babel.config.js
├── app.json                     # Expo yapılandırması
├── CACHING_IMPLEMENTATION_SUMMARY.md  # Caching implementation details
├── COURSE_DATA_CACHING_PLAN.md         # Caching strategy plan
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

### Sualingo (Language Learning)
1. Welcome ekranından "Sualingo" modunu seçin
2. Dil ve seviye seçin (A1-C2)
3. Kurs oluşturun veya mevcut kursa katılın
4. Cümleleri dinleyin ve tekrar edin
5. Telaffuzunuzu kaydedin
6. AI gerçek zamanlı skor ve geri bildirim verir
7. İlerlemenizi takip edin (streak, completion rate, etc.)
8. Detaylı analizleri görüntüleyin

### Course Management
1. Courses ekranından yeni kurs oluşturun
2. Dil, seviye ve açıklama belirleyin
3. Kurs detay sayfasında:
   - Overview: Genel ilerleme ve istatistikler
   - Subjects: Konular ve cümleler
   - Recordings: Kayıt geçmişi
   - Reports: Telaffuz raporları
   - Analyses: Performans analizleri
4. Tab değişimlerinde cache'den anında veri gösterilir

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
- **RAILS_API_URL**: Backend API URL'i (Sualingo ve Course management için - gerekli)

## 💾 Veri Saklama

### AsyncStorage
Kullanıcı verileri yerel olarak AsyncStorage'da saklanır:
- Ses geçmişi (`@audio_history`)
- Video geçmişi (`@video_history`)
- Özel avatarlar (`@custom_avatars`)
- Bildirimler (`@notifications`)

### React Query Cache
- Course list ve detayları
- Subjects, recordings, reports, analyses
- Progress data
- Otomatik cache yönetimi (stale-while-revalidate)
- Background sync

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
- Desteklenen diller: İngilizce, Türkçe, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Arapça ve daha fazlası

### Sualingo Özellikleri
- 6 seviye (A1, A2, B1, B2, C1, C2)
- Gerçek zamanlı telaffuz değerlendirmesi
- Word-level hata analizi
- Streak tracking
- Progress tracking
- Performance analyses
- Topic-based learning

### React Query Caching
- Stale-while-revalidate pattern
- Optimistic updates
- Background refetch
- Automatic cache invalidation
- 70-80% API call reduction
- 90%+ faster tab switches

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

**Backend bağlantı hatası:**
- Backend sunucusunun çalıştığından emin olun
- `RAILS_API_URL` environment variable'ının doğru olduğunu kontrol edin
- CORS ayarlarını kontrol edin

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

**Cache sorunları:**
- React Query cache'ini temizlemek için uygulamayı yeniden başlatın
- Development mode'da cache logging aktif (console'da görülebilir)

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
- React Query cache logs: Console'da `🎯 [Cache]`, `📤 [API]`, `📊 [CacheStats]` prefix'leri ile görülebilir

## 📝 Notlar

- Expo SDK 54 kullanılmaktadır
- React Navigation v7 ile navigasyon yönetimi
- React Query v5 ile state management ve caching
- Context API ile global state (Auth, Toast, Notifications)
- AsyncStorage ile yerel veri saklama
- Ruby on Rails backend (API v1)
- Supabase PostgreSQL database
- Dark theme optimize edilmiş
- Cross-platform (iOS, Android, Web)
- Responsive tasarım

## 🗄️ Database

SQL script'leri `database/` klasöründe bulunmaktadır:
- `database_schema.sql` - Supabase database şeması
- `create_practice_sentences.sql` - Practice sentences oluşturma
- `insert_practice_sentences.sql` - Sualingo cümle verileri
- `insert_sentence_translations.sql` - Cümle çevirileri
- `supabase_notifications_setup.sql` - Bildirim sistemi kurulumu
- `supabase_security_fixes.sql` - Güvenlik yapılandırması

## 🔐 Güvenlik

- API key'ler `.env` dosyasında saklanır (git'e eklenmez)
- `.gitignore` dosyasında `.env` tanımlıdır
- Production'da API key'leri güvenli sunucuda saklayın
- Client-side'da API key'leri expose etmekten kaçının
- JWT token'lar AsyncStorage'da güvenli saklanır
- Backend API authentication gereklidir

## 📱 Desteklenen Platformlar

- ✅ iOS (Expo Go, Standalone)
- ✅ Android (Expo Go, Standalone)
- ✅ Web (Sınırlı özellikler)

## 🎯 Gelecek Özellikler

- [ ] Cloud storage entegrasyonu
- [ ] Çoklu avatar ile video
- [ ] Sosyal medya paylaşımı
- [ ] Premium özellikler
- [ ] Offline mod desteği (AsyncStorage persistence)
- [ ] Advanced analytics dashboard
- [ ] Social features (leaderboard, challenges)
- [ ] Voice cloning

## 📝 Lisans

Internal development and testing only.

## 👨‍💻 Geliştirici

Sadıkcan TULUK - sadikcantuluk@gmail.com

## 🤝 Katkıda Bulunma

Bu proje TalkToAvatar mobil uygulamasının bir parçasıdır. Mevcut kod tabanında belirlenen kodlama standartlarına ve bileşen pattern'lerine uyun.

---

**Not**: Bu uygulama geliştirme aşamasındadır. Production kullanımı için ek güvenlik ve optimizasyonlar gereklidir.
