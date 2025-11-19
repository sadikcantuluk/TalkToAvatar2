require 'swagger_helper'

RSpec.describe 'Conversations API', type: :request do
  let(:user) do
    u = User.create!(
      email: "conversation#{SecureRandom.hex(4)}@example.com",
      username: "conversationuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/conversations' do
    get 'Get all conversations' do
      tags 'Conversations'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Conversations retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              user_text: { type: :string },
              translated_text: { type: :string },
              user_language: { type: :string },
              target_language: { type: :string },
              created_at: { type: :string, format: :date_time }
            }
          }

        before do
          user.conversations.create!(
            user_text: 'Hello',
            translated_text: 'Hola',
            user_language: 'en',
            target_language: 'es'
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

    post 'Create a new conversation' do
      tags 'Conversations'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :conversation, in: :body, schema: {
        type: :object,
        properties: {
          conversation: {
            type: :object,
            properties: {
              user_text: { type: :string, example: 'Hello' },
              translated_text: { type: :string, example: 'Hola' },
              user_language: { type: :string, example: 'en' },
              target_language: { type: :string, example: 'es' }
            },
            required: ['user_text', 'translated_text', 'user_language', 'target_language']
          }
        }
      }

      response '201', 'Conversation saved successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            conversation: {
              type: :object,
              properties: {
                id: { type: :string },
                user_text: { type: :string },
                translated_text: { type: :string },
                user_language: { type: :string },
                target_language: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:conversation) { { conversation: { user_text: 'Hello', translated_text: 'Hola', user_language: 'en', target_language: 'es' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:conversation) { { conversation: { user_text: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/conversations/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Conversation ID'

    get 'Get conversation by ID' do
      tags 'Conversations'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Conversation retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            user_text: { type: :string },
            translated_text: { type: :string },
            user_language: { type: :string },
            target_language: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) do
          user.conversations.create!(
            user_text: 'Hello',
            translated_text: 'Hola',
            user_language: 'en',
            target_language: 'es'
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Conversation not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    delete 'Delete a conversation' do
      tags 'Conversations'
      security [bearer_auth: []]

      response '200', 'Conversation deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) do
          user.conversations.create!(
            user_text: 'Hello',
            translated_text: 'Hola',
            user_language: 'en',
            target_language: 'es'
          ).id
        end
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Conversation not found' do
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

