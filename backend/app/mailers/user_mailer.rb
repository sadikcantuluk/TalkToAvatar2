class UserMailer < ApplicationMailer
  default from: ENV['MAIL_ADDRESS'] || 'noreply@talktoavatar.com'

  def email_verification(user, code)
    @user = user
    @code = code
    @expires_in = 15 # minutes
    
    mail(
      to: @user.email,
      subject: 'TalkToAvatar - Email Verification'
    )
  end

  def password_reset(user, token)
    @user = user
    @reset_url = "#{ENV['FRONTEND_URL']}/reset-password?token=#{token}"
    @expires_in = 60 # minutes
    
    mail(
      to: @user.email,
      subject: 'TalkToAvatar - Password Reset'
    )
  end
end

