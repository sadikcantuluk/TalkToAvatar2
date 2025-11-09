# 🚀 TalkToAvatar Backend & Database Kurulum Rehberi

## 📋 İçindekiler
1. [Gereksinimler](#gereksinimler)
2. [Supabase Kurulumu](#supabase-kurulumu)
3. [Rails Backend Kurulumu](#rails-backend-kurulumu)
4. [Email Yapılandırması](#email-yapılandırması)
5. [Frontend Yapılandırması](#frontend-yapılandırması)
6. [Test ve Çalıştırma](#test-ve-çalıştırma)
7. [Sorun Giderme](#sorun-giderme)

---

## 🔧 Gereksinimler

### Backend Gereksinimleri
- Ruby 3.2.x veya üzeri
- Rails 7.1.x veya üzeri
- PostgreSQL (Supabase aracılığıyla)
- Bundler

### Frontend Gereksinimleri
- Node.js 16.x veya üzeri
- npm veya yarn
- Expo CLI
- React Native environment

---

## 🗄️ Supabase Kurulumu

### 1. Supabase Projesi Oluşturma
1. [Supabase](https://supabase.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. Proje adı, database password ve region seçin
4. "Create new project" butonuna tıklayın

### 2. Veritabanı Schema Oluşturma
1. Supabase Dashboard'da sol menüden **SQL Editor**'ü açın
2. "New query" butonuna tıklayın
3. `database_schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayın

### 3. Connection String Alma
1. Sol menüden **Project Settings** > **Database** seçin
2. **Connection string** bölümünden **URI** formatını kopyalayın
3. `[YOUR-PASSWORD]` kısmını database password'ünüzle değiştirin

### 4. API Keys Alma
1. Sol menüden **Project Settings** > **API** seçin
2. **Project URL** ve **anon public** key'i kopyalayın

---

## 🛠️ Rails Backend Kurulumu

### 1. Ruby Kurulumu (Windows)
```bash
# RubyInstaller kullanarak: https://rubyinstaller.org/
# Ruby 3.2.2 sürümünü indirin ve kurun

# Versiyon kontrolü
ruby -v
# => ruby 3.2.2
```

### 2. Rails Kurulumu
```bash
# Rails gem'ini yükleyin
gem install rails

# Versiyon kontrolü
rails -v
# => Rails 7.1.x
```

### 3. Backend Klasörüne Gidin
```bash
cd backend
```

### 4. Bağımlılıkları Yükleyin
```bash
# Gemfile'daki tüm gem'leri yükleyin
bundle install
```

### 5. Environment Variables Ayarlayın
Backend klasöründe `.env` dosyası oluşturun:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_API_KEY=your_supabase_api_key
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres

# Email Configuration (Gmail SMTP)
MAIL_ADDRESS=your-email@gmail.com
MAIL_APP_PASSWORD=your-16-digit-app-password

# OpenAI API (Telaffuz değerlendirmesi için)
OPENAI_API_KEY=your_openai_api_key

# Rails Configuration
RAILS_ENV=development
SECRET_KEY_BASE=generate_with_rails_secret_command

# Frontend URL (Password reset için)
FRONTEND_URL=http://localhost:8081
```

### 6. Secret Key Base Oluşturma
```bash
# Secret key oluşturun
rails secret

# Çıktıyı kopyalayın ve .env dosyasına SECRET_KEY_BASE olarak ekleyin
```

---

## 📧 Email Yapılandırması

### Gmail App Password Oluşturma

1. **Google Hesabınıza gidin**: https://myaccount.google.com
2. **Güvenlik** bölümüne tıklayın
3. **2 Adımlı Doğrulama**'yı aktif edin (eğer değilse)
4. Arama kutusuna "Uygulama Şifreleri" yazın veya direkt bu linke gidin:
   https://myaccount.google.com/apppasswords
5. "Uygulama seç" dropdown'ından "Mail" seçin
6. "Cihaz seç" dropdown'ından "Diğer" seçin ve "Rails App" yazın
7. **Oluştur** butonuna tıklayın
8. Görünen 16 haneli şifreyi kopyalayın (boşluklar olmadan)
9. Bu şifreyi `.env` dosyasında `MAIL_APP_PASSWORD` olarak ekleyin

### Email Test Etme
Rails console'da email testi yapabilirsiniz:
```ruby
rails console

# Test email gönderme
UserMailer.email_verification(User.first, "123456").deliver_now
```

---

## 🎨 Frontend Yapılandırması

### 1. Bağımlılıkları Yükleyin
```bash
# Proje root dizininde
npm install
# veya
yarn install
```

### 2. Environment Variables
Proje root'unda `.env` dosyası oluşturun veya güncelleyin:

```env
# Supabase (eğer kullanacaksanız)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Rails API URL
RAILS_API_URL=http://localhost:3000/api/v1

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# FAL AI API
FAL_API_KEY=your_fal_api_key

# Google AI API
GOOGLE_AI_API_KEY=your_google_ai_key
```

**Not**: React Native'de `.env` dosyası çalışmıyor. `process.env` yerine direkt string olarak yazmanız gerekebilir veya `react-native-dotenv` kullanabilirsiniz.

#### React Native Dotenv Kurulumu (İsteğe Bağlı)
```bash
npm install react-native-dotenv
```

`babel.config.js` dosyasını güncelleyin:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ]
  };
};
```

Sonra `src/services/authAPI.js`'de kullanın:
```javascript
import { RAILS_API_URL } from '@env';

const API_URL = RAILS_API_URL || 'http://localhost:3000/api/v1';
```

---

## 🚀 Test ve Çalıştırma

### Backend Başlatma
```bash
cd backend

# Development modunda başlatma
rails server

# Veya belirli bir port'ta
rails server -p 3000
```

Backend şu adreste çalışacak: `http://localhost:3000`

### API Endpoint Testleri

#### Health Check
```bash
curl http://localhost:3000/health
# => OK
```

#### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "username": "testuser",
      "email": "test@example.com",
      "password": "Test1234"
    }
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "auth": {
      "email": "test@example.com",
      "password": "Test1234"
    }
  }'
```

### Frontend Başlatma
```bash
# Proje root dizininde
npm start
# veya
expo start

# Telefonda test etmek için
# - Expo Go uygulamasını indirin
# - QR kodu tarayın
```

---

## 🐛 Sorun Giderme

### Backend Sorunları

#### 1. Gem Install Hataları
```bash
# Bundler'ı güncelleyin
gem update bundler

# Cache temizleme
bundle clean --force

# Tekrar yükleme
bundle install
```

#### 2. Database Connection Hatası
- `.env` dosyasındaki `DATABASE_URL`'in doğru olduğundan emin olun
- Supabase projenizin aktif olduğunu kontrol edin
- Password'ün doğru olduğundan emin olun

#### 3. Email Gönderme Hatası
- Gmail App Password'ün doğru olduğundan emin olun
- 2 Adımlı Doğrulama'nın aktif olduğunu kontrol edin
- SMTP ayarlarının doğru olduğunu kontrol edin

#### 4. JWT Token Hatası
```bash
# Yeni secret key oluşturun
rails secret

# .env dosyasında SECRET_KEY_BASE'i güncelleyin
```

### Frontend Sorunları

#### 1. API Connection Hatası
- Backend'in çalıştığından emin olun (`http://localhost:3000`)
- `src/services/authAPI.js`'deki API_URL'in doğru olduğunu kontrol edin
- CORS hatası alıyorsanız: `backend/config/initializers/cors.rb` dosyasını kontrol edin

#### 2. AsyncStorage Hatası
```bash
# AsyncStorage paketini yeniden yükleyin
npm install @react-native-async-storage/async-storage
```

#### 3. Navigation Hatası
```bash
# Navigation paketlerini yeniden yükleyin
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

---

## 📱 Önemli Notlar

### Güvenlik
- ⚠️ **Asla** `.env` dosyasını git'e commit etmeyin
- Production'da güçlü SECRET_KEY_BASE kullanın
- CORS ayarlarını production'da sıkılaştırın

### Development
- Backend: `http://localhost:3000`
- Frontend: Expo'nun verdiği dinamik URL (genellikle `http://192.168.x.x:8081`)

### Production
- Heroku, Railway veya Render'a deploy edebilirsiniz
- Environment variables'ı production ortamında ayarlayın
- HTTPS kullanın
- Database backup alın

---

## 🎯 Sonraki Adımlar

✅ Backend ve database kurulumu tamamlandı
✅ Authentication sistemi hazır
✅ Frontend entegrasyonu yapıldı

Şimdi yapabilecekleriniz:
1. Sualingo modu API'lerini test edin
2. Diğer modları entegre edin (TTS, Video, Travel Assistant)
3. Profil sayfasını özelleştirin
4. UI/UX iyileştirmeleri yapın

---

## 📚 Kaynaklar

- [Ruby on Rails Guides](https://guides.rubyonrails.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

---

## 💡 Yardım

Sorunlarla karşılaşırsanız:
1. Bu README'deki Sorun Giderme bölümüne bakın
2. Backend loglarını kontrol edin: `backend/log/development.log`
3. Frontend console'u kontrol edin
4. Supabase Dashboard'da database'i kontrol edin

**İyi çalışmalar! 🚀**

