# yUML Diagram Syntaxları - TalkToAvatar Backend

Bu dosya, TalkToAvatar backend projesi için Sualingo modunda kullanılan modeller, veriler ve işlemler için yUML diagram syntaxlarını içerir.

---

## 📊 1. Class Diagram - Sualingo Kurs Yapısı (Ana Modeller)

### Syntax 1: Kurs ve İçerik Modelleri İlişkisi

```
[User|id:uuid;username:string;email:string|+create_course();+manage_course()]1-0..*>[Course|id:uuid;title:string;level:string;status:string|+create();+update();+delete()]
[Course]1-0..*>[Subject|id:uuid;title:string;order:integer|+create();+reorder()]
[Course]1-0..*>[Recording|id:uuid;score:decimal;accuracy:float;transcript:text|+create();+evaluate();+cleanup()]
[Course]1-0..*>[Report|id:uuid;title:string;content:text|+generate();+create()]
[Course]1-0..*>[Analysis|id:uuid;analysis_type:string;data:jsonb|+calculate();+create()]
[User]1-0..*>[Recording]
[note: Sualingo Course Structure - User creates courses with subjects, recordings, reports and analyses {bg:lightblue}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string;email:string|+create_course();+manage_course()]1-0..*>[Course|id:uuid;title:string;level:string;status:string|+create();+update();+delete()],[Course]1-0..*>[Subject|id:uuid;title:string;order:integer|+create();+reorder()],[Course]1-0..*>[Recording|id:uuid;score:decimal;accuracy:float;transcript:text|+create();+evaluate();+cleanup()],[Course]1-0..*>[Report|id:uuid;title:string;content:text|+generate();+create()],[Course]1-0..*>[Analysis|id:uuid;analysis_type:string;data:jsonb|+calculate();+create()],[User]1-0..*>[Recording],[note: Sualingo Course Structure - User creates courses with subjects, recordings, reports and analyses {bg:lightblue}]`

**Açıklama:** Bu diagram, Sualingo modunda kurs yapısının temel ilişkilerini gösterir. Kullanıcı (User) birden fazla kurs (Course) oluşturabilir. Her kurs, konular (Subject), kayıtlar (Recording), raporlar (Report) ve analizler (Analysis) içerir. Recording'ler hem kullanıcıya hem de kursa bağlıdır, böylece kullanıcının kurs içindeki pratik performansı takip edilir.

---

## 📚 2. Class Diagram - User ve Course İlişkileri

### Syntax 1: User-Course Yönetim İlişkisi

```
[User|id:uuid;username:string;email:string;email_verified:boolean|+register();+login();+create_course()]1-0..*>[Course|id:uuid;user_id:uuid;title:string;description:text;language_code:string;level:A1-C2;status:active/completed/archived|+create();+update();+delete();+get_subjects();+get_recordings()]
[Course]1-0..*>[UserCourseProgress|id:uuid;completed:boolean;score:float;attempts:integer|+mark_completed();+record_attempt()]
[User]1-0..*>[UserCourseProgress]
[note: User-Course Management - Users create and manage courses, track their progress {bg:lightgreen}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string;email:string;email_verified:boolean|+register();+login();+create_course()]1-0..*>[Course|id:uuid;user_id:uuid;title:string;description:text;language_code:string;level:A1-C2;status:active/completed/archived|+create();+update();+delete();+get_subjects();+get_recordings()],[Course]1-0..*>[UserCourseProgress|id:uuid;completed:boolean;score:float;attempts:integer|+mark_completed();+record_attempt()],[User]1-0..*>[UserCourseProgress],[note: User-Course Management - Users create and manage courses, track their progress {bg:lightgreen}]`

**Açıklama:** Bu diagram, kullanıcı ve kurs arasındaki yönetim ilişkisini gösterir. Kullanıcılar birden fazla kurs oluşturabilir ve yönetebilir. Her kurs için kullanıcının ilerlemesi (UserCourseProgress) takip edilir. Bu ilişki, kullanıcının hangi kurslarda ne kadar ilerleme kaydettiğini ve kaç deneme yaptığını saklar.

---

## 📖 3. Class Diagram - Course ve Subject İlişkisi

### Syntax 1: Course-Subject Hiyerarşisi

```
[Course|id:uuid;title:string;level:A1-C2;status:string|+create();+get_subjects();+reorder_subjects()]1-0..*>[Subject|id:uuid;course_id:uuid;title:string;description:text;order:integer|+create();+update();+delete();+move_up();+move_down()]
[Subject]1-0..*>[PracticeSentence|id:uuid;language_code:string;level:string;topic:string;sentence:text|+for_course();+by_topic();+by_level()]
[note: Course-Subject Hierarchy - Courses contain ordered subjects with practice sentences {bg:lightyellow}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[Course|id:uuid;title:string;level:A1-C2;status:string|+create();+get_subjects();+reorder_subjects()]1-0..*>[Subject|id:uuid;course_id:uuid;title:string;description:text;order:integer|+create();+update();+delete();+move_up();+move_down()],[Subject]1-0..*>[PracticeSentence|id:uuid;language_code:string;level:string;topic:string;sentence:text|+for_course();+by_topic();+by_level()],[note: Course-Subject Hierarchy - Courses contain ordered subjects with practice sentences {bg:lightyellow}]`

**Açıklama:** Bu diagram, kurs ve konu (Subject) arasındaki hiyerarşik yapıyı gösterir. Her kurs birden fazla konu içerir ve konular sıralı (order) bir yapıdadır. Her konu, pratik cümleleri (PracticeSentence) içerir. Bu yapı, kurs içeriğinin organize edilmesini ve kullanıcının adım adım ilerlemesini sağlar.

---

