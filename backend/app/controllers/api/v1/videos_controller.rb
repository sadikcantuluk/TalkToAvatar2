module Api
  module V1
    class VideosController < ApplicationController
      # GET /api/v1/videos
      def index
        videos = current_user.videos.order(created_at: :desc)
        
        render json: videos.map { |video| 
          {
            id: video.id,
            local_uri: video.local_uri,
            text: video.text,
            avatar_info: video.avatar_info,
            audio_info: video.audio_info,
            status: video.status,
            created_at: video.created_at,
            updated_at: video.updated_at
          }
        }, status: :ok
      end

      # POST /api/v1/videos
      def create
        video = current_user.videos.build(video_params)
        
        if video.save
          render json: {
            message: 'Video created successfully',
            video: {
              id: video.id,
              local_uri: video.local_uri,
              text: video.text,
              avatar_info: video.avatar_info,
              audio_info: video.audio_info,
              status: video.status,
              created_at: video.created_at
            }
          }, status: :created
        else
          render json: { errors: video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/videos/:id
      def show
        video = current_user.videos.find_by(id: params[:id])
        
        unless video
          render json: { error: 'Video not found' }, status: :not_found
          return
        end

        render json: {
          id: video.id,
          local_uri: video.local_uri,
          text: video.text,
          avatar_info: video.avatar_info,
          audio_info: video.audio_info,
          status: video.status,
          created_at: video.created_at,
          updated_at: video.updated_at
        }, status: :ok
      end

      # PUT /api/v1/videos/:id
      def update
        video = current_user.videos.find_by(id: params[:id])
        
        unless video
          render json: { error: 'Video not found' }, status: :not_found
          return
        end

        if video.update(video_update_params)
          render json: {
            message: 'Video updated successfully',
            video: {
              id: video.id,
              local_uri: video.local_uri,
              text: video.text,
              avatar_info: video.avatar_info,
              audio_info: video.audio_info,
              status: video.status,
              updated_at: video.updated_at
            }
          }, status: :ok
        else
          render json: { errors: video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/videos/:id
      def destroy
        video = current_user.videos.find_by(id: params[:id])
        
        unless video
          render json: { error: 'Video not found' }, status: :not_found
          return
        end

        if video.destroy
          render json: { message: 'Video deleted successfully' }, status: :ok
        else
          render json: { errors: video.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def video_params
        # Map frontend params to backend format
        # Frontend sends: name, text, translated_text, voice_type, language_code, avatar_name, video_uri, video_url, metadata
        # Backend expects: local_uri, text, status, avatar_info (JSONB), audio_info (JSONB)
        permitted = params.require(:video).permit(:text, :video_uri, :video_url, :name, :translated_text, :voice_type, :language_code, :avatar_name, metadata: {})
        
        {
          local_uri: permitted[:video_uri],
          text: permitted[:text],
          status: 'processing',
          avatar_info: {
            name: permitted[:avatar_name],
            video_url: permitted[:video_url]
          },
          audio_info: {
            name: permitted[:name],
            translated_text: permitted[:translated_text],
            voice_type: permitted[:voice_type],
            language_code: permitted[:language_code],
            metadata: permitted[:metadata]
          }
        }
      end

      def video_update_params
        params.require(:video).permit(:local_uri, :status, :avatar_info, :audio_info)
      end
    end
  end
end

