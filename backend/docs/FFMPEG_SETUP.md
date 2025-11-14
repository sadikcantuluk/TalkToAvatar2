# FFmpeg Kurulum Rehberi

## FFmpeg Nedir?

FFmpeg, ses ve video dosyalarını dönüştürmek için kullanılan bir sistem aracıdır. Ruby gem'i değildir, sistem seviyesinde kurulması gerekir.

## Neden Gerekiyor?

Azure Speech API, ses dosyalarını WAV formatında, 16kHz sample rate ve mono kanal olarak bekler. Mobil cihazlardan gelen `.m4a` dosyalarını bu formata dönüştürmek için FFmpeg kullanıyoruz.

## Kurulum Talimatları

### Windows (Development)

1. **FFmpeg İndir:**
   - https://www.gyan.dev/ffmpeg/builds/ adresinden indirin
   - "ffmpeg-release-essentials.zip" dosyasını indirin

2. **Kurulum:**
   - ZIP dosyasını açın (örneğin `C:\ffmpeg` klasörüne)
   - `bin` klasörünün yolunu kopyalayın (örneğin: `C:\ffmpeg\bin`)

3. **PATH'e Ekle:**
   - Windows arama çubuğuna "Environment Variables" yazın
   - "Edit the system environment variables" seçin
   - "Environment Variables" butonuna tıklayın
   - "System variables" altında "Path" seçin ve "Edit" tıklayın
   - "New" tıklayın ve FFmpeg bin klasörünün yolunu yapıştırın (örn: `C:\ffmpeg\bin`)
   - Tüm pencereleri "OK" ile kapatın

4. **Kontrol Et:**
   ```powershell
   # Yeni bir PowerShell/Terminal açın ve şunu çalıştırın:
   ffmpeg -version
   ```
   Eğer FFmpeg versiyonu görünüyorsa, kurulum başarılı!

### macOS (Development)

```bash
# Homebrew ile kurulum (en kolay yöntem)
brew install ffmpeg

# Kontrol et
ffmpeg -version
```

### Linux / Ubuntu / Debian (Development & Production)

```bash
# APT ile kurulum
sudo apt-get update
sudo apt-get install -y ffmpeg

# Kontrol et
ffmpeg -version
```

### Production Sunucuları

#### Heroku
Heroku'da FFmpeg kurulumu için `Aptfile` oluşturun:

1. Backend klasöründe `Aptfile` adında bir dosya oluşturun:
   ```
   ffmpeg
   ```

2. Heroku buildpack ekleyin:
   ```bash
   heroku buildpacks:add --index 1 heroku-community/apt
   ```

3. Deploy edin:
   ```bash
   git add Aptfile
   git commit -m "Add FFmpeg support"
   git push heroku main
   ```

#### Railway
Railway otomatik olarak FFmpeg'i algılar. Eğer çalışmazsa, `railway.json` dosyası oluşturun:

```json
{
  "build": {
    "builder": "NIXPACKS"
  }
}
```

#### Render / AWS / DigitalOcean
Sunucuya SSH ile bağlanıp yukarıdaki Linux kurulum komutlarını çalıştırın.

#### Docker (Eğer Docker kullanıyorsanız)

`Dockerfile`'a ekleyin:

```dockerfile
# Ubuntu/Debian base image için
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Alpine base image için
RUN apk add --no-cache ffmpeg
```

## FFmpeg Olmadan Çalışır mı?

**Evet, çalışır!** Ancak:

- ✅ Kod çalışmaya devam eder
- ⚠️ `.m4a` dosyaları WAV'a dönüştürülmez
- ⚠️ Azure API'ye orijinal format gönderilir (bazı durumlarda hata verebilir)
- ✅ Fallback mekanizması devreye girer

## Test Etme

Rails console'da test edebilirsiniz:

```ruby
# Rails console açın
rails console

# FFmpeg'in kurulu olup olmadığını kontrol edin
system('which ffmpeg')
# => "/usr/bin/ffmpeg" (kuruluysa yol gösterir)
# => nil (kurulu değilse)

# Veya
system('ffmpeg -version')
# => true (kuruluysa)
# => false (kurulu değilse)
```

## Sorun Giderme

### "FFmpeg not found" Hatası

1. FFmpeg'in kurulu olduğundan emin olun:
   ```bash
   which ffmpeg
   ffmpeg -version
   ```

2. PATH değişkenini kontrol edin:
   ```bash
   echo $PATH  # Linux/macOS
   echo %PATH% # Windows
   ```

3. Rails sunucusunu yeniden başlatın (PATH değişiklikleri için)

### "Permission denied" Hatası

FFmpeg'in çalıştırılabilir olduğundan emin olun:
```bash
chmod +x /usr/bin/ffmpeg  # Linux/macOS
```

### Production'da Çalışmıyor

- Sunucuya SSH ile bağlanıp FFmpeg'in kurulu olduğunu kontrol edin
- Buildpack'lerin doğru yapılandırıldığından emin olun
- Log dosyalarını kontrol edin: `tail -f log/production.log`

## Özet

- ✅ **Rails tarafında ek bir şey yapmanıza gerek yok** - kod hazır
- ✅ **Sadece sistem seviyesinde FFmpeg kurmanız yeterli**
- ✅ **FFmpeg yoksa da çalışır** (fallback mekanizması var)
- ✅ **Production'da hosting sağlayıcınızın dokümantasyonuna bakın**

