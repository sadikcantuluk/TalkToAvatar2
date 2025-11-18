# Backend Ödev Gereksinimleri — Teknik İnceleme Dokümanı

Bu doküman, mevcut Ruby on Rails (API Only) backend yapımın, ödevin gerektirdiği tüm adımları karşılayıp karşılamadığını analiz etmesi için hazırlanmıştır. Lütfen aşağıdaki kontrol listesine göre tüm backend kodumu incele.

---

## 📌 1. Rails API Only Yapısı
**Kontrol et:**
- Proje `--api` modunda mı başlatılmış?
- Gereksiz view katmanları (erb, helpers, assets) var mı?
- Controllers sadece JSON döndürüyor mu?
- Response yapısı REST kurallarına uygun mu?

---

## 📌 2. Model (UML) Gereksinimleri
Ödev gereği en az 5 model olmalı. Burada sadece model sayısına ve model yapılarına
odaklan. Projeye göre model tipleri değişebilir.

**Beklenen modeller:**
- User  
- Course  
- Subject  
- Video  
- Report  
- Analysis

**Kontrol et:**
- Tüm bu modeller gerçekten mevcut mu?
- Her modelin migration dosyaları doğru mu?
- Aşağıdaki ilişkiler doğru uygulanmış mı?

### **Beklenen ilişkiler:**
- `User` **1 — N** `Course`
- `Course` **1 — N** `Subject`
- `Course` **1 — N** `Video`
- `Course` **1 — N** `Report`
- `Course` **1 — N** `Analysis`

### UML Kontrolü:
- Modellerin ilişkileri UML ile tutarlı mı?
- Foreign key’ler doğru eklenmiş mi?

---

## 📌 3. Endpoint Gereksinimleri
Tüm modeller için RESTful endpoint gereklidir.

### Beklenen endpoint örnekleri:

#### User
- GET /v1/users
- POST /v1/users
- GET /v1/users/:id
- GET /v1/users/:id/courses

#### Course
- GET /v1/courses
- POST /v1/courses
- GET /v1/courses/:id
- GET /v1/courses/:id/subjects
- GET /v1/courses/:id/videos
- GET /v1/courses/:id/reports
- GET /v1/courses/:id/analyses

**Kontrol et:**
- Endpoint’ler RESTful mı?
- CRUD işlemleri eksiksiz mi?
- JSON response formatı standart mı?
- Versioning (v1) doğru yapılandırılmış mı?

---

## 📌 4. Postman Collection Gereksinimi
**Kontrol et:**
- Tüm endpoint’ler için Postman koleksiyonu mevcut mu?
- JSON formatında export edildi mi?
- Authorization yapısı doğru ayarlanmış mı?
- Varsayılan environment değişkenleri var mı?

---

## 📌 5. Bonus: OpenAPI / Swagger Dokümantasyonu
**Kontrol et:**
- Projede Swagger / Rswag kurulmuş mu?
- Tüm endpoint’ler belgelenmiş mi?
- Request ve response örnekleri eksiksiz mi?
- Hata kodları belgelenmiş mi?

---

## 📌 6. Authentication / Authorization (İleri Seviye)
**Kontrol et:**
- JWT veya benzeri token sistemi var mı?
- Login endpoint’i var mı?
- Auth zorunlu olan endpoint’ler gerçekten koruma altında mı?
- Authorization kontrolü (ör. user kendi course’unu görebiliyor mu?) doğru mu?
- Token süresi, refresh yapısı tanımlı mı?

---

## 📌 7. LLM Entegrasyonu / Ekstra Özellikler
(Ödev içinde “ileri seviye” olarak belirtilmiş)

**Kontrol et:**
- Backend tarafında LLM API entegrasyonu yapıldı mı?
- Bu entegrasyon Controller içinde mi yoksa Service katmanında mı?
- Prompt-engineering kısmı doğru uygulanmış mı?
- API Rate Limit & error handling yapıldı mı?

---

## 📌 8. Membership (Üyelik Sistemi)
**Kontrol et:**
- Kullanıcı rol veya plan sistemi var mı? (free/premium)
- Premium özellikler kısıtlanıyor mu?
- Access control doğru çalışıyor mu?

---

## 📌 9. Kod Kalitesi ve Yapı Kontrolü
**Kontrol et:**
- Services, Serializers, Decorators doğru yerde mi?
- Fat controller / fat model problemi var mı?
- Exception handling merkezi mi (`rescue_from`)?
- Strong parameter yapısı doğru uygulanmış mı?
- N+1 sorgu var mı? (includes kullanımı)
- Validations tam mı?

---

## 📌 10. Teslim Gereksinimleri
Ödev teslimi için backend şu dosyaları içermeli:

- UML diyagramı (png/svg)
- Rails projesi (tam)
- Postman collection
- Swagger doc linki
- README.md (kurulum + endpoint listesi)

**Kontrol et:**
- Tüm teslim maddeleri mevcut mu? İstenildiği gibi yapılandırılmışlar mı?

---

## 📌 11. Nihai Değerlendirme
Lütfen sonunda şu başlıklarla değerlendirme yap:

### ✔ A) Tam karşıladığı bölümler  
### ⚠ B) Eksik veya yanlış bölümler  
### 🔧 C) Geliştirme önerileri  
### 🧩 D) Ödev gereksinimine göre final puan (100 üzerinden)  

Bu değerlendirmeyi açık ve detaylı bir şekilde raporla.