## 🎯 4. Class Diagram - Sualingo Progress Tracking Sistemi

### Syntax 1: Progress Tracking - Tam İlişki Ağı

```
[User|id:uuid;username:string|+track_progress();+view_progress()]1-0..*>[UserCourseProgress|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;completed:boolean;score:float;attempts:integer;best_score:float|+mark_completed();+record_attempt();+update_best_score()]
[Course|id:uuid;title:string|+get_progress();+calculate_statistics()]1-0..*>[UserCourseProgress]
[PracticeSentence|id:uuid;sentence:text;topic:string;level:string|+for_course();+topics_for_course()]1-0..*>[UserCourseProgress]
[User]1-0..*>[Recording|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;score:decimal;accuracy:float;fluency:float;completeness:float|+create();+evaluate();+cleanup_old()]
[Course]1-0..*>[Recording]
[PracticeSentence]1-0..*>[Recording]
[UserCourseProgress]uses-.->[Recording]
[note: Progress Tracking System - Tracks user progress through courses, sentences, and recordings {bg:lightsteelblue}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string|+track_progress();+view_progress()]1-0..*>[UserCourseProgress|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;completed:boolean;score:float;attempts:integer;best_score:float|+mark_completed();+record_attempt();+update_best_score()],[Course|id:uuid;title:string|+get_progress();+calculate_statistics()]1-0..*>[UserCourseProgress],[PracticeSentence|id:uuid;sentence:text;topic:string;level:string|+for_course();+topics_for_course()]1-0..*>[UserCourseProgress],[User]1-0..*>[Recording|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;score:decimal;accuracy:float;fluency:float;completeness:float|+create();+evaluate();+cleanup_old()],[Course]1-0..*>[Recording],[PracticeSentence]1-0..*>[Recording],[UserCourseProgress]uses-.->[Recording],[note: Progress Tracking System - Tracks user progress through courses, sentences, and recordings {bg:lightsteelblue}]`

**Açıklama:** Bu diagram, Sualingo modunda ilerleme takip sisteminin tam ilişki ağını gösterir. Kullanıcı, kurs ve pratik cümlesi arasındaki ilerleme (UserCourseProgress) kaydedilir. Her ilerleme kaydı, kullanıcının bir cümleyi tamamlayıp tamamlamadığını, skorunu, deneme sayısını ve en iyi skorunu saklar. Recording'ler (ses kayıtları) bu ilerlemeyi destekler ve her kayıt, kullanıcının telaffuz performansını (accuracy, fluency, completeness) ölçer. UserCourseProgress, Recording'leri kullanarak (uses) detaylı performans analizi yapar.

---

## 🎤 5. Class Diagram - Recording ve Practice Sentence İlişkisi

### Syntax 1: Recording-Practice Sentence İlişki Detayı

```
[User|id:uuid;username:string|+record_audio();+view_recordings()]1-0..*>[Recording|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;local_uri:text;reference_text:text;transcript:text;score:decimal;accuracy:float;fluency:float;completeness:float;words:jsonb;level:A1-C2;topic:string|+create();+evaluate();+cleanup_old();+get_word_details()]
[Course|id:uuid;title:string|+get_recordings();+filter_by_topic()]1-0..*>[Recording]
[PracticeSentence|id:uuid;sentence:text;topic:string;level:string|+get_recordings();+get_reference_audio()]1-0..*>[Recording]
[Recording]uses-.->[PracticeSentence]
[note: Recording-Practice Sentence Relationship - Recordings capture user pronunciation practice for specific sentences {bg:lightsalmon}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string|+record_audio();+view_recordings()]1-0..*>[Recording|id:uuid;user_id:uuid;course_id:uuid;practice_sentence_id:uuid;local_uri:text;reference_text:text;transcript:text;score:decimal;accuracy:float;fluency:float;completeness:float;words:jsonb;level:A1-C2;topic:string|+create();+evaluate();+cleanup_old();+get_word_details()],[Course|id:uuid;title:string|+get_recordings();+filter_by_topic()]1-0..*>[Recording],[PracticeSentence|id:uuid;sentence:text;topic:string;level:string|+get_recordings();+get_reference_audio()]1-0..*>[Recording],[Recording]uses-.->[PracticeSentence],[note: Recording-Practice Sentence Relationship - Recordings capture user pronunciation practice for specific sentences {bg:lightsalmon}]`

**Açıklama:** Bu diagram, Recording (ses kaydı) ve PracticeSentence (pratik cümlesi) arasındaki detaylı ilişkiyi gösterir. Her kayıt, kullanıcının belirli bir cümleyi nasıl telaffuz ettiğini yakalar. Recording, kullanıcıya, kursa ve pratik cümlesine bağlıdır. Her kayıt, skor (score), doğruluk (accuracy), akıcılık (fluency), tamlık (completeness) ve kelime seviyesinde detaylar (words) içerir. Recording, PracticeSentence'i kullanarak (uses) referans metni ve değerlendirme kriterlerini alır.

---

## 📊 6. Class Diagram - Report ve Analysis Oluşturma Sistemi

### Syntax 1: Report-Analysis İlişki Ağı

