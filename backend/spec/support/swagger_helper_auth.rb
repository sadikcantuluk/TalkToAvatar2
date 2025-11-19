module SwaggerHelper
  def auth_headers(user)
    token = JwtHelper.encode(user_id: user.id)
    { 'Authorization' => "Bearer #{token}" }
  end

  def create_test_user
    user = User.create!(
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      password_confirmation: 'password123'
    )
    user.update!(email_verified: true)
    user
  end
end

RSpec.configure do |config|
  config.include SwaggerHelper
end

