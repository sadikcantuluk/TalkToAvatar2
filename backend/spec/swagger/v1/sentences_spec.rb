require 'swagger_helper'

RSpec.describe 'Sentences API', type: :request do
  path '/api/v1/sentences' do
    get 'Get sentences by level' do
      tags 'Sentences'
      produces 'application/json'

      parameter name: :level, in: :query, type: :string, required: true, description: 'Level (A1, A2, B1, B2, C1, C2)'
      parameter name: :language, in: :query, type: :string, required: false, description: 'Language code (default: en)'

      response '200', 'Sentences retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              text: { type: :string },
              sentence: { type: :string },
              level: { type: :string },
              language_code: { type: :string }
            }
          }

        before do
          SentenceBank.create!(
            level: 'A1',
            language_code: 'en',
            sentence: 'Hello, my name is John.'
          )
        end

        let(:level) { 'A1' }
        let(:language) { 'en' }
        run_test!
      end

      response '400', 'Invalid level' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:level) { 'INVALID' }
        run_test!
      end
    end
  end

  path '/api/v1/sentences/translations' do
    post 'Create translation' do
      tags 'Sentences'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :translation, in: :body, schema: {
        type: :object,
        properties: {
          level: { type: :string, example: 'A1' },
          language_code: { type: :string, example: 'en' },
          sentence: { type: :string, example: 'Hello, how are you?' }
        },
        required: ['level', 'language_code', 'sentence']
      }

      response '201', 'Translation saved successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            sentence: {
              type: :object,
              properties: {
                id: { type: :string },
                level: { type: :string },
                language_code: { type: :string },
                sentence: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:translation) { { level: 'A1', language_code: 'en', sentence: 'Hello, how are you?' } }
        run_test!
      end

      response '200', 'Sentence already exists' do
        schema type: :object,
          properties: {
            message: { type: :string },
            sentence: { type: :object }
          }

        before do
          SentenceBank.create!(
            level: 'A1',
            language_code: 'en',
            sentence: 'Hello, how are you?'
          )
        end

        let(:translation) { { level: 'A1', language_code: 'en', sentence: 'Hello, how are you?' } }
        run_test!
      end

      response '400', 'Validation errors' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:translation) { { level: 'INVALID' } }
        run_test!
      end
    end
  end
end

