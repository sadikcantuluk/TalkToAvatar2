module Api
  module V1
    class UsersController < ApplicationController
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

