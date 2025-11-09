module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:register, :login, :verify_email, :forgot_password, :reset_password]

      # POST /api/v1/auth/register
      def register
        user = User.new(register_params)
        
        if user.save
          # Create email verification
          code = EmailVerification.generate_code
          verification = user.email_verifications.create!(
            code: code.to_s,
            expires_at: 15.minutes.from_now
          )
          
          # Try to send verification email (don't fail if email fails)
          begin
            UserMailer.email_verification(user, code).deliver_later
            email_sent = true
          rescue => e
            Rails.logger.error "Email sending failed: #{e.message}"
            email_sent = false
          end
          
          # Return success message without verification code
          response_data = {
            message: email_sent ? 
              'Registration successful. Please check your email for verification code.' : 
              'Registration successful but email failed to send. Please contact support.',
            user_id: user.id,
            email: user.email,
            email_sent: email_sent
          }
          
          render json: response_data, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Registration error: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { error: e.message }, status: :internal_server_error
      end

      # POST /api/v1/auth/login
      def login
        user = User.find_by(email: login_params[:email]) || 
               User.find_by(username: login_params[:email])
        
        if user && user.authenticate(login_params[:password])
          unless user.email_verified
            render json: { 
              error: 'Email not verified. Please verify your email first.',
              email_verified: false,
              user_id: user.id
            }, status: :unauthorized
            return
          end
          
          token = JwtHelper.encode(user_id: user.id)
          
          render json: {
            token: token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              created_at: user.created_at
            }
          }, status: :ok
        else
          render json: { error: 'Invalid credentials' }, status: :unauthorized
        end
      end

      # POST /api/v1/auth/verify_email
      def verify_email
        user = User.find_by(id: verify_params[:user_id])
        
        unless user
          render json: { error: 'User not found' }, status: :not_found
          return
        end

        verification = user.email_verifications.active.find_by(code: verify_params[:code])
        
        if verification
          if verification.expired?
            render json: { error: 'Verification code expired' }, status: :unprocessable_entity
          else
            verification.update!(verified: true)
            user.update!(email_verified: true)
            
            token = JwtHelper.encode(user_id: user.id)
            
            render json: {
              message: 'Email verified successfully',
              token: token,
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                created_at: user.created_at
              }
            }, status: :ok
          end
        else
          render json: { error: 'Invalid verification code' }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/resend_verification
      def resend_verification
        user = User.find_by(id: resend_params[:user_id])
        
        unless user
          render json: { error: 'User not found' }, status: :not_found
          return
        end

        if user.email_verified
          render json: { error: 'Email already verified' }, status: :unprocessable_entity
          return
        end

        # Invalidate old verifications
        user.email_verifications.update_all(verified: true)
        
        # Create new verification
        code = EmailVerification.generate_code
        verification = user.email_verifications.create!(
          code: code.to_s,
          expires_at: 15.minutes.from_now
        )
        
        # Send verification email
        begin
          UserMailer.email_verification(user, code).deliver_later
          render json: { message: 'Verification code sent successfully' }, status: :ok
        rescue => e
          Rails.logger.error "Email sending failed: #{e.message}"
          render json: { error: 'Failed to send verification email. Please try again.' }, status: :internal_server_error
        end
      end

      # POST /api/v1/auth/forgot_password
      def forgot_password
        user = User.find_by(email: forgot_password_params[:email])
        
        unless user
          render json: { error: 'Email not found' }, status: :not_found
          return
        end

        # Create password reset token
        token = PasswordReset.generate_token
        reset = user.password_resets.create!(
          token: token,
          expires_at: 1.hour.from_now
        )
        
        # Send password reset email
        UserMailer.password_reset(user, token).deliver_later
        
        render json: { 
          message: 'Password reset instructions sent to your email',
          reset_token: token  # In production, don't send this in response
        }, status: :ok
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end

      # POST /api/v1/auth/reset_password
      def reset_password
        reset = PasswordReset.active.find_by(token: reset_password_params[:token])
        
        unless reset
          render json: { error: 'Invalid or expired reset token' }, status: :unprocessable_entity
          return
        end

        user = reset.user
        
        if user.update(password: reset_password_params[:password])
          reset.update!(used: true)
          
          render json: { message: 'Password reset successfully' }, status: :ok
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/auth/profile
      def profile
        render json: {
          user: {
            id: current_user.id,
            username: current_user.username,
            email: current_user.email,
            created_at: current_user.created_at
          }
        }, status: :ok
      end

      # PUT /api/v1/auth/update_profile
      def update_profile
        if update_profile_params[:username].present?
          if current_user.update(username: update_profile_params[:username])
            render json: { 
              message: 'Username updated successfully',
              user: {
                id: current_user.id,
                username: current_user.username,
                email: current_user.email
              }
            }, status: :ok
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Username is required' }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/auth/change_password
      def change_password
        if current_user.authenticate(change_password_params[:current_password])
          if current_user.update(password: change_password_params[:new_password])
            render json: { message: 'Password changed successfully' }, status: :ok
          else
            render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Current password is incorrect' }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/auth/delete_account
      def delete_account
        begin
          # Destroy user - this will cascade delete all related records
          # (recordings, videos, audios, conversations, custom_avatars, email_verifications, password_resets)
          current_user.destroy!
          
          render json: { message: 'Account deleted successfully' }, status: :ok
        rescue => e
          Rails.logger.error "Delete account error: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to delete account' }, status: :internal_server_error
        end
      end

      private

      def register_params
        params.require(:user).permit(:username, :email, :password)
      end

      def login_params
        params.require(:auth).permit(:email, :password)
      end

      def verify_params
        params.permit(:user_id, :code)
      end

      def resend_params
        params.permit(:user_id)
      end

      def forgot_password_params
        params.permit(:email)
      end

      def reset_password_params
        params.permit(:token, :password)
      end

      def update_profile_params
        params.require(:user).permit(:username)
      end

      def change_password_params
        params.require(:password_change).permit(:current_password, :new_password)
      end
    end
  end
end

