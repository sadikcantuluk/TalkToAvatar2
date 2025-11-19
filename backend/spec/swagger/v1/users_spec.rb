require 'swagger_helper'

RSpec.describe 'Users API', type: :request do
  let(:user) do
    u = User.create!(
      email: "user#{SecureRandom.hex(4)}@example.com",
      username: "user#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/users' do
    get 'Get all users' do
      tags 'Users'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Users retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              username: { type: :string },
              email: { type: :string },
              email_verified: { type: :boolean },
              created_at: { type: :string, format: :date_time }
            }
          }

        before do
          User.create!(
            email: "user1#{SecureRandom.hex(4)}@example.com",
            username: "user1#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
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

    post 'Create or get user' do
      tags 'Users'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              name: { type: :string, example: 'John Doe' },
              email: { type: :string, example: 'john@example.com' }
            },
            required: ['email']
          }
        }
      }

      response '200', 'User created or retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            name: { type: :string },
            email: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:user) { { user: { name: 'John Doe', email: "newuser#{SecureRandom.hex(4)}@example.com" } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            error: { type: :array, items: { type: :string } }
          }

        let(:user) { { user: { email: 'invalid-email' } } }
        run_test!
      end
    end
  end

  path '/api/v1/users/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'User ID'

    get 'Get user by ID' do
      tags 'Users'
      produces 'application/json'

      response '200', 'User retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            username: { type: :string },
            email: { type: :string },
            email_verified: { type: :boolean },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) { user.id }
        run_test!
      end

      response '404', 'User not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        run_test!
      end
    end
  end

  path '/api/v1/users/{id}/courses' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'User ID'

    get 'Get user courses' do
      tags 'Users'
      produces 'application/json'

      response '200', 'User courses retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              title: { type: :string },
              description: { type: :string },
              language_code: { type: :string },
              level: { type: :string },
              status: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1')
        end

        let(:id) { user.id }
        run_test!
      end

      response '404', 'User not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        run_test!
      end
    end
  end
end

