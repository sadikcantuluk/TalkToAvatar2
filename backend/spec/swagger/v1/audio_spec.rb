require 'swagger_helper'

RSpec.describe 'Audio API', type: :request do
  path '/api/v1/upload_audio' do
    post 'Upload audio file' do
      tags 'Audio'
      consumes 'multipart/form-data'
      produces 'application/json'

      parameter name: :audio, in: :formData, type: :file, required: true, description: 'Audio file'

      response '200', 'Audio uploaded successfully' do
        schema type: :object,
          properties: {
            url: { type: :string, example: 'https://example.com/audio.mp3' }
          }

        # Note: This test may need actual file upload handling
        # For now, we'll skip the actual test
        skip 'Requires actual file upload and Supabase configuration'
      end

      response '400', 'No audio file provided' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:audio) { nil }
        run_test!
      end
    end
  end

  path '/api/v1/evaluate' do
    post 'Evaluate pronunciation' do
      tags 'Audio'
      consumes 'multipart/form-data', 'application/json'
      produces 'application/json'

      parameter name: :audio_file, in: :formData, type: :file, required: false, description: 'Audio file'
      parameter name: :audio_url, in: :formData, type: :string, required: false, description: 'Audio URL'
      parameter name: :reference_text, in: :formData, type: :string, required: true, description: 'Reference text'
      parameter name: :language_code, in: :formData, type: :string, required: false, description: 'Language code (default: en)'

      response '200', 'Pronunciation evaluated successfully' do
        schema type: :object,
          properties: {
            overall_score: { type: :number, example: 85.5 },
            accuracy: { type: :number, example: 90.0 },
            fluency: { type: :number, example: 80.0 },
            completeness: { type: :number, example: 85.0 },
            words: {
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
            },
            transcript: { type: :string },
            reference_text: { type: :string },
            score: { type: :number },
            accuracy_score: { type: :number },
            fluency_score: { type: :number },
            completeness_score: { type: :number },
            word_level_details: { type: :array },
            feedback: { type: :string },
            detailed_scores: {
              type: :object,
              properties: {
                overall: { type: :number },
                accuracy: { type: :number },
                fluency: { type: :number },
                completeness: { type: :number }
              }
            }
          }

        # Note: This test requires actual audio file or Azure Speech Service configuration
        skip 'Requires actual audio file and Azure Speech Service configuration'
      end

      response '400', 'Missing required parameters' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:reference_text) { nil }
        run_test!
      end
    end
  end
end