```
[Course|id:uuid;title:string;level:string|+generate_report();+calculate_analysis()]1-0..*>[Report|id:uuid;course_id:uuid;title:string;content:text;report_type:string|+create();+generate_from_recordings();+format_by_topic()]
[Course]1-0..*>[Analysis|id:uuid;course_id:uuid;analysis_type:string;data:jsonb;summary:text|+create();+calculate_statistics();+get_time_series()]
[Report]uses-.->[Recording|id:uuid;score:decimal;accuracy:float;topic:string|+get_data()]
[Analysis]uses-.->[Recording]
[Analysis]uses-.->[UserCourseProgress|id:uuid;completed:boolean;score:float|+get_statistics()]
[note: Report and Analysis System - Reports and analyses are generated from course recordings and progress data {bg:lightpink}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[Course|id:uuid;title:string;level:string|+generate_report();+calculate_analysis()]1-0..*>[Report|id:uuid;course_id:uuid;title:string;content:text;report_type:string|+create();+generate_from_recordings();+format_by_topic()],[Course]1-0..*>[Analysis|id:uuid;course_id:uuid;analysis_type:string;data:jsonb;summary:text|+create();+calculate_statistics();+get_time_series()],[Report]uses-.->[Recording|id:uuid;score:decimal;accuracy:float;topic:string|+get_data()],[Analysis]uses-.->[Recording],[Analysis]uses-.->[UserCourseProgress|id:uuid;completed:boolean;score:float|+get_statistics()],[note: Report and Analysis System - Reports and analyses are generated from course recordings and progress data {bg:lightpink}]`

**Açıklama:** Bu diagram, rapor (Report) ve analiz (Analysis) oluşturma sistemini gösterir. Her kurs, birden fazla rapor ve analiz içerebilir. Raporlar, kurs kayıtlarından (Recording) veri kullanarak oluşturulur ve konu bazında formatlanır. Analizler ise hem kayıtlardan hem de ilerleme verilerinden (UserCourseProgress) istatistikler hesaplar. Bu sistem, kullanıcının kurs içindeki performansını detaylı olarak görüntülemesini sağlar.

---

## 🔐 7. Class Diagram - Authentication Sistemi

### Syntax 1: Authentication Modelleri ve İlişkileri

```
[User|id:uuid;username:string;email:string;password_digest:string;email_verified:boolean|+register();+login();+verify_email()]1-0..*>[EmailVerification|id:uuid;user_id:uuid;code:string;expires_at:timestamp;verified:boolean|+generate_code();+verify();+expired?();+send_email()]
[User]1-0..*>[PasswordReset|id:uuid;user_id:uuid;token:string;expires_at:timestamp;used:boolean|+generate_token();+reset();+expired?();+send_email()]
[User]uses-.->[EmailVerification]
[User]uses-.->[PasswordReset]
[note: Authentication System - Email verification and password reset support user authentication {bg:lightcyan}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string;email:string;password_digest:string;email_verified:boolean|+register();+login();+verify_email()]1-0..*>[EmailVerification|id:uuid;user_id:uuid;code:string;expires_at:timestamp;verified:boolean|+generate_code();+verify();+expired?();+send_email()],[User]1-0..*>[PasswordReset|id:uuid;user_id:uuid;token:string;expires_at:timestamp;used:boolean|+generate_token();+reset();+expired?();+send_email()],[User]uses-.->[EmailVerification],[User]uses-.->[PasswordReset],[note: Authentication System - Email verification and password reset support user authentication {bg:lightcyan}]`

**Açıklama:** Bu diagram, kimlik doğrulama sistemini gösterir. Kullanıcı, kayıt olduktan sonra email doğrulaması (EmailVerification) yapmalıdır. Her kullanıcı için doğrulama kodu oluşturulur ve e-posta ile gönderilir. Şifre sıfırlama (PasswordReset) için de benzer bir sistem vardır. Kullanıcı, bu modelleri kullanarak (uses) kimlik doğrulama işlemlerini gerçekleştirir.

---

## 🎨 8. Class Diagram - Video Generation Sistemi (Avatar Video)

### Syntax 1: Video ve Custom Avatar İlişkisi

```
[User|id:uuid;username:string|+create_video();+manage_avatar()]1-0..*>[Video|id:uuid;user_id:uuid;course_id:uuid;text:text;avatar_info:jsonb;audio_info:jsonb;status:processing/completed/failed|+create();+process();+generate_avatar();+combine_audio()]
[User]1-0..*>[CustomAvatar|id:uuid;user_id:uuid;local_uri:text;avatar_name:string|+create();+delete();+get_info()]
[Video]uses-.->[CustomAvatar]
[Video]uses-.->[Course|id:uuid;title:string|+get_videos()]
[note: Video Generation System - Videos are generated using custom avatars and can be associated with courses {bg:lightsteelblue}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[User|id:uuid;username:string|+create_video();+manage_avatar()]1-0..*>[Video|id:uuid;user_id:uuid;course_id:uuid;text:text;avatar_info:jsonb;audio_info:jsonb;status:processing/completed/failed|+create();+process();+generate_avatar();+combine_audio()],[User]1-0..*>[CustomAvatar|id:uuid;user_id:uuid;local_uri:text;avatar_name:string|+create();+delete();+get_info()],[Video]uses-.->[CustomAvatar],[Video]uses-.->[Course|id:uuid;title:string|+get_videos()],[note: Video Generation System - Videos are generated using custom avatars and can be associated with courses {bg:lightsteelblue}]`

**Açıklama:** Bu diagram, avatar video oluşturma sistemini gösterir. Video modeli, Recording'den farklıdır - bu, avatar'ın konuştuğu videoları oluşturmak için kullanılır. Kullanıcı, özel avatar'lar (CustomAvatar) oluşturabilir ve bu avatar'ları kullanarak videolar üretebilir. Video'lar opsiyonel olarak bir kursa bağlanabilir, ancak bu Sualingo modundaki Recording'lerden farklıdır. Video, CustomAvatar'ı kullanarak (uses) avatar görüntüsünü ve ses bilgisini birleştirir.

---

## 📋 9. Class Diagram - API Controller Yapısı

### Syntax 1: Controller Inheritance Hiyerarşisi

