require 'swagger_helper'

RSpec.describe 'Videos API', type: :request do
  let(:user) do
    u = User.create!(
      email: "video#{SecureRandom.hex(4)}@example.com",
      username: "videouser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/videos' do
    get 'Get all videos' do
      tags 'Videos'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Videos retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              local_uri: { type: :string },
              text: { type: :string },
              avatar_info: { type: :object },
              audio_info: { type: :object },
              status: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          user.videos.create!(
            local_uri: 'https://example.com/video.mp4',
            text: 'Hello world',
            status: 'completed',
            avatar_info: { name: 'avatar1' },
            audio_info: { name: 'audio1' }
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

    post 'Create a new video' do
      tags 'Videos'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :video, in: :body, schema: {
        type: :object,
        properties: {
          video: {
            type: :object,
            properties: {
              text: { type: :string, example: 'Hello world' },
              video_uri: { type: :string, example: 'https://example.com/video.mp4' },
              video_url: { type: :string, example: 'https://example.com/video.mp4' },
              name: { type: :string, example: 'Video Name' },
              translated_text: { type: :string, example: 'Translated text' },
              voice_type: { type: :string, example: 'male' },
              language_code: { type: :string, example: 'en' },
              avatar_name: { type: :string, example: 'avatar1' },
              metadata: { type: :object }
            },
            required: ['text']
          }
        }
      }

      response '201', 'Video created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            video: {
              type: :object,
              properties: {
                id: { type: :string },
                local_uri: { type: :string },
                text: { type: :string },
                avatar_info: { type: :object },
                audio_info: { type: :object },
                status: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:video) { { video: { text: 'Hello world', video_uri: 'https://example.com/video.mp4' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:video) { { video: { text: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/videos/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Video ID'

    get 'Get video by ID' do
      tags 'Videos'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Video retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            local_uri: { type: :string },
            text: { type: :string },
            avatar_info: { type: :object },
            audio_info: { type: :object },
            status: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) do
          user.videos.create!(
            local_uri: 'https://example.com/video.mp4',
            text: 'Hello world',
            status: 'completed',
            avatar_info: { name: 'avatar1' },
            audio_info: { name: 'audio1' }
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Video not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    put 'Update a video' do
      tags 'Videos'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :video, in: :body, schema: {
        type: :object,
        properties: {
          video: {
            type: :object,
            properties: {
              local_uri: { type: :string },
              status: { type: :string },
              avatar_info: { type: :object },
              audio_info: { type: :object }
            }
          }
        }
      }

      response '200', 'Video updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            video: {
              type: :object,
              properties: {
                id: { type: :string },
                local_uri: { type: :string },
                text: { type: :string },
                avatar_info: { type: :object },
                audio_info: { type: :object },
                status: { type: :string },
                updated_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:id) do
          user.videos.create!(
            local_uri: 'https://example.com/video.mp4',
            text: 'Hello world',
            status: 'processing',
            avatar_info: { name: 'avatar1' },
            audio_info: { name: 'audio1' }
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        let(:video) { { video: { status: 'completed' } } }
        run_test!
      end

      response '404', 'Video not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        let(:video) { { video: { status: 'completed' } } }
        run_test!
      end
    end

    delete 'Delete a video' do
      tags 'Videos'
      security [bearer_auth: []]

      response '200', 'Video deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) do
          user.videos.create!(
            local_uri: 'https://example.com/video.mp4',
            text: 'Hello world',
            status: 'completed',
            avatar_info: { name: 'avatar1' },
            audio_info: { name: 'audio1' }
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Video not found' do
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

