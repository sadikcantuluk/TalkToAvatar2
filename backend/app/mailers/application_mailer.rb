class ApplicationMailer < ActionMailer::Base
  default from: ENV['MAIL_ADDRESS'] || 'noreply@talktoavatar.com'
  layout 'mailer'
end

