Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
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
      resources :users, only: [:index, :show, :create]
      get '/users/:id/courses', to: 'users#courses'
      
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
      
      # Courses (Sualingo Mode)
      resources :courses, only: [:index, :create, :show, :update, :destroy]
      get '/courses/:id/subjects', to: 'courses#subjects'
      get '/courses/:id/videos', to: 'courses#videos'
      get '/courses/:id/reports', to: 'courses#reports'
      get '/courses/:id/analyses', to: 'courses#analyses'
      get '/courses/:id/recordings', to: 'courses#recordings'
      get '/courses/:id/practice_sentences', to: 'courses#practice_sentences'
      get '/courses/:id/progress', to: 'courses#progress'
      
      # Practice Sentences
      resources :practice_sentences, only: [:index, :show]
      
      # User Course Progress
      resources :user_course_progresses, only: [:index, :create, :update]
      
      # User Topic Progress
      get '/courses/:course_id/topic_progress', to: 'user_topic_progresses#index'
      post '/user_topic_progress', to: 'user_topic_progresses#create'
      
      # Subjects (Sualingo Mode)
      resources :subjects, only: [:index, :create, :show, :update, :destroy]
      
      # Reports (Sualingo Mode)
      resources :reports, only: [:index, :create, :show, :update, :destroy]
      
      # Analyses (Sualingo Mode)
      resources :analyses, only: [:index, :create, :show, :update, :destroy]
    end
  end

  # Health check
  get '/health', to: proc { [200, {}, ['OK']] }
end

