require 'swagger_helper'

RSpec.describe 'Courses API', type: :request do
  let(:user) do
    u = User.create!(
      email: "course#{SecureRandom.hex(4)}@example.com",
      username: "courseuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }


  path '/api/v1/courses' do
    get 'List all courses' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Courses retrieved successfully' do
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
        
        let(:Authorization) { "Bearer #{token}" }
        
        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data).to be_an(Array)
        end
      end

      response '401', 'Unauthorized' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        run_test!
      end
    end

    post 'Create a new course' do
      tags 'Courses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :course, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string, example: 'English A1 Course' },
          description: { type: :string, example: 'Beginner English course' },
          language_code: { type: :string, example: 'en' },
          level: { type: :string, example: 'A1' }
        },
        required: ['title', 'language_code', 'level']
      }

      response '201', 'Course created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            course: {
              type: :object,
              properties: {
                id: { type: :string },
                title: { type: :string },
                description: { type: :string },
                language_code: { type: :string },
                level: { type: :string },
                status: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:course) { { title: 'New Course', language_code: 'en', level: 'A1' } }
        let(:Authorization) { "Bearer #{token}" }
        
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:course) { { title: '' } }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get a course' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Course retrieved successfully' do
        schema type: :object,
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

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Course not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:id) { '00000000-0000-0000-0000-000000000000' }
        run_test!
      end
    end

    put 'Update a course' do
      tags 'Courses'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :course, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          description: { type: :string },
          language_code: { type: :string },
          level: { type: :string }
        }
      }

      response '200', 'Course updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            course: {
              type: :object,
              properties: {
                id: { type: :string },
                title: { type: :string },
                description: { type: :string },
                language_code: { type: :string },
                level: { type: :string },
                status: { type: :string },
                updated_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:course) { { title: 'Updated Course' } }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end

    delete 'Delete a course' do
      tags 'Courses'
      security [bearer_auth: []]

      response '200', 'Course deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/subjects' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course subjects' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Subjects retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              topic: { type: :string },
              title: { type: :string },
              progress_percentage: { type: :number },
              completed_sentences: { type: :integer },
              total_sentences: { type: :integer }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/recordings' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course recordings' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Recordings retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              topic: { type: :string },
              topic_title: { type: :string },
              sentences: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    sentence_id: { type: :string },
                    sentence: { type: :string },
                    recordings: {
                      type: :array,
                      items: {
                        type: :object,
                        properties: {
                          id: { type: :integer },
                          score: { type: :number },
                          created_at: { type: :string, format: :date_time }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/reports' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course reports' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Reports retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              topic: { type: :string },
              topic_title: { type: :string },
              sentences: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    sentence_id: { type: :string },
                    sentence: { type: :string },
                    reports: {
                      type: :array,
                      items: {
                        type: :object,
                        properties: {
                          id: { type: :integer },
                          score: { type: :number },
                          accuracy_score: { type: :number },
                          fluency_score: { type: :number },
                          completeness_score: { type: :number }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/analyses' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course analyses' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Analyses retrieved successfully' do
        schema type: :object,
          properties: {
            overall: {
              type: :object,
              properties: {
                avg_score: { type: :string },
                success_rate: { type: :string },
                completion_rate: { type: :string },
                total_recordings: { type: :integer },
                max_score: { type: :string },
                min_score: { type: :string },
                success_count: { type: :integer }
              }
            },
            topics: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  topic_title: { type: :string },
                  completed_sentences: { type: :integer },
                  total_sentences: { type: :integer },
                  total_recordings: { type: :integer }
                }
              }
            },
            time_series: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  date: { type: :string, format: :date },
                  avg_score: { type: :string },
                  practices: { type: :integer }
                }
              }
            },
            error_analysis: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  error_type: { type: :string },
                  count: { type: :integer }
                }
              }
            }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/progress' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course progress' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Progress retrieved successfully' do
        schema type: :object,
          properties: {
            overall_progress: { type: :number },
            topic_progress: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  topic: { type: :string },
                  title: { type: :string },
                  progress: { type: :number },
                  completed_status: { type: :boolean }
                }
              }
            },
            weekly_stats: {
              type: :object,
              properties: {
                practices: { type: :integer },
                avg_score: { type: :number },
                streak: { type: :integer }
              }
            },
            completed_sentences: { type: :integer }
          }

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/practice_sentences' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course practice sentences' do
      tags 'Courses'
      security [bearer_auth: []]
      produces 'application/json'

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

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/courses/{id}/videos' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Course ID'

    get 'Get course videos' do
      tags 'Courses'
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
          course = Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1')
          user.videos.create!(
            local_uri: 'https://example.com/video.mp4',
            text: 'Hello world',
            status: 'completed',
            avatar_info: { name: 'avatar1' },
            audio_info: { name: 'audio1' }
          )
        end

        let(:id) { Course.create!(user: user, title: 'Test Course', language_code: 'en', level: 'A1').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end
end

