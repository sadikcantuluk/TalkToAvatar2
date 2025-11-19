require 'swagger_helper'

RSpec.describe 'Reports API', type: :request do
  let(:user) do
    u = User.create!(
      email: "report#{SecureRandom.hex(4)}@example.com",
      username: "reportuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }
  let(:course) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1') }

  path '/api/v1/reports' do
    get 'Get all reports' do
      tags 'Reports'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Reports retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              course_id: { type: :string },
              title: { type: :string },
              content: { type: :string },
              report_type: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          course.reports.create!(title: 'Test Report', content: 'Report content', report_type: 'progress')
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

    post 'Create a new report' do
      tags 'Reports'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :report, in: :body, schema: {
        type: :object,
        properties: {
          report: {
            type: :object,
            properties: {
              course_id: { type: :string, example: 'uuid' },
              title: { type: :string, example: 'New Report' },
              content: { type: :string, example: 'Report content' },
              report_type: { type: :string, example: 'progress' }
            },
            required: ['course_id', 'title', 'content', 'report_type']
          }
        }
      }

      response '201', 'Report created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            report: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                title: { type: :string },
                content: { type: :string },
                report_type: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:report) { { report: { course_id: course.id, title: 'New Report', content: 'Content', report_type: 'progress' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:report) { { report: { course_id: course.id, title: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/reports/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Report ID'

    get 'Get report by ID' do
      tags 'Reports'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Report retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            course_id: { type: :string },
            title: { type: :string },
            content: { type: :string },
            report_type: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) { course.reports.create!(title: 'Test Report', content: 'Content', report_type: 'progress').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Report not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    put 'Update a report' do
      tags 'Reports'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :report, in: :body, schema: {
        type: :object,
        properties: {
          report: {
            type: :object,
            properties: {
              title: { type: :string },
              content: { type: :string },
              report_type: { type: :string }
            }
          }
        }
      }

      response '200', 'Report updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            report: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                title: { type: :string },
                content: { type: :string },
                report_type: { type: :string },
                updated_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:id) { course.reports.create!(title: 'Test Report', content: 'Content', report_type: 'progress').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:report) { { report: { title: 'Updated Report' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:id) { course.reports.create!(title: 'Test Report', content: 'Content', report_type: 'progress').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:report) { { report: { title: '' } } }
        run_test!
      end
    end

    delete 'Delete a report' do
      tags 'Reports'
      security [bearer_auth: []]

      response '200', 'Report deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { course.reports.create!(title: 'Test Report', content: 'Content', report_type: 'progress').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Report not found' do
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

