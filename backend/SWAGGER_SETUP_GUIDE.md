# Swagger/OpenAPI Dokümantasyonu Kurulum Rehberi

Bu rehber, Rails API projenize Rswag kullanarak Swagger/OpenAPI dokümantasyonu ekleme adımlarını içerir.

## 📋 Adım 1: Gerekli Gem'leri Ekleyin

`backend/Gemfile` dosyasına aşağıdaki gem'leri ekleyin:

```ruby
group :development, :test do
  # ... mevcut gem'ler ...
  
  # Swagger/OpenAPI documentation
  gem 'rswag'
  gem 'rswag-specs'
  gem 'rswag-api'
  gem 'rswag-ui'
end
```

Sonra gem'leri yükleyin:
```bash
cd backend
bundle install
```

---

## 📋 Adım 2: Rswag'i Yapılandırın

### 2.1. Rswag'i Initialize Edin

```bash
rails generate rswag:install
```

Bu komut şunları oluşturur:
- `config/initializers/rswag_api.rb`
- `config/initializers/rswag_ui.rb`
- `swagger_helper.rb` (spec klasöründe)

### 2.2. Routes'a Swagger Endpoint'lerini Ekleyin

`backend/config/routes.rb` dosyasına ekleyin:

```ruby
Rails.application.routes.draw do
  # ... mevcut route'lar ...
  
  # Swagger documentation
  mount Rswag::Api::Engine => '/api-docs'
  mount Rswag::Ui::Engine => '/api-docs'
  
  # Health check
  get '/health', to: proc { [200, {}, ['OK']] }
end
```

---

## 📋 Adım 3: Swagger Helper Dosyasını Yapılandırın

`backend/spec/swagger_helper.rb` dosyasını düzenleyin:

```ruby
require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  config.swagger_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'TalkToAvatar API V1',
        version: 'v1',
        description: 'API documentation for TalkToAvatar backend',
        contact: {
          name: 'API Support',
          email: 'support@talktoavatar.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://api.talktoavatar.com',
          description: 'Production server'
        }
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: 'JWT'
          }
        }
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          variables: {
            defaultHost: {
              default: 'localhost:3000'
            }
          }
        }
      ]
    }
  }

  # Specify the format of the output Swagger file
  config.swagger_format = :yaml
end
```

---

## 📋 Adım 4: Swagger Spec Dosyaları Oluşturun

### 4.1. Auth Endpoints için Spec

`backend/spec/swagger/v1/auth_spec.rb` dosyası oluşturun:

```ruby
require 'swagger_helper'

RSpec.describe 'Auth API', type: :request do
  path '/api/v1/auth/register' do
    post 'Register a new user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, example: 'user@example.com' },
          username: { type: :string, example: 'johndoe' },
          password: { type: :string, example: 'password123' },
          password_confirmation: { type: :string, example: 'password123' }
        },
        required: ['email', 'username', 'password', 'password_confirmation']
      }

      response '201', 'User registered successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            user_id: { type: :integer },
            email: { type: :string },
            email_sent: { type: :boolean }
          },
          required: ['message', 'user_id', 'email']

        let(:user) { { email: 'test@example.com', username: 'testuser', password: 'password123', password_confirmation: 'password123' } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:user) { { email: 'invalid' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/login' do
    post 'Login user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, example: 'user@example.com' },
          password: { type: :string, example: 'password123' }
        },
        required: ['email', 'password']
      }

      response '200', 'Login successful' do
        schema type: :object,
          properties: {
            token: { type: :string },
            user: {
              type: :object,
              properties: {
                id: { type: :integer },
                email: { type: :string },
                username: { type: :string }
              }
            }
          },
          required: ['token', 'user']

        let(:user) { User.create!(email: 'test@example.com', username: 'testuser', password: 'password123', password_confirmation: 'password123', email_verified: true) }
        let(:credentials) { { email: 'test@example.com', password: 'password123' } }
        run_test!
      end

      response '401', 'Invalid credentials' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:credentials) { { email: 'test@example.com', password: 'wrong' } }
        run_test!
      end
    end
  end
end
```