```
[ApplicationController|+authenticate_user();+current_user();+record_not_found();+rescue_from()]^[Api::V1::UsersController|+index();+show();+create();+courses()]
[ApplicationController]^[Api::V1::CoursesController|+index();+show();+create();+update();+destroy();+subjects();+recordings();+reports();+analyses();+progress()]
[ApplicationController]^[Api::V1::AuthController|+register();+login();+verify_email();+resend_verification();+forgot_password();+reset_password()]
[ApplicationController]^[Api::V1::RecordingsController|+index();+show();+create();+destroy()]
[ApplicationController]^[Api::V1::ReportsController|+index();+show();+create();+update();+destroy()]
[note: API Controller Structure - All controllers inherit from ApplicationController with common authentication and error handling {bg:lightgray}]
```

**URL:** `https://yuml.me/diagram/scruffy/class/[ApplicationController|+authenticate_user();+current_user();+record_not_found();+rescue_from()]^[Api::V1::UsersController|+index();+show();+create();+courses()],[ApplicationController]^[Api::V1::CoursesController|+index();+show();+create();+update();+destroy();+subjects();+recordings();+reports();+analyses();+progress()],[ApplicationController]^[Api::V1::AuthController|+register();+login();+verify_email();+resend_verification();+forgot_password();+reset_password()],[ApplicationController]^[Api::V1::RecordingsController|+index();+show();+create();+destroy()],[ApplicationController]^[Api::V1::ReportsController|+index();+show();+create();+update();+destroy()],[note: API Controller Structure - All controllers inherit from ApplicationController with common authentication and error handling {bg:lightgray}]`

**Açıklama:** Bu diagram, API controller'ların kalıtım (inheritance) yapısını gösterir. Tüm controller'lar ApplicationController'dan türer (^) ve ortak kimlik doğrulama (authenticate_user), mevcut kullanıcı (current_user) ve hata yönetimi (rescue_from) metodlarını paylaşır. CoursesController, Sualingo modunda recordings, reports ve analyses endpoint'lerini içerir. Bu yapı, kod tekrarını önler ve tutarlı bir API davranışı sağlar.

---

## 🎯 10. Use Case Diagram - Authentication

### Syntax 1: Authentication Use Cases

```
[User]-(Register)
[User]-(Login)
[User]-(Logout)
[User]-(Verify Email)
[User]-(Reset Password)
[System]-(Authenticate User)
[System]-(Send Verification Email)
[System]-(Send Password Reset)
(Register)>(Send Verification Email)
(Login)>(Authenticate User)
(Reset Password)>(Send Password Reset)
[note: Authentication Use Cases - User registration, login, and password management {bg:lightblue}]
```

**URL:** `https://yuml.me/diagram/scruffy/usecase/[User]-(Register),[User]-(Login),[User]-(Logout),[User]-(Verify Email),[User]-(Reset Password),[System]-(Authenticate User),[System]-(Send Verification Email),[System]-(Send Password Reset),(Register)>(Send Verification Email),(Login)>(Authenticate User),(Reset Password)>(Send Password Reset),[note: Authentication Use Cases - User registration, login, and password management {bg:lightblue}]`

**Açıklama:** Bu diagram, kimlik doğrulama kullanım senaryolarını gösterir. Kullanıcı, kayıt olabilir (Register), giriş yapabilir (Login), çıkış yapabilir (Logout), email doğrulayabilir (Verify Email) ve şifre sıfırlayabilir (Reset Password). Sistem, bu işlemleri desteklemek için kullanıcıyı doğrular (Authenticate User) ve e-posta gönderir (Send Verification Email, Send Password Reset). Register işlemi, Send Verification Email'i içerir (>) çünkü kayıt sonrası email doğrulaması gereklidir.

---

## 📚 11. Use Case Diagram - Course Management

### Syntax 1: Course Management Use Cases

```
[Student]-(Create Course)
[Student]-(View Course)
[Student]-(Update Course)
[Student]-(Delete Course)
[Student]-(View Course List)
[Student]-(View Course Recordings)
[Student]-(View Course Reports)
[Student]-(View Course Analysis)
[System]-(Validate Course Data)
[System]-(Save Course)
[System]-(Load Course Data)
(Create Course)>(Validate Course Data)
(Create Course)>(Save Course)
(Update Course)>(Validate Course Data)
(View Course)>(Load Course Data)
(View Course Recordings)>(Load Course Data)
(View Course Reports)>(Load Course Data)
[note: Course Management Use Cases - Students create and manage courses, view recordings, reports and analyses {bg:lightgreen}]
```

**URL:** `https://yuml.me/diagram/scruffy/usecase/[Student]-(Create Course),[Student]-(View Course),[Student]-(Update Course),[Student]-(Delete Course),[Student]-(View Course List),[Student]-(View Course Recordings),[Student]-(View Course Reports),[Student]-(View Course Analysis),[System]-(Validate Course Data),[System]-(Save Course),[System]-(Load Course Data),(Create Course)>(Validate Course Data),(Create Course)>(Save Course),(Update Course)>(Validate Course Data),(View Course)>(Load Course Data),(View Course Recordings)>(Load Course Data),(View Course Reports)>(Load Course Data),[note: Course Management Use Cases - Students create and manage courses, view recordings, reports and analyses {bg:lightgreen}]`

**Açıklama:** Bu diagram, kurs yönetimi kullanım senaryolarını gösterir. Öğrenci, kurs oluşturabilir, görüntüleyebilir, güncelleyebilir ve silebilir. Ayrıca kurs kayıtlarını (Recordings), raporlarını (Reports) ve analizlerini (Analyses) görüntüleyebilir. Sistem, kurs verilerini doğrular (Validate Course Data), kaydeder (Save Course) ve yükler (Load Course Data). Create Course ve Update Course işlemleri, veri doğrulamasını içerir (>) çünkü geçerli veri gereklidir.

