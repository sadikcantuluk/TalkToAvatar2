require 'swagger_helper'

RSpec.describe 'Auth API', type: :request do
  path '/api/v1/auth/register' do
    post 'Register a new user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, example: 'user@example.com' },
              username: { type: :string, example: 'johndoe' },
              password: { type: :string, example: 'Password123' },
              password_confirmation: { type: :string, example: 'Password123' }
            },
            required: ['email', 'username', 'password', 'password_confirmation']
          }
        }
      }

      response '201', 'User registered successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            user_id: { type: :string },
            email: { type: :string },
            email_sent: { type: :boolean }
          },
          required: ['message', 'user_id', 'email']

        let(:user) { { user: { email: "test#{SecureRandom.hex(4)}@example.com", username: "testuser#{SecureRandom.hex(4)}", password: 'Password123', password_confirmation: 'Password123' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        let(:user) { { user: { email: 'invalid-email' } } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/login' do
    post 'Login user' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :auth, in: :body, schema: {
        type: :object,
        properties: {
          auth: {
            type: :object,
            properties: {
              email: { type: :string, example: 'user@example.com' },
              password: { type: :string, example: 'Password123' }
            },
            required: ['email', 'password']
          }
        }
      }

      response '200', 'Login successful' do
        schema type: :object,
          properties: {
            token: { type: :string },
            user: {
              type: :object,
              properties: {
                id: { type: :string },
                email: { type: :string },
                username: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          },
          required: ['token', 'user']

        before do
          @test_user = User.create!(
            email: "login#{SecureRandom.hex(4)}@example.com",
            username: "loginuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:auth) { { auth: { email: @test_user.email, password: 'Password123' } } }
        run_test!
      end

      response '401', 'Invalid credentials' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:auth) { { auth: { email: 'nonexistent@example.com', password: 'WrongPassword123' } } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/verify_email' do
    post 'Verify email' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :verification, in: :body, schema: {
        type: :object,
        properties: {
          user_id: { type: :string, example: 'uuid' },
          code: { type: :string, example: '123456' }
        },
        required: ['user_id', 'code']
      }

      response '200', 'Email verified successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            token: { type: :string },
            user: {
              type: :object,
              properties: {
                id: { type: :string },
                email: { type: :string },
                username: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          },
          required: ['message', 'token', 'user']

        before do
          @test_user = User.create!(
            email: "verify#{SecureRandom.hex(4)}@example.com",
            username: "verifyuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @verification = @test_user.email_verifications.create!(
            code: '123456',
            expires_at: 15.minutes.from_now
          )
        end

        let(:verification) { { user_id: @test_user.id, code: '123456' } }
        run_test!
      end

      response '422', 'Invalid verification code' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:verification) { { user_id: '00000000-0000-0000-0000-000000000000', code: '000000' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/resend_verification' do
    post 'Resend verification code' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :request, in: :body, schema: {
        type: :object,
        properties: {
          user_id: { type: :string, example: 'uuid' }
        },
        required: ['user_id']
      }

      response '200', 'Verification code sent successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "resend#{SecureRandom.hex(4)}@example.com",
            username: "resenduser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
        end

        let(:request) { { user_id: @test_user.id } }
        run_test!
      end

      response '404', 'User not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:request) { { user_id: '00000000-0000-0000-0000-000000000000' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/forgot_password' do
    post 'Forgot password' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :request, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, example: 'user@example.com' }
        },
        required: ['email']
      }

      response '200', 'Password reset instructions sent' do
        schema type: :object,
          properties: {
            message: { type: :string },
            reset_token: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "forgot#{SecureRandom.hex(4)}@example.com",
            username: "forgotuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:request) { { email: @test_user.email } }
        run_test!
      end

      response '404', 'Email not found' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:request) { { email: 'nonexistent@example.com' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/reset_password' do
    post 'Reset password' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :request, in: :body, schema: {
        type: :object,
        properties: {
          token: { type: :string, example: 'reset-token' },
          password: { type: :string, example: 'NewPassword123' }
        },
        required: ['token', 'password']
      }

      response '200', 'Password reset successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "reset#{SecureRandom.hex(4)}@example.com",
            username: "resetuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
          @reset = @test_user.password_resets.create!(
            token: 'reset-token',
            expires_at: 1.hour.from_now
          )
        end

        let(:request) { { token: 'reset-token', password: 'NewPassword123' } }
        run_test!
      end

      response '422', 'Invalid or expired token' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        let(:request) { { token: 'invalid-token', password: 'NewPassword123' } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/profile' do
    get 'Get user profile' do
      tags 'Authentication'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Profile retrieved successfully' do
        schema type: :object,
          properties: {
            user: {
              type: :object,
              properties: {
                id: { type: :string },
                username: { type: :string },
                email: { type: :string },
                created_at: { type: :string, format: :date_time }
              }
            }
          }

        before do
          @test_user = User.create!(
            email: "profile#{SecureRandom.hex(4)}@example.com",
            username: "profileuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
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
  end

  path '/api/v1/auth/update_profile' do
    put 'Update user profile' do
      tags 'Authentication'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              username: { type: :string, example: 'newusername' }
            },
            required: ['username']
          }
        }
      }

      response '200', 'Profile updated successfully' do
        schema type: :object,
          properties: {
            message: { type: :string },
            user: {
              type: :object,
              properties: {
                id: { type: :string },
                username: { type: :string },
                email: { type: :string }
              }
            }
          }

        before do
          @test_user = User.create!(
            email: "update#{SecureRandom.hex(4)}@example.com",
            username: "updateuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
        let(:user) { { user: { username: 'newusername' } } }
        run_test!
      end

      response '422', 'Validation errors' do
        schema type: :object,
          properties: {
            errors: { type: :array, items: { type: :string } }
          }

        before do
          @test_user = User.create!(
            email: "update2#{SecureRandom.hex(4)}@example.com",
            username: "updateuser2#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
        let(:user) { { user: { username: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/change_password' do
    put 'Change password' do
      tags 'Authentication'
      security [bearer_auth: []]
      consumes 'application/json'
      produces 'application/json'
      
      parameter name: :password_change, in: :body, schema: {
        type: :object,
        properties: {
          password_change: {
            type: :object,
            properties: {
              current_password: { type: :string, example: 'Password123' },
              new_password: { type: :string, example: 'NewPassword123' }
            },
            required: ['current_password', 'new_password']
          }
        }
      }

      response '200', 'Password changed successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "changepass#{SecureRandom.hex(4)}@example.com",
            username: "changepassuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
        let(:password_change) { { password_change: { current_password: 'Password123', new_password: 'NewPassword123' } } }
        run_test!
      end

      response '422', 'Current password incorrect' do
        schema type: :object,
          properties: {
            error: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "changepass2#{SecureRandom.hex(4)}@example.com",
            username: "changepassuser2#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
        let(:password_change) { { password_change: { current_password: 'WrongPassword', new_password: 'NewPassword123' } } }
        run_test!
      end
    end
  end

  path '/api/v1/auth/delete_account' do
    delete 'Delete account' do
      tags 'Authentication'
      security [bearer_auth: []]
      produces 'application/json'

      response '200', 'Account deleted successfully' do
        schema type: :object,
          properties: {
            message: { type: :string }
          }

        before do
          @test_user = User.create!(
            email: "delete#{SecureRandom.hex(4)}@example.com",
            username: "deleteuser#{SecureRandom.hex(4)}",
            password: 'Password123',
            password_confirmation: 'Password123'
          )
          @test_user.update!(email_verified: true)
        end

        let(:Authorization) { "Bearer #{JwtHelper.encode(user_id: @test_user.id)}" }
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
  end
end

