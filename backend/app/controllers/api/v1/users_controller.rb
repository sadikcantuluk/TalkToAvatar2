module Api
  module V1
    class UsersController < ApplicationController
      # GET /api/v1/users
      def index
        users = User.all.order(created_at: :desc)
        
        render json: users.map { |user|
          {
            id: user.id,
            username: user.username,
            email: user.email,
            email_verified: user.email_verified,
            created_at: user.created_at
          }
        }, status: :ok
      end

      # GET /api/v1/users/:id
      def show
        user = User.find_by(id: params[:id])
        
        unless user
          render json: { error: 'User not found' }, status: :not_found
          return
        end

        render json: {
          id: user.id,
          username: user.username,
          email: user.email,
          email_verified: user.email_verified,
          created_at: user.created_at,
          updated_at: user.updated_at
        }, status: :ok
      end

      # GET /api/v1/users/:id/courses
      def courses
        user = User.find_by(id: params[:id])
        
        unless user
          render json: { error: 'User not found' }, status: :not_found
          return
        end

        courses = user.courses.recent
        
        render json: courses.map { |course|
          {
            id: course.id,
            title: course.title,
            description: course.description,
            language_code: course.language_code,
            level: course.level,
            status: course.status,
            created_at: course.created_at,
            updated_at: course.updated_at
          }
        }, status: :ok
      end

      # POST /api/v1/users
      def create
        user_params = params.require(:user).permit(:name, :email)
        
        # Find or create user
        user = User.find_or_create_by(email: user_params[:email]) do |u|
          u.name = user_params[:name]
        end

        if user.persisted?
          render json: user, status: :ok
        else
          render json: { error: user.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end

