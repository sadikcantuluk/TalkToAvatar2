require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true

  # Action Mailer settings
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
  
  # Suppress detailed mail content in logs for security
  # Only log delivery status, not email body content
  mail_logger = ActiveSupport::Logger.new(STDOUT).tap do |logger|
    logger.formatter = proc do |severity, datetime, progname, msg|
      if msg.is_a?(String)
        # Filter out email body content
        filtered_msg = msg
        # Remove full email content between boundaries
        filtered_msg = filtered_msg.gsub(/----==_mimepart_.*?----==_mimepart_/m, '[EMAIL CONTENT FILTERED]')
        # Filter verification codes
        filtered_msg = filtered_msg.gsub(/Verification Code: \d+/, 'Verification Code: [FILTERED]')
        filtered_msg = filtered_msg.gsub(/code.*?(\d{4,6})/, 'code: [FILTERED]')
        filtered_msg = filtered_msg.gsub(/(\d{4,6})/, '[CODE]') if filtered_msg.include?('verification') || filtered_msg.include?('code')
        "#{severity} -- #{datetime}: #{filtered_msg}\n"
      else
        "#{severity} -- #{datetime}: #{msg}\n"
      end
    end
  end
  
  config.action_mailer.logger = mail_logger
  # Also filter ActiveJob logs for mail delivery
  config.active_job.logger = mail_logger
  
  config.action_mailer.smtp_settings = {
    address: 'smtp.gmail.com',
    port: 587,
    domain: 'gmail.com',
    user_name: ENV['MAIL_ADDRESS'],
    password: ENV['MAIL_APP_PASSWORD'],
    authentication: 'plain',
    enable_starttls_auto: true
  }
end

