module Api
  module V1
    class CustomAvatarsController < ApplicationController
      # GET /api/v1/custom_avatars
      def index
        avatars = current_user.custom_avatars.order(created_at: :desc)
        
        render json: avatars.map { |avatar| 
          {
            id: avatar.id,
            avatar_name: avatar.avatar_name,
            local_uri: avatar.local_uri,
            created_at: avatar.created_at,
            updated_at: avatar.updated_at
          }
        }, status: :ok
      end

      # POST /api/v1/custom_avatars
      def create
        avatar = current_user.custom_avatars.build(custom_avatar_params)
        
        if avatar.save
          render json: {
            message: 'Custom avatar created successfully',
            avatar: {
              id: avatar.id,
              avatar_name: avatar.avatar_name,
              local_uri: avatar.local_uri,
              created_at: avatar.created_at
            }
          }, status: :created
        else
          render json: { errors: avatar.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/custom_avatars/:id
      def show
        avatar = current_user.custom_avatars.find_by(id: params[:id])
        
        unless avatar
          render json: { error: 'Custom avatar not found' }, status: :not_found
          return
        end

        render json: {
          id: avatar.id,
          avatar_name: avatar.avatar_name,
          local_uri: avatar.local_uri,
          created_at: avatar.created_at,
          updated_at: avatar.updated_at
        }, status: :ok
      end

      # DELETE /api/v1/custom_avatars/:id
      def destroy
        avatar = current_user.custom_avatars.find_by(id: params[:id])
        
        unless avatar
          render json: { error: 'Custom avatar not found' }, status: :not_found
          return
        end

        if avatar.destroy
          render json: { message: 'Custom avatar deleted successfully' }, status: :ok
        else
          render json: { errors: avatar.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def custom_avatar_params
        params.require(:custom_avatar).permit(:avatar_name, :local_uri)
      end
    end
  end
end

