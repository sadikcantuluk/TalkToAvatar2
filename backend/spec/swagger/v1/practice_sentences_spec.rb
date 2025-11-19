require 'swagger_helper'

RSpec.describe 'Practice Sentences API', type: :request do
  let(:user) do
    u = User.create!(
      email: "practice#{SecureRandom.hex(4)}@example.com",
      username: "practiceuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/practice_sentences' do
    get 'Get all practice sentences' do
      tags 'Practice Sentences'
      security [bearer_auth: []]
      produces 'application/json'

      parameter name: :language_code, in: :query, type: :string, required: false, description: 'Language code'
      parameter name: :level, in: :query, type: :string, required: false, description: 'Level (A1, A2, B1, B2, C1, C2)'
      parameter name: :topic, in: :query, type: :string, required: false, description: 'Topic'

      response '200', 'Practice sentences retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              language_code: { type: :string },
              level: { type: :string },
              topic: { type: :string },
              sentence: { type: :string },
              order: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          PracticeSentence.create!(
            language_code: 'en',
            level: 'A1',
            topic: 'greetings',
            sentence: 'Hello, how are you?',
            order: 1
          )
        end

        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '401', 'Unauthorized' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        run_test!
      end
    end
  end

  path '/api/v1/practice_sentences/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Practice Sentence ID'

    get 'Get practice sentence by ID' do
      tags 'Practice Sentences'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Practice sentence retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            language_code: { type: :string },
            level: { type: :string },
            topic: { type: :string },
            sentence: { type: :string },
            order: { type: :integer },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) do
          PracticeSentence.create!(
            language_code: 'en',
            level: 'A1',
            topic: 'greetings',
            sentence: 'Hello, how are you?',
            order: 1
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Practice sentence not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end
end

