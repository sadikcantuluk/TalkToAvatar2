module Api
  module V1
    class AudiosController < ApplicationController
      # GET /api/v1/audios
      def index
        audios = current_user.audios.order(created_at: :desc)
        
        render json: audios.map { |audio| 
          {
            id: audio.id,
            local_uri: audio.local_uri,
            text: audio.text,
            translated_text: audio.translated_text,
            voice_type: audio.voice_type,
            language_code: audio.language_code,
            avatar_name: audio.avatar_name,
            created_at: audio.created_at
          }
        }, status: :ok
      end

      # POST /api/v1/audios
      def create
        audio = current_user.audios.build(audio_params)
        
        if audio.save
          render json: {
            message: 'Audio saved successfully',
            audio: {
              id: audio.id,
              local_uri: audio.local_uri,
              text: audio.text,
              translated_text: audio.translated_text,
              voice_type: audio.voice_type,
              language_code: audio.language_code,
              avatar_name: audio.avatar_name,
              created_at: audio.created_at
            }
          }, status: :created
        else
          render json: { errors: audio.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/audios/:id
      def show
        audio = current_user.audios.find_by(id: params[:id])
        
        unless audio
          render json: { error: 'Audio not found' }, status: :not_found
          return
        end

        render json: {
          id: audio.id,
          local_uri: audio.local_uri,
          text: audio.text,
          translated_text: audio.translated_text,
          voice_type: audio.voice_type,
          language_code: audio.language_code,
          avatar_name: audio.avatar_name,
          created_at: audio.created_at,
          updated_at: audio.updated_at
        }, status: :ok
      end

      # DELETE /api/v1/audios/:id
      def destroy
        audio = current_user.audios.find_by(id: params[:id])
        
        unless audio
          render json: { error: 'Audio not found' }, status: :not_found
          return
        end

        if audio.destroy
          render json: { message: 'Audio deleted successfully' }, status: :ok
        else
          render json: { errors: audio.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def audio_params
        params.require(:audio).permit(
          :local_uri, 
          :text, 
          :translated_text, 
          :voice_type, 
          :language_code, 
          :avatar_name
        )
      end
    end
  end
end

