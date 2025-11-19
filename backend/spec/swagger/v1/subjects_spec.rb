require 'swagger_helper'

RSpec.describe 'Subjects API', type: :request do
  let(:user) do
    u = User.create!(
      email: "subject#{SecureRandom.hex(4)}@example.com",
      username: "subjectuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }
  let(:course) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1') }

  path '/api/v1/subjects' do
    get 'Get all subjects' do
      tags 'Subjects'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Subjects retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              course_id: { type: :string },
              title: { type: :string },
              description: { type: :string },
              order: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          course.subjects.create!(title: 'Test Subject', description: 'Test Description')
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

    post 'Create a new subject' do
      tags 'Subjects'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :subject, in: :body, schema: {
        type: :object,
        properties: {
          subject: {
            type: :object,
            properties: {
              course_id: { type: :string, example: 'uuid' },
              title: { type: :string, example: 'New Subject' },
              description: { type: :string, example: 'Subject description' },
              order: { type: :integer, example: 1 }
            },
            required: ['course_id', 'title']
          }
        }
      }

      response '201', 'Subject created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            subject: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                title: { type: :string },
                description: { type: :string },
                order: { type: :integer },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:subject) { { subject: { course_id: course.id, title: 'New Subject', description: 'Description' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:subject) { { subject: { course_id: course.id, title: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/subjects/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Subject ID'

    get 'Get subject by ID' do
      tags 'Subjects'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Subject retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            course_id: { type: :string },
            title: { type: :string },
            description: { type: :string },
            order: { type: :integer },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) { course.subjects.create!(title: 'Test Subject').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Subject not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    put 'Update a subject' do
      tags 'Subjects'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :subject, in: :body, schema: {
        type: :object,
        properties: {
          subject: {
            type: :object,
            properties: {
              title: { type: :string },
              description: { type: :string },
              order: { type: :integer }
            }
          }
        }
      }

      response '200', 'Subject updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            subject: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                title: { type: :string },
                description: { type: :string },
                order: { type: :integer },
                updated_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:id) { course.subjects.create!(title: 'Test Subject').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:subject) { { subject: { title: 'Updated Subject' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:id) { course.subjects.create!(title: 'Test Subject').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:subject) { { subject: { title: '' } } }
        run_test!
      end
    end

    delete 'Delete a subject' do
      tags 'Subjects'
      security [bearer_auth: []]

      response '200', 'Subject deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { course.subjects.create!(title: 'Test Subject').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Subject not found' do
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

