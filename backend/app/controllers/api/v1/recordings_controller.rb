module Api
  module V1
    class RecordingsController < ApplicationController
      # POST /api/v1/recordings
      def create
        recording_params = params.require(:recording).permit(
          :user_id, :audio_url, :transcript, :reference_text, :score, :level
        )

        recording = Recording.new(recording_params)

        if recording.save
          render json: recording, status: :created
        else
          render json: { error: recording.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/recordings/:user_id
      def show
        user = User.find(params[:id])
        recordings = user.recordings.recent

        render json: recordings
      end

      # DELETE /api/v1/recordings/:id
      def destroy
        recording = Recording.find(params[:id])
        recording.destroy

        head :no_content
      end
    end
  end
end