### 4.2. Courses Endpoints için Spec

`backend/spec/swagger/v1/courses_spec.rb` dosyası oluşturun:

```ruby
require 'swagger_helper'

RSpec.describe 'Courses API', type: :request do
  let(:user) { User.create!(email: 'test@example.com', username: 'testuser', password: 'password123', password_confirmation: 'password123', email_verified: true) }
  let(:token) { JwtHelper.encode(user_id: user.id) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{token}" } }

  path '/api/v1/courses' do
    get 'List all courses' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Courses retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              title: { type: :string },
              description: { type: :string },
              language_code: { type: :string },
              level: { type: :string },
              status: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1') }
        run_test!
      end

      response '401', 'Unauthorized' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:auth_headers) { {} }
        run_test!
      end
    end

    post 'Create a new course' do
      tags 'Courses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :course, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, example: 'English A1 Course' },
          description: { type: :string, example: 'Beginner English course' },
          language_code: { type: :string, example: 'en' },
          level: { type: :string, example: 'A1' }
        },
        required: ['title', 'language_code', 'level']
      }

      response '201', 'Course created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            course: {
              type: :object,
              properties: {
                id: { type: :integer },
                title: { type: :string },
                description: { type: :string },
                language_code: { type: :string },
                level: { type: :string },
                status: { type: :string }
              }
            }
          }

        let(:course) { { title: 'New Course', language_code: 'en', level: 'A1' } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:course) { { title: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get a course' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Course retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :integer },
            title: { type: :string },
            description: { type: :string },
            language_code: { type: :string },
            level: { type: :string },
            status: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end

      response '404', 'Course not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { 99999 }
        run_test!
      end
    end

    put 'Update a course' do
      tags 'Courses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :course, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          description: { type: :string },
          language_code: { type: :string },
          level: { type: :string }
        }
      }

      response '200', 'Course updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            course: {
              type: :object,
              properties: {
                id: { type: :integer },
                title: { type: :string },
                description: { type: :string }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:course) { { title: 'Updated Course' } }
        run_test!
      end
    end

    delete 'Delete a course' do
      tags 'Courses'
      security [bearer_auth: []]

      response '200', 'Course deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/subjects' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get course subjects' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Subjects retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              topic: { type: :string },
              title: { type: :string },
              progress_percentage: { type: :number },
              completed_sentences: { type: :integer },
              total_sentences: { type: :integer }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/recordings' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get course recordings' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Recordings retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              topic: { type: :string },
              topic_title: { type: :string },
              sentences: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    sentence_id: { type: :string },
                    sentence: { type: :string },
                    recordings: {
                      type: :array,
                      items: {
                        type: :object,
                        properties: {
                          id: { type: :integer },
                          score: { type: :number },
                          created_at: { type: :string, format: :date_time }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/reports' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get course reports' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Reports retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              topic: { type: :string },
              topic_title: { type: :string },
              sentences: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    sentence_id: { type: :string },
                    sentence: { type: :string },
                    reports: {
                      type: :array,
                      items: {
                        type: :object,
                        properties: {
                          id: { type: :integer },
                          score: { type: :number },
                          accuracy_score: { type: :number },
                          fluency_score: { type: :number },
                          completeness_score: { type: :number }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/analyses' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get course analyses' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Analyses retrieved successfully' do
        schema type: :object,
          properties: {
            overall: {
              type: :object,
              properties: {
                avg_score: { type: :number },
                success_rate: { type: :number },
                completion_rate: { type: :number },
                total_recordings: { type: :integer }
              }
            },
            topics: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  topic_title: { type: :string },
                  completed_sentences: { type: :integer },
                  total_sentences: { type: :integer }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/progress' do
    parameter name: :id, in: :path, type: :integer, required: true

    get 'Get course progress' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Progress retrieved successfully' do
        schema type: :object,
          properties: {
            overall_progress: { type: :number },
            topic_progress: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  topic: { type: :string },
                  title: { type: :string },
                  progress: { type: :number },
                  completed_status: { type: :boolean }
                }
              }
            },
            weekly_stats: {
              type: :object,
              properties: {
                practices: { type: :integer },
                avg_score: { type: :number },
                streak: { type: :integer }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        run_test!
      end
    end
  end
end
```