---

## 🎤 12. Use Case Diagram - Practice Session

### Syntax 1: Practice Sentence Use Cases

```
[Student]-(Select Course)
[Student]-(Select Topic)
[Student]-(Select Sentence)
[Student]-(Practice Sentence)
[Student]-(Record Audio)
[Student]-(View Score)
[Student]-(View Recording Details)
[System]-(Evaluate Pronunciation)
[System]-(Calculate Score)
[System]-(Update Progress)
[System]-(Save Recording)
[System]-(Cleanup Old Recordings)
(Practice Sentence)>(Record Audio)
(Record Audio)>(Evaluate Pronunciation)
(Evaluate Pronunciation)>(Calculate Score)
(Calculate Score)>(Update Progress)
(Calculate Score)>(Save Recording)
(Save Recording)>(Cleanup Old Recordings)
[note: Practice Session Use Cases - Students practice sentences, record audio, and get pronunciation feedback {bg:lightyellow}]
```

**URL:** `https://yuml.me/diagram/scruffy/usecase/[Student]-(Select Course),[Student]-(Select Topic),[Student]-(Select Sentence),[Student]-(Practice Sentence),[Student]-(Record Audio),[Student]-(View Score),[Student]-(View Recording Details),[System]-(Evaluate Pronunciation),[System]-(Calculate Score),[System]-(Update Progress),[System]-(Save Recording),[System]-(Cleanup Old Recordings),(Practice Sentence)>(Record Audio),(Record Audio)>(Evaluate Pronunciation),(Evaluate Pronunciation)>(Calculate Score),(Calculate Score)>(Update Progress),(Calculate Score)>(Save Recording),(Save Recording)>(Cleanup Old Recordings),[note: Practice Session Use Cases - Students practice sentences, record audio, and get pronunciation feedback {bg:lightyellow}]`

**Açıklama:** Bu diagram, pratik oturumu kullanım senaryolarını gösterir. Öğrenci, kurs seçer, konu seçer, cümle seçer ve pratik yapar. Ses kaydı yapar (Record Audio) ve sistem telaffuzu değerlendirir (Evaluate Pronunciation), skor hesaplar (Calculate Score), ilerlemeyi günceller (Update Progress) ve kaydı saklar (Save Recording). Kayıt saklandıktan sonra eski kayıtlar temizlenir (Cleanup Old Recordings) - her cümle için son 3 kayıt tutulur. Bu akış, öğrencinin telaffuz gelişimini takip etmesini sağlar.

---

## 📊 13. Use Case Diagram - Progress ve Raporlama

### Syntax 1: Progress ve Raporlama Use Cases

```
[Student]-(View Progress)
[Student]-(View Reports)
[Student]-(View Analysis)
[Student]-(View Topic Progress)
[System]-(Track Progress)
[System]-(Generate Report)
[System]-(Calculate Statistics)
[System]-(Load Progress Data)
(View Progress)<(Track Progress)
(View Progress)>(Load Progress Data)
(View Reports)<(Generate Report)
(View Analysis)<(Calculate Statistics)
[note: Progress and Reporting Use Cases - Students view their progress, reports, and detailed analysis {bg:lightcoral}]
```

**URL:** `https://yuml.me/diagram/scruffy/usecase/[Student]-(View Progress),[Student]-(View Reports),[Student]-(View Analysis),[Student]-(View Topic Progress),[System]-(Track Progress),[System]-(Generate Report),[System]-(Calculate Statistics),[System]-(Load Progress Data),(View Progress)<(Track Progress),(View Progress)>(Load Progress Data),(View Reports)<(Generate Report),(View Analysis)<(Calculate Statistics),[note: Progress and Reporting Use Cases - Students view their progress, reports, and detailed analysis {bg:lightcoral}]`

**Açıklama:** Bu diagram, ilerleme ve raporlama kullanım senaryolarını gösterir. Öğrenci, ilerlemesini (View Progress), raporlarını (View Reports) ve analizlerini (View Analysis) görüntüleyebilir. Sistem, ilerlemeyi takip eder (Track Progress), rapor oluşturur (Generate Report) ve istatistikleri hesaplar (Calculate Statistics). View Progress, Track Progress'i genişletir (<) çünkü ilerleme görüntüleme, ilerleme takibini içerir. View Progress, Load Progress Data'yı içerir (>) çünkü veri yükleme gereklidir.

---

## 🔄 14. Activity Diagram - User Registration ve Login

### Syntax 1: User Registration İş Akışı

```
(start)->(User Fills Registration Form)->(Validate Input Data)-><a>[Valid]->(Check Email Exists)-><b>[Email Available]->(Hash Password)->(Create User Account)->(Generate Verification Code)->(Send Verification Email)->(Display Success Message)->(end)
<a>[Invalid]->(Show Validation Errors)->(User Fills Registration Form)
<b>[Email Exists]->(Show Email Already Exists Error)->(User Fills Registration Form)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(User Fills Registration Form)->(Validate Input Data)-><a>[Valid]->(Check Email Exists)-><b>[Email Available]->(Hash Password)->(Create User Account)->(Generate Verification Code)->(Send Verification Email)->(Display Success Message)->(end),<a>[Invalid]->(Show Validation Errors)->(User Fills Registration Form),<b>[Email Exists]->(Show Email Already Exists Error)->(User Fills Registration Form)`

