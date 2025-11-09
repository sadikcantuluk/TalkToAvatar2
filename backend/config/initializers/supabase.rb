# Supabase Configuration
# Note: We connect to Supabase PostgreSQL directly via database.yml
# For API calls, we use HTTParty if needed

# Supabase URL and keys are stored in environment variables
# SUPABASE_URL and SUPABASE_API_KEY are available via ENV

Rails.logger.info "Supabase connection configured via PostgreSQL" if ENV['DATABASE_URL']

