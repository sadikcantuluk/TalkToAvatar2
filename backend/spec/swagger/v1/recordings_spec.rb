require 'swagger_helper'

RSpec.describe 'Recordings API', type: :request do
  let(:user) do
    u = User.create!(
      email: "recording#{SecureRandom.hex(4)}@example.com",
      username: "recordinguser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/recordings' do
    get 'Get all recordings' do
      tags 'Recordings'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Recordings retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              level: { type: :string },
              transcript: { type: :string },
              reference_text: { type: :string },
              score: { type: :number },
              language_code: { type: :string },
              local_uri: { type: :string },
              accuracy: { type: :number },
              fluency: { type: :number },
              completeness: { type: :number },
              words: { type: :array, items: { type: :object } },
              created_at: { type: :string, format: :date_time }
            }
          }

        before do
          user.recordings.create!(
            level: 'A1',
            transcript: 'Hello world',
            reference_text: 'Hello world',
            score: 85.5,
            local_uri: 'https://example.com/audio.mp3',
            language_code: 'en'
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

    post 'Create a new recording' do
      tags 'Recordings'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :recording, in: :body, schema: {
        type: :object,
        properties: {
          recording: {
            type: :object,
            properties: {
              level: { type: :string, example: 'A1' },
              sentence: { type: :string, example: 'Hello world' },
              user_transcript: { type: :string, example: 'Hello world' },
              language_code: { type: :string, example: 'en' },
              user_audio_uri: { type: :string, example: 'https://example.com/audio.mp3' },
              pronunciation_score: { type: :number, example: 85.5 },
              accuracy_score: { type: :number, example: 90.0 },
              fluency_score: { type: :number, example: 80.0 },
              completeness_score: { type: :number, example: 85.0 },
              course_id: { type: :string },
              practice_sentence_id: { type: :string },
              topic: { type: :string },
              word_level_details: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    word: { type: :string },
                    accuracy_score: { type: :number },
                    error_type: { type: :string },
                    offset: { type: :integer },
                    duration: { type: :integer }
                  }
                }
              }
            },
            required: ['level', 'sentence', 'user_audio_uri']
          }
        }
      }

      response '201', 'Recording created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            recording: {
              type: :object,
              properties: {
                id: { type: :string },
                level: { type: :string },
                transcript: { type: :string },
                reference_text: { type: :string },
                score: { type: :number },
                language_code: { type: :string },
                accuracy: { type: :number },
                fluency: { type: :number },
                completeness: { type: :number },
                words: { type: :array },
                course_id: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:recording) do
          {
            recording: {
              level: 'A1',
              sentence: 'Hello world',
              user_transcript: 'Hello world',
              language_code: 'en',
              user_audio_uri: 'https://example.com/audio.mp3',
              pronunciation_score: 85.5
            }
          }
        end
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:recording) { { recording: { level: 'A1' } } }
        run_test!
      end
    end
  end

  path '/api/v1/recordings/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Recording ID'

    get 'Get recording by ID' do
      tags 'Recordings'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Recording retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            level: { type: :string },
            transcript: { type: :string },
            reference_text: { type: :string },
            score: { type: :number },
            language_code: { type: :string },
            local_uri: { type: :string },
            accuracy: { type: :number },
            fluency: { type: :number },
            completeness: { type: :number },
            words: { type: :array },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) do
          user.recordings.create!(
            level: 'A1',
            transcript: 'Hello world',
            reference_text: 'Hello world',
            score: 85.5,
            local_uri: 'https://example.com/audio.mp3',
            language_code: 'en'
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Recording not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    delete 'Delete a recording' do
      tags 'Recordings'
      security [bearer_auth: []]

      response '200', 'Recording deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) do
          user.recordings.create!(
            level: 'A1',
            transcript: 'Hello world',
            reference_text: 'Hello world',
            score: 85.5,
            local_uri: 'https://example.com/audio.mp3',
            language_code: 'en'
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Recording not found' do
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