**Açıklama:** Bu diagram, kullanıcı kayıt iş akışını gösterir. Kullanıcı kayıt formunu doldurur, veriler doğrulanır. Geçerli ise email kontrol edilir. Email mevcut değilse şifre hash'lenir, kullanıcı hesabı oluşturulur, doğrulama kodu oluşturulur ve email gönderilir. Geçersiz veri veya mevcut email durumunda hata gösterilir ve kullanıcı formu tekrar doldurur. Bu akış, güvenli kullanıcı kaydı sağlar.

---

### Syntax 2: User Login İş Akışı

```
(start)->(User Enters Credentials)->(Validate Input)-><a>[Valid]->(Find User by Email)-><b>[User Found]->(Verify Password)-><c>[Password Correct]->(Check Email Verified)-><d>[Email Verified]->(Generate JWT Token)->(Return Token and User Data)->(end)
<a>[Invalid]->(Show Validation Error)->(User Enters Credentials)
<b>[User Not Found]->(Show Invalid Credentials)->(end)
<c>[Password Incorrect]->(Show Invalid Credentials)->(end)
<d>[Email Not Verified]->(Show Email Verification Required)->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(User Enters Credentials)->(Validate Input)-><a>[Valid]->(Find User by Email)-><b>[User Found]->(Verify Password)-><c>[Password Correct]->(Check Email Verified)-><d>[Email Verified]->(Generate JWT Token)->(Return Token and User Data)->(end),<a>[Invalid]->(Show Validation Error)->(User Enters Credentials),<b>[User Not Found]->(Show Invalid Credentials)->(end),<c>[Password Incorrect]->(Show Invalid Credentials)->(end),<d>[Email Not Verified]->(Show Email Verification Required)->(end)`

**Açıklama:** Bu diagram, kullanıcı giriş iş akışını gösterir. Kullanıcı kimlik bilgilerini girer, veriler doğrulanır. Geçerli ise kullanıcı email ile bulunur, şifre doğrulanır, email doğrulaması kontrol edilir. Tüm kontroller başarılı ise JWT token oluşturulur ve kullanıcı verileri döndürülür. Herhangi bir kontrol başarısız olursa (kullanıcı bulunamadı, şifre yanlış, email doğrulanmadı) uygun hata mesajı gösterilir. Bu akış, güvenli giriş sağlar.

---

## 🎓 15. Activity Diagram - Course Creation

### Syntax 1: Course Creation İş Akışı

```
(start)->(User Authenticated)->(User Fills Course Form)->(Validate Course Data)-><a>[Valid]->(Check User Permissions)->(Create Course Record)->(Set Default Status Active)->(Return Course Data)->(Display Success Message)->(end)
<a>[Invalid]->(Show Validation Errors)->(User Fills Course Form)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(User Authenticated)->(User Fills Course Form)->(Validate Course Data)-><a>[Valid]->(Check User Permissions)->(Create Course Record)->(Set Default Status Active)->(Return Course Data)->(Display Success Message)->(end),<a>[Invalid]->(Show Validation Errors)->(User Fills Course Form)`

**Açıklama:** Bu diagram, kurs oluşturma iş akışını gösterir. Kullanıcı kimlik doğrulaması yapıldıktan sonra kurs formunu doldurur. Veriler doğrulanır. Geçerli ise kullanıcı izinleri kontrol edilir, kurs kaydı oluşturulur, varsayılan durum "active" olarak ayarlanır ve kurs verileri döndürülür. Geçersiz veri durumunda hata gösterilir ve kullanıcı formu tekrar doldurur. Bu akış, yalnızca kimlik doğrulanmış kullanıcıların kurs oluşturmasını sağlar.

---

## 🎤 16. Activity Diagram - Practice Sentence İş Akışı

### Syntax 1: Practice Sentence - Basitleştirilmiş İş Akışı

```
(start)->(Select Course and Sentence)->(Display Sentence)->(Play Reference Audio)->(Record Audio)->(Upload and Transcribe)->(Evaluate Pronunciation)->(Calculate Scores)-><a>[Score >= 85]->(Mark Completed)->(Update Progress)->(Save Recording)->(Cleanup Old)->(Show Success)->(end)
<a>[Score < 85]->(Update Progress)->(Save Recording)->(Show Feedback)->(Allow Retry)-><b>[Retry]->(Record Audio)
<b>[Continue]->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(Select Course and Sentence)->(Display Sentence)->(Play Reference Audio)->(Record Audio)->(Upload and Transcribe)->(Evaluate Pronunciation)->(Calculate Scores)-><a>[Score >= 85]->(Mark Completed)->(Update Progress)->(Save Recording)->(Cleanup Old)->(Show Success)->(end),<a>[Score < 85]->(Update Progress)->(Save Recording)->(Show Feedback)->(Allow Retry)-><b>[Retry]->(Record Audio),<b>[Continue]->(end)`

**Açıklama:** Bu diagram, pratik cümle iş akışını basitleştirilmiş şekilde gösterir. Kullanıcı kurs ve cümle seçer, cümle gösterilir ve referans ses çalınır. Kullanıcı ses kaydı yapar, kayıt yüklenir ve transkript edilir. Telaffuz değerlendirilir ve skorlar hesaplanır. Skor 85 veya üzeri ise cümle tamamlandı olarak işaretlenir, ilerleme güncellenir, kayıt saklanır ve eski kayıtlar temizlenir. Skor 85'ten düşükse geri bildirim gösterilir ve kullanıcı tekrar deneyebilir. Bu akış, kullanıcının telaffuz gelişimini takip etmesini sağlar.

---

## 📊 17. Activity Diagram - Progress Tracking

### Syntax 1: Course Progress Tracking İş Akışı

