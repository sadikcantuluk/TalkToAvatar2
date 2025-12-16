# Filter sensitive parameters from logs
# This prevents sensitive data like passwords, tokens, and verification codes from appearing in logs
# Note: Base filter_parameters are set in config/application.rb
# This initializer extends them with additional sensitive fields

Rails.application.config.filter_parameters += [
  :api_key,
  :secret,
  :credit_card,
  :cvv,
  :ssn,
  :social_security_number
]

