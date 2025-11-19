require 'swagger_helper'

RSpec.describe 'Notifications API', type: :request do
  let(:user) do
    u = User.create!(
      email: "notification#{SecureRandom.hex(4)}@example.com",
      username: "notificationuser#{SecureRandom.hex(4)}",
      password: 'Password123',
      password_confirmation: 'Password123'
    )
    u.update!(email_verified: true)
    u
  end
  let(:token) { JwtHelper.encode(user_id: user.id) }

  path '/api/v1/notifications' do
    get 'Get all notifications' do
      tags 'Notifications'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Notifications retrieved successfully' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :string },
              title: { type: :string },
              message: { type: :string },
              type: { type: :string },
              read: { type: :boolean },
              created_at: { type: :string, format: :date_time }
            }
          }

        before do
          user.notifications.create!(
            title: 'Test Notification',
            message: 'Test message',
            type: 'info'
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

    post 'Create a new notification' do
      tags 'Notifications'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'

      parameter name: :notification, in: :body, schema: {
        type: :object,
        properties: {
          notification: {
            type: :object,
            properties: {
              title: { type: :string, example: 'New Notification' },
              message: { type: :string, example: 'Notification message' },
              type: { type: :string, example: 'info' }
            },
            required: ['title', 'message', 'type']
          }
        }
      }

      response '201', 'Notification created successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            notification: {
              type: :object,
              properties: {
                id: { type: :string },
                title: { type: :string },
                message: { type: :string },
                type: { type: :string },
                read: { type: :boolean },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:notification) { { notification: { title: 'New Notification', message: 'Message', type: 'info' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:Authorization) { "Bearer #{token}" }
        let(:notification) { { notification: { title: '' } } }
        run_test!
      end
    end

    delete 'Delete all notifications' do
      tags 'Notifications'
      security [bearer_auth: []]

      response '200', 'All notifications deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          user.notifications.create!(title: 'Test', message: 'Test', type: 'info')
        end

        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/notifications/{id}/mark_read' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Notification ID'

    put 'Mark notification as read' do
      tags 'Notifications'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Notification marked as read' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { user.notifications.create!(title: 'Test', message: 'Test', type: 'info').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Notification not found' do
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

  path '/api/v1/notifications/mark_all_read' do
    put 'Mark all notifications as read' do
      tags 'Notifications'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'All notifications marked as read' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          user.notifications.create!(title: 'Test', message: 'Test', type: 'info', read: false)
        end

        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end
    end
  end

  path '/api/v1/notifications/{id}' do
    parameter name: :id, in: :path, type: :string, required: true, description: 'Notification ID'

    delete 'Delete a notification' do
      tags 'Notifications'
      security [bearer_auth: []]

      response '200', 'Notification deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        let(:id) { user.notifications.create!(title: 'Test', message: 'Test', type: 'info').id }
        let(:Authorization) { "Bearer #{token}" }
        run_test!
      end

      response '404', 'Notification not found' do
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

