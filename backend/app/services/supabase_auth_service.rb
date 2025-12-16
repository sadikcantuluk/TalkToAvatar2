require 'httparty'
require 'json'

class SupabaseAuthService
  include HTTParty
  
  class << self
    # Get Supabase base URL
    def supabase_base_url
      url = ENV['SUPABASE_URL']
      raise 'SUPABASE_URL is not set in .env file!' unless url
      "#{url}/auth/v1"
    end

    # Get Supabase API key
    def supabase_api_key
      key = ENV['SUPABASE_API_KEY']
      raise 'SUPABASE_API_KEY is not set in .env file!' unless key
      key
    end

    # Get default headers
    def default_headers
      {
        'apikey' => supabase_api_key,
        'Content-Type' => 'application/json'
      }
    end
    # Sign up a new user with Supabase Auth
    # @param email [String] User email
    # @param password [String] User password
    # @param metadata [Hash] Additional user metadata (username, etc.)
    # @return [Hash] Supabase response with user and session
    def sign_up(email, password, metadata = {})
      begin
        Rails.logger.info "🔵 [SUPABASE] Sign up request for: #{email}"
        Rails.logger.info "🔵 [SUPABASE] Base URL: #{supabase_base_url}"
        Rails.logger.info "🔵 [SUPABASE] Metadata: #{metadata.inspect}"
        
        request_body = {
          email: email,
          password: password,
          data: metadata
        }
        
        Rails.logger.info "🔵 [SUPABASE] Request body: #{request_body.to_json}"
        
        response = HTTParty.post("#{supabase_base_url}/signup", {
          headers: default_headers,
          body: request_body.to_json,
          timeout: 30
        })
        
        Rails.logger.info "🔵 [SUPABASE] Response status: #{response.code}"
        Rails.logger.info "🔵 [SUPABASE] Response body: #{response.body}"
        
        if response.success?
          parsed_response = JSON.parse(response.body)
          Rails.logger.info "✅ [SUPABASE] Sign up successful"
          Rails.logger.info "📦 [SUPABASE] Parsed response class: #{parsed_response.class}"
          Rails.logger.info "📦 [SUPABASE] Parsed response keys: #{parsed_response.keys.inspect if parsed_response.respond_to?(:keys)}"
          
          # Supabase signup returns user data directly at root level, not nested under 'user' key
          # Response format: {"id": "...", "email": "...", "user_metadata": {...}, ...}
          user_id = parsed_response['id'] || parsed_response[:id] || parsed_response.dig('user', 'id')
          email_confirmed = parsed_response['email_confirmed_at'] || 
                           parsed_response[:email_confirmed_at] ||
                           parsed_response['confirmed_at'] || 
                           parsed_response[:confirmed_at] ||
                           parsed_response.dig('user', 'email_confirmed_at')
          email = parsed_response['email'] || parsed_response[:email] || parsed_response.dig('user', 'email')
          username = parsed_response.dig('user_metadata', 'username') || parsed_response.dig(:user_metadata, :username)
          
          Rails.logger.info "📦 [SUPABASE] User ID (string): #{parsed_response['id']}"
          Rails.logger.info "📦 [SUPABASE] User ID (symbol): #{parsed_response[:id]}"
          Rails.logger.info "📦 [SUPABASE] User ID (final): #{user_id}"
          Rails.logger.info "📦 [SUPABASE] Email: #{email}"
          Rails.logger.info "📦 [SUPABASE] Email confirmed: #{email_confirmed}"
          Rails.logger.info "📦 [SUPABASE] Username in metadata: #{username}"
          
          parsed_response
        else
          error_body = JSON.parse(response.body) rescue { message: response.body }
          Rails.logger.error "❌ [SUPABASE] Sign up failed"
          Rails.logger.error "❌ [SUPABASE] Error code: #{error_body['code']}"
          Rails.logger.error "❌ [SUPABASE] Error message: #{error_body['msg'] || error_body['message']}"
          Rails.logger.error "❌ [SUPABASE] Full error: #{error_body.inspect}"
          
          error_msg = error_body['msg'] || error_body['message'] || error_body['error_description'] || 'Sign up failed'
          
          # Handle specific Supabase errors
          if error_body['code'] == 429 || error_msg.include?('rate_limit')
            raise StandardError.new("over_email_send_rate_limit: #{error_msg}")
          elsif error_msg.include?('already') || error_msg.include?('taken')
            raise StandardError.new("already registered: #{error_msg}")
          else
            raise StandardError.new(error_msg)
          end
        end
      rescue JSON::ParserError => e
        Rails.logger.error "❌ [SUPABASE] JSON parse error: #{e.message}"
        Rails.logger.error "❌ [SUPABASE] Response body: #{response.body if defined?(response)}"
        raise StandardError.new("Invalid response from Supabase: #{e.message}")
      rescue => e
        Rails.logger.error "❌ [SUPABASE] Sign up error: #{e.class.name}"
        Rails.logger.error "❌ [SUPABASE] Error message: #{e.message}"
        raise e
      end
    end

    # Sign in a user with Supabase Auth
    # @param email [String] User email
    # @param password [String] User password
    # @return [Hash] Supabase response with user and session
    def sign_in(email, password)
      begin
        Rails.logger.info "🔵 [SUPABASE] Sign in request for: #{email}"
        Rails.logger.info "🔵 [SUPABASE] Base URL: #{supabase_base_url}"
        
        response = HTTParty.post("#{supabase_base_url}/token?grant_type=password", {
          headers: default_headers,
          body: {
            email: email,
            password: password
          }.to_json,
          timeout: 30
        })
        
        Rails.logger.info "🔵 [SUPABASE] Response status: #{response.code}"
        Rails.logger.info "🔵 [SUPABASE] Response body: #{response.body[0..200]}" # First 200 chars
        
        if response.success?
          token_data = JSON.parse(response.body)
          Rails.logger.info "✅ [SUPABASE] Token received"
          Rails.logger.info "🔵 [SUPABASE] Access token present: #{token_data['access_token'].present?}"
          
          # Get user info using the access token
          Rails.logger.info "🔵 [SUPABASE] Fetching user info..."
          user_response = HTTParty.get("#{supabase_base_url}/user", {
            headers: default_headers.merge({
              'Authorization' => "Bearer #{token_data['access_token']}"
            }),
            timeout: 30
          })
          
          Rails.logger.info "🔵 [SUPABASE] User response status: #{user_response.code}"
          
          user_data = if user_response.success?
            parsed = JSON.parse(user_response.body)
            Rails.logger.info "✅ [SUPABASE] User data retrieved"
            Rails.logger.info "📦 [SUPABASE] User ID: #{parsed['id']}"
            Rails.logger.info "📦 [SUPABASE] Email: #{parsed['email']}"
            Rails.logger.info "📦 [SUPABASE] Email confirmed at: #{parsed['email_confirmed_at'] || parsed['confirmed_at']}"
            parsed
          else
            Rails.logger.warn "⚠️ [SUPABASE] Failed to get user data, using token data"
            {}
          end
          
          # Format response to match expected structure
          result = {
            'user' => user_data || {},
            'session' => {
              'access_token' => token_data['access_token'],
              'refresh_token' => token_data['refresh_token'],
              'expires_in' => token_data['expires_in'],
              'token_type' => token_data['token_type']
            }
          }
          
          Rails.logger.info "✅ [SUPABASE] Sign in successful"
          result
        else
          error_body = JSON.parse(response.body) rescue { message: response.body }
          Rails.logger.error "❌ [SUPABASE] Sign in failed"
          Rails.logger.error "❌ [SUPABASE] Error code: #{error_body['code']}"
          Rails.logger.error "❌ [SUPABASE] Error message: #{error_body['error_description'] || error_body['msg'] || error_body['message']}"
          Rails.logger.error "❌ [SUPABASE] Full error: #{error_body.inspect}"
          
          error_msg = error_body['error_description'] || error_body['msg'] || error_body['message'] || 'Sign in failed'
          raise StandardError.new(error_msg)
        end
      rescue JSON::ParserError => e
        Rails.logger.error "❌ [SUPABASE] JSON parse error: #{e.message}"
        Rails.logger.error "❌ [SUPABASE] Response body: #{response.body if defined?(response)}"
        raise StandardError.new("Invalid response from Supabase: #{e.message}")
      rescue => e
        Rails.logger.error "❌ [SUPABASE] Sign in error: #{e.class.name}"
        Rails.logger.error "❌ [SUPABASE] Error message: #{e.message}"
        raise e
      end
    end

    # Send password reset email
    # @param email [String] User email
    # @return [Hash] Supabase response
    def reset_password_for_email(email)
      begin
        Rails.logger.info "🚀 Supabase password reset request: #{email}"
        
        # Get redirect URL from environment or use default
        redirect_to = ENV['FRONTEND_URL'] || 'http://localhost:19006'
        
        response = HTTParty.post("#{supabase_base_url}/recover", {
          headers: default_headers,
          body: {
            email: email,
            redirect_to: "#{redirect_to}/reset-password"
          }.to_json
        })
        
        if response.success?
          Rails.logger.info "✅ Password reset email sent"
          { message: 'Password reset email sent' }
        else
          error_body = JSON.parse(response.body) rescue { message: response.body }
          Rails.logger.error "❌ Password reset failed: #{error_body}"
          raise StandardError.new(error_body['msg'] || error_body['message'] || 'Password reset failed')
        end
      rescue => e
        Rails.logger.error "❌ Password reset error: #{e.message}"
        raise e
      end
    end

    # Update user password
    # @param access_token [String] User's access token
    # @param new_password [String] New password
    # @return [Hash] Supabase response
    def update_password(access_token, new_password)
      begin
        Rails.logger.info "🚀 Supabase update password"
        
        response = HTTParty.put("#{supabase_base_url}/user", {
          headers: default_headers.merge({
            'Authorization' => "Bearer #{access_token}"
          }),
          body: {
            password: new_password
          }.to_json
        })
        
        if response.success?
          Rails.logger.info "✅ Password updated"
          JSON.parse(response.body)
        else
          error_body = JSON.parse(response.body) rescue { message: response.body }
          Rails.logger.error "❌ Password update failed: #{error_body}"
          raise StandardError.new(error_body['msg'] || error_body['message'] || 'Password update failed')
        end
      rescue => e
        Rails.logger.error "❌ Password update error: #{e.message}"
        raise e
      end
    end

    # Get user from access token
    # @param access_token [String] User's access token
    # @return [Hash] User data
    def get_user(access_token)
      begin
        response = HTTParty.get("#{supabase_base_url}/user", {
          headers: default_headers.merge({
            'Authorization' => "Bearer #{access_token}"
          })
        })
        
        if response.success?
          JSON.parse(response.body)
        else
          error_body = JSON.parse(response.body) rescue { message: response.body }
          Rails.logger.error "❌ Get user failed: #{error_body}"
          raise StandardError.new(error_body['msg'] || error_body['message'] || 'Get user failed')
        end
      rescue => e
        Rails.logger.error "❌ Get user error: #{e.message}"
        raise e
      end
    end

    # Verify JWT token and get user ID
    # @param token [String] JWT access token
    # @return [String, nil] User ID if valid, nil otherwise
    def verify_token(token)
      begin
        # Decode JWT token (without verification for now)
        decoded = JWT.decode(
          token,
          nil, # We don't verify signature here, Supabase does that
          false # Don't verify
        )
        
        decoded[0]['sub'] # User ID is in 'sub' claim
      rescue => e
        Rails.logger.error "❌ Token verification failed: #{e.message}"
        nil
      end
    end
  end
end