```
(start)->(User Logs In)->(Select Course)->(Load Course Data)->(Load Progress Records)->(Calculate Overall Progress)->(Calculate Topic Progress)->(Calculate Weekly Stats)->(Format Data)->(Display Dashboard)-><a>[Select Topic]->(Load Topic Progress)->(Display Topic Details)->(end)
<a>[Continue]->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(User Logs In)->(Select Course)->(Load Course Data)->(Load Progress Records)->(Calculate Overall Progress)->(Calculate Topic Progress)->(Calculate Weekly Stats)->(Format Data)->(Display Dashboard)-><a>[Select Topic]->(Load Topic Progress)->(Display Topic Details)->(end),<a>[Continue]->(end)`

**Açıklama:** Bu diagram, kurs ilerleme takibi iş akışını basitleştirilmiş şekilde gösterir. Kullanıcı giriş yapar, kurs seçer, kurs verileri ve ilerleme kayıtları yüklenir. Genel ilerleme (toplam/tamamlanan cümle, yüzde), konu bazlı ilerleme ve haftalık istatistikler hesaplanır. Veriler formatlanır ve dashboard gösterilir. Kullanıcı konu seçebilir ve konu detaylarını görüntüleyebilir. Bu akış, kullanıcının kurs içindeki ilerlemesini görüntülemesini sağlar.

---

## 📈 18. Activity Diagram - Report Generation

### Syntax 1: Report Generation İş Akışı

```
(start)->(Request Report)->(Authenticate)->(Load Course)->(Validate Access)-><a>[Granted]->(Load Recordings)->(Group by Topic)->(Group by Sentence)->(Limit to Last 3)->(Format Data)->(Build Report Structure)->(Return JSON)->(Display Report)->(end)
<a>[Denied]->(Return Error)->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(Request Report)->(Authenticate)->(Load Course)->(Validate Access)-><a>[Granted]->(Load Recordings)->(Group by Topic)->(Group by Sentence)->(Limit to Last 3)->(Format Data)->(Build Report Structure)->(Return JSON)->(Display Report)->(end),<a>[Denied]->(Return Error)->(end)`

**Açıklama:** Bu diagram, rapor oluşturma iş akışını basitleştirilmiş şekilde gösterir. Kullanıcı rapor ister, kimlik doğrulanır, kurs yüklenir ve erişim doğrulanır. Erişim izni verilirse kurs kayıtları yüklenir, konu ve cümleye göre gruplandırılır, her cümle için son 3 kayıt sınırlandırılır. Veriler formatlanır, rapor yapısı oluşturulur ve JSON olarak döndürülür. Erişim reddedilirse hata döndürülür. Bu akış, kullanıcının kurs performansını görüntülemesini sağlar.

---

## 📉 19. Activity Diagram - Analysis Calculation

### Syntax 1: Analysis Calculation İş Akışı

```
(start)->(Request Analysis)->(Authenticate)->(Load Course)->(Validate Access)-><a>[Granted]->(Load Recordings and Progress)->(Calculate Overall Stats)->(Calculate Topic Stats)->(Calculate Time Series)->(Analyze Errors)->(Build Statistics)->(Format Analysis)->(Return JSON)->(Display Analysis)->(end)
<a>[Denied]->(Return Error)->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(Request Analysis)->(Authenticate)->(Load Course)->(Validate Access)-><a>[Granted]->(Load Recordings and Progress)->(Calculate Overall Stats)->(Calculate Topic Stats)->(Calculate Time Series)->(Analyze Errors)->(Build Statistics)->(Format Analysis)->(Return JSON)->(Display Analysis)->(end),<a>[Denied]->(Return Error)->(end)`

**Açıklama:** Bu diagram, analiz hesaplama iş akışını basitleştirilmiş şekilde gösterir. Kullanıcı analiz ister, kimlik doğrulanır, kurs yüklenir ve erişim doğrulanır. Erişim izni verilirse kurs kayıtları ve ilerleme kayıtları yüklenir. Genel istatistikler (tamamlanma oranı, ortalama skor, başarı oranı), konu bazlı istatistikler, son 7 gün için zaman serisi verileri ve hata analizi hesaplanır. İstatistikler oluşturulur, analiz formatlanır ve JSON olarak döndürülür. Bu akış, kullanıcının kurs performansını analiz etmesini sağlar.

---

## 🧹 20. Activity Diagram - Recording Cleanup

### Syntax 1: Recording Cleanup İş Akışı

```
(start)->(New Recording Created)->(Get Recording Details)->(Find Existing Recordings)->(Count Recordings)-><a>[Count > 2]->(Keep Last 2)->(Delete Old)->(Log Cleanup)->(end)
<a>[Count <= 2]->(Keep All)->(Log No Cleanup)->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(New Recording Created)->(Get Recording Details)->(Find Existing Recordings)->(Count Recordings)-><a>[Count > 2]->(Keep Last 2)->(Delete Old)->(Log Cleanup)->(end),<a>[Count <= 2]->(Keep All)->(Log No Cleanup)->(end)`

**Açıklama:** Bu diagram, kayıt temizleme iş akışını basitleştirilmiş şekilde gösterir. Yeni bir kayıt oluşturulduğunda, kayıt detayları alınır ve mevcut kayıtlar bulunur (kullanıcı, kurs ve cümleye göre). Mevcut kayıt sayısı sayılır. Eğer sayı 2'den fazlaysa, son 2 kayıt tutulur ve eski kayıtlar silinir. Eğer sayı 2 veya daha azsa, tüm kayıtlar tutulur. Bu akış, her cümle için son 3 kayıt tutulmasını sağlar (yeni kayıt + 2 eski kayıt) ve veritabanı boyutunu kontrol altında tutar.

---

## 🎬 21. Activity Diagram - Video Generation

### Syntax 1: Video Generation İş Akışı

