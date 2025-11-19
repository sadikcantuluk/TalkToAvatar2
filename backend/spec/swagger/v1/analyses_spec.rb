require 'swagger_helper'

RSpec.describe 'Analyses API', type: :request do
  let(:user) do
    u = User.create!(
      email: "analysis#{SecureRandom.hex(4)}@example.com",
      username: "analysisuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }
  let(:course) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1') }

  path '/api/v1/analyses' do
    get 'Get all analyses' do
      tags 'Analyses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Analyses retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              course_id: { type: :string },
              analysis_type: { type: :string },
              data: { type: :object },
              summary: { type: :string },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            }
          }

        before do
          course.analyses.create!(
            analysis_type: 'performance',
            data: { score: 85 },
            summary: 'Good performance'
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

    post 'Create a new analysis' do
      tags 'Analyses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :analysis, in: :body, schema: {
        type: :object,
        properties: {
          analysis: {
            type: :object,
            properties: {
              course_id: { type: :string, example: 'uuid' },
              analysis_type: { type: :string, example: 'performance' },
              data: { type: :object, example: { score: 85 } },
              summary: { type: :string, example: 'Analysis summary' }
            },
            required: ['course_id', 'analysis_type', 'data']
          }
        }
      }

      response '201', 'Analysis created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            analysis: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                analysis_type: { type: :string },
                data: { type: :object },
                summary: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:analysis) { { analysis: { course_id: course.id, analysis_type: 'performance', data: { score: 85 }, summary: 'Summary' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:analysis) { { analysis: { course_id: course.id, analysis_type: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/analyses/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Analysis ID'

    get 'Get analysis by ID' do
      tags 'Analyses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Analysis retrieved successfully' do
        schema type: :object,
          properties: {
            id: { type: :string },
            course_id: { type: :string },
            analysis_type: { type: :string },
            data: { type: :object },
            summary: { type: :string },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          }

        let(:id) { course.analyses.create!(analysis_type: 'performance', data: { score: 85 }, summary: 'Summary').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Analysis not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    put 'Update an analysis' do
      tags 'Analyses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :analysis, in: :body, schema: {
        type: :object,
        properties: {
          analysis: {
            type: :object,
            properties: {
              analysis_type: { type: :string },
              data: { type: :object },
              summary: { type: :string }
            }
          }
        }
      }

      response '200', 'Analysis updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            analysis: {
              type: :object,
              properties: {
                id: { type: :string },
                course_id: { type: :string },
                analysis_type: { type: :string },
                data: { type: :object },
                summary: { type: :string },
                updated_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:id) { course.analyses.create!(analysis_type: 'performance', data: { score: 85 }, summary: 'Summary').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:analysis) { { analysis: { summary: 'Updated Summary' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:id) { course.analyses.create!(analysis_type: 'performance', data: { score: 85 }, summary: 'Summary').id }
        let(:Authorization) { "Bearer #{token}" }
        let(:analysis) { { analysis: { analysis_type: '' } } }
        run_test!
      end
    end

    delete 'Delete an analysis' do
      tags 'Analyses'
      security [bearer_auth: []]

      response '200', 'Analysis deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { course.analyses.create!(analysis_type: 'performance', data: { score: 85 }, summary: 'Summary').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Analysis not found' do
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

