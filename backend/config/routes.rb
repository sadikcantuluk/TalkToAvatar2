Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication
      post '/auth/register', to: 'auth#register'
      post '/auth/login', to: 'auth#login'
      post '/auth/verify_email', to: 'auth#verify_email'
      post '/auth/resend_verification', to: 'auth#resend_verification'
      post '/auth/forgot_password', to: 'auth#forgot_password'
      post '/auth/reset_password', to: 'auth#reset_password'
      get '/auth/profile', to: 'auth#profile'
      put '/auth/update_profile', to: 'auth#update_profile'
      put '/auth/change_password', to: 'auth#change_password'
      delete '/auth/delete_account', to: 'auth#delete_account'
      
      # Users
      post '/users', to: 'users#create'
      
      # Sentences
      get '/sentences', to: 'sentences#index'
      post '/sentences/translations', to: 'sentences#create_translation'

      # Notifications
      get '/notifications', to: 'notifications#index'
      post '/notifications', to: 'notifications#create'
      put '/notifications/:id/mark_read', to: 'notifications#mark_read'
      put '/notifications/mark_all_read', to: 'notifications#mark_all_read'
      delete '/notifications/:id', to: 'notifications#destroy'
      delete '/notifications', to: 'notifications#destroy_all'
      
      # Recordings
      post '/recordings', to: 'recordings#create'
      get '/recordings', to: 'recordings#index'
      get '/recordings/:id', to: 'recordings#show'
      delete '/recordings/:id', to: 'recordings#destroy'
      
      # Audio upload and evaluation
      post '/upload_audio', to: 'audio#upload'
      post '/evaluate', to: 'audio#evaluate'
      
      # Audios
      resources :audios, only: [:index, :create, :show, :destroy]
      
      # Custom Avatars
      resources :custom_avatars, only: [:index, :create, :show, :destroy]
      
      # Videos
      resources :videos, only: [:index, :create, :show, :update, :destroy]
      
      # Conversations
      resources :conversations, only: [:index, :create, :show, :destroy]
    end
  end

  # Health check
  get '/health', to: proc { [200, {}, ['OK']] }
end