```
(start)->(Create Video Request)->(Validate Text)-><a>[Valid]->(Authenticate)->(Create Record)->(Generate Avatar)->(Generate Audio)->(Combine)->(Save File)->(Update Status)->(Return URL)->(Display Video)->(end)
<a>[Invalid]->(Show Error)->(end)
```

**URL:** `https://yuml.me/diagram/scruffy/activity/(start)->(Create Video Request)->(Validate Text)-><a>[Valid]->(Authenticate)->(Create Record)->(Generate Avatar)->(Generate Audio)->(Combine)->(Save File)->(Update Status)->(Return URL)->(Display Video)->(end),<a>[Invalid]->(Show Error)->(end)`

**Açıklama:** Bu diagram, avatar video oluşturma iş akışını basitleştirilmiş şekilde gösterir. Kullanıcı video isteği oluşturur, metin doğrulanır. Geçerli ise kimlik doğrulanır, video kaydı oluşturulur, avatar video ve ses oluşturulur, birleştirilir ve kaydedilir. Video durumu güncellenir, URL döndürülür ve video gösterilir. Geçersiz veri durumunda hata gösterilir. Bu akış, kullanıcının avatar'ın konuştuğu videolar oluşturmasını sağlar (Sualingo modundaki Recording'lerden farklı olarak).

---

## 📝 Kullanım Talimatları

### 1. Diagram Oluşturma

Her syntax için iki yöntem kullanabilirsiniz:

**Yöntem 1: Online Editor (Önerilen)**
1. [yUML.me/diagram/scruffy/class/draw](https://yuml.me/diagram/scruffy/class/draw) adresine gidin
2. Syntax'ı kopyalayın ve editöre yapıştırın
3. "Generate" butonuna tıklayın
4. Diagram'ı PNG veya SVG olarak indirin

**Yöntem 2: URL ile Direkt Erişim**
1. Syntax'ı URL encode edin (boşlukları `%20` ile değiştirin, özel karakterleri encode edin)
2. URL formatını kullanın:
   ```
   https://yuml.me/diagram/scruffy/class/[ENCODED_SYNTAX]
   ```
3. Tarayıcıda açın ve görüntüyü kaydedin

### 2. Diagram Stilleri

yUML üç stil destekler:
- `scruffy` (varsayılan, el çizimi görünümü) - Önerilen
- `plain` (düz çizgiler)
- `nofunky` (basit görünüm)

URL'de stil değiştirmek için:
```
https://yuml.me/diagram/plain/class/[SYNTAX]
https://yuml.me/diagram/nofunky/class/[SYNTAX]
```

### 3. Diagram Yönü

Yön değiştirmek için URL'ye parametre ekleyin:
```
https://yuml.me/diagram/scruffy/class/dir:lr/[SYNTAX]  # Left to Right
https://yuml.me/diagram/scruffy/class/dir:td/[SYNTAX] # Top to Down (varsayılan)
```

### 4. Diagram Ölçeklendirme

Ölçeklendirmek için:
```
https://yuml.me/diagram/scruffy/class/scale:75/[SYNTAX]  # %75 ölçek
```

### 5. Activity Diagram Özel Notlar

- `(start)` ve `(end)` büyük/küçük harf duyarlıdır
- Decision noktaları için `<label>[condition]` formatını kullanın
- Uzun activity diagram'lar için parçalara bölün

---

## 📚 Referanslar

- [yUML.me Ana Sayfa](https://yuml.me/)
- [yUML Syntax Dokümantasyonu](https://yuml.me/diagram/scruffy/class/draw)
- [yUML GitHub Repository](https://github.com/jaime-olivares/yuml-diagram)

---

## 💡 İpuçları

1. **Karmaşık Diagram'lar:** Çok karmaşık diagram'lar için syntax'ı parçalara bölün ve ayrı diagram'lar oluşturun.

2. **Renkler:** Note'larda renk kullanarak diagram'ları daha anlaşılır hale getirebilirsiniz.

3. **Test:** Syntax'ları test etmek için önce küçük bir diagram oluşturun, sonra büyük diagram'lara geçin.

4. **Export:** Diagram'ları PNG veya SVG formatında export edin ve dokümantasyonunuza ekleyin.

5. **Versiyonlama:** Diagram syntax'larınızı versiyonlayın ve değişiklikleri takip edin.

6. **Activity Diagram'lar:** Uzun activity diagram'lar için önce basit versiyonu oluşturun, sonra detaylandırın.

7. **Class Diagram'lar:** İlişkileri net göstermek için her diagram'da birden fazla model arasındaki ilişkileri gösterin.

8. **Use Case Diagram'lar:** Her diagram'da bir ana actor ve ilgili use case'leri gösterin.

---

## 📋 Diagram Kategorileri Özeti

- **Class Diagrams:** 9 kategori, 9 syntax (Video yerine Recording kullanıldı, ilişkiler detaylandırıldı)
- **Use Case Diagrams:** 4 kategori, 4 syntax
- **Activity Diagrams:** 8 kategori, 8 syntax
- **Toplam:** 21 kategori, 21 syntax

Her diagram projeye uygun, anlamlı, ilişkileri net gösteren ve açıklamalı bir şekilde tasarlanmıştır.

---

## ⚠️ Önemli Notlar

1. **Recording vs Video:** 
   - **Recording:** Sualingo modunda kullanıcının telaffuz pratiği için ses kayıtları (Course'a bağlı)
   - **Video:** Avatar'ın konuştuğu videolar (opsiyonel olarak Course'a bağlı, ama farklı amaç için)

2. **Course Yapısı:** Sualingo modunda Course, Recording'leri içerir, Video'ları değil (Video ayrı bir özelliktir).

3. **İlişkiler:** Her diagram, birden fazla model arasındaki ilişkileri gösterir ve açıklamaları içerir.