---

## 📋 Adım 5: Swagger JSON/YAML Dosyalarını Generate Edin

```bash
cd backend
RAILS_ENV=test rails rswag:specs:swaggerize
```

Bu komut `swagger/v1/swagger.yaml` dosyasını oluşturur.

---

## 📋 Adım 6: Swagger UI'yi Test Edin

1. Rails sunucusunu başlatın:
```bash
rails server
```

2. Tarayıcıda şu adrese gidin:
```
http://localhost:3000/api-docs
```

Swagger UI'de tüm endpoint'lerinizi görebilir ve test edebilirsiniz.

---

## 📋 Adım 7: Diğer Controller'lar için Spec Dosyaları

Aynı pattern'i kullanarak diğer controller'lar için de spec dosyaları oluşturun:

- `spec/swagger/v1/users_spec.rb`
- `spec/swagger/v1/recordings_spec.rb`
- `spec/swagger/v1/reports_spec.rb`
- `spec/swagger/v1/analyses_spec.rb`
- `spec/swagger/v1/videos_spec.rb`
- `spec/swagger/v1/audios_spec.rb`
- `spec/swagger/v1/custom_avatars_spec.rb`
- `spec/swagger/v1/notifications_spec.rb`
- vb.

---

## 📋 Adım 8: Authentication Helper'ı Ekleyin

`spec/support/swagger_helper_auth.rb` dosyası oluşturun:

```ruby
module SwaggerHelper
  def auth_headers(user)
    token = JwtHelper.encode(user_id: user.id)
    { 'Authorization' => "Bearer #{token}" }
  end

  def create_test_user
    User.create!(
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      password_confirmation: 'password123',
      email_verified: true
    )
  end
end

RSpec.configure do |config|
  config.include SwaggerHelper
end
```

---

## 📋 Adım 9: Production için Yapılandırma

Production'da Swagger UI'yi sadece development/test için açık tutmak için:

`config/initializers/rswag_ui.rb`:

```ruby
Rswag::Ui.configure do |c|
  # Swagger UI'yi sadece development ve test'te göster
  if Rails.env.production?
    c.basic_auth_enabled = true
    c.basic_auth_credentials = {
      username: ENV['SWAGGER_USERNAME'] || 'admin',
      password: ENV['SWAGGER_PASSWORD'] || 'password'
    }
  end
end
```

---

## 📋 Adım 10: README'ye Dokümantasyon Linki Ekleyin

`backend/README.md` dosyasına ekleyin:

```markdown
## API Documentation

Swagger/OpenAPI dokümantasyonu: http://localhost:3000/api-docs

Swagger JSON: http://localhost:3000/api-docs/v1/swagger.yaml
```

---

## ✅ Test Etme

1. Tüm spec'leri çalıştırın:
```bash
bundle exec rspec spec/swagger/
```

2. Swagger UI'yi açın ve endpoint'leri test edin

3. Swagger JSON dosyasını kontrol edin:
```bash
cat swagger/v1/swagger.yaml
```

---

## 🎯 Özet

✅ Rswag gem'leri eklendi
✅ Routes yapılandırıldı
✅ Swagger helper yapılandırıldı
✅ Spec dosyaları oluşturuldu
✅ Swagger JSON generate edildi
✅ Swagger UI erişilebilir

Artık `/api-docs` adresinden tüm API dokümantasyonunuza erişebilirsiniz!

