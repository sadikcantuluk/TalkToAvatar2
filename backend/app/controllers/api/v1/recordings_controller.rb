module Api
  module V1
    class RecordingsController < ApplicationController
      # POST /api/v1/recordings
      def create
        # Map frontend params to backend format
        # Frontend sends: level, sentence, user_transcript, language_code, user_audio_uri, reference_audio_uri, pronunciation_score
        # Backend expects: level, transcript (user_transcript), reference_text (sentence), score (pronunciation_score), local_uri (user_audio_uri), language_code
        recording_params = params.require(:recording).permit(
          :level, :sentence, :user_transcript, :language_code, 
          :user_audio_uri, :reference_audio_uri, :pronunciation_score
        )

        # Build recording with mapped parameters
        # Ensure required fields are present
        user_audio_uri = recording_params[:user_audio_uri] || recording_params[:reference_audio_uri]
        
        # If no audio URI provided, use a placeholder (validation requires it)
        if user_audio_uri.blank?
          user_audio_uri = 'local://recording_placeholder'
        end
        
        pronunciation_score = recording_params[:pronunciation_score]
        
        # Convert score to number if it's a string, default to 0 if nil
        score_value = if pronunciation_score.nil?
          0
        elsif pronunciation_score.is_a?(String)
          pronunciation_score.to_f
        else
          pronunciation_score.to_f
        end
        
        # Ensure score is within valid range
        score_value = [[score_value, 0].max, 100].min
        
        recording = current_user.recordings.build(
          level: recording_params[:level],
          transcript: recording_params[:user_transcript] || '',
          reference_text: recording_params[:sentence] || '',
          score: score_value,
          local_uri: user_audio_uri,
          language_code: recording_params[:language_code]
        )

        if recording.save
          render json: {
            message: 'Recording created successfully',
            recording: {
              id: recording.id,
              level: recording.level,
              transcript: recording.transcript,
              reference_text: recording.reference_text,
              score: recording.score,
              language_code: recording.language_code,
              created_at: recording.created_at
            }
          }, status: :created
        else
          render json: { errors: recording.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/recordings
      def index
        recordings = current_user.recordings.recent
        
        render json: recordings.map { |recording|
          {
            id: recording.id,
            level: recording.level,
            transcript: recording.transcript,
            reference_text: recording.reference_text,
            score: recording.score,
            language_code: recording.language_code,
            local_uri: recording.local_uri,
            created_at: recording.created_at
          }
        }, status: :ok
      end

      # GET /api/v1/recordings/:id
      def show
        recording = current_user.recordings.find_by(id: params[:id])
        
        unless recording
          render json: { error: 'Recording not found' }, status: :not_found
          return
        end

        render json: {
          id: recording.id,
          level: recording.level,
          transcript: recording.transcript,
          reference_text: recording.reference_text,
          score: recording.score,
          language_code: recording.language_code,
          local_uri: recording.local_uri,
          created_at: recording.created_at,
          updated_at: recording.updated_at
        }, status: :ok
      end

      # DELETE /api/v1/recordings/:id
      def destroy
        recording = current_user.recordings.find_by(id: params[:id])
        
        unless recording
          render json: { error: 'Recording not found' }, status: :not_found
          return
        end

        if recording.destroy
          render json: { message: 'Recording deleted successfully' }, status: :ok
        else
          render json: { errors: recording.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end
end

