require 'json'

module Api
  module V1
    class RecordingsController < ApplicationController
      # POST /api/v1/recordings
      def create
        # Map frontend params to backend format
        # Frontend sends: level, sentence, user_transcript, language_code, user_audio_uri, reference_audio_uri, pronunciation_score
        # Backend expects: level, transcript (user_transcript), reference_text (sentence), score (pronunciation_score), local_uri (user_audio_uri), language_code
        # Permit basic parameters first
        recording_params = params.require(:recording).permit(
          :level, :sentence, :user_transcript, :language_code, 
          :user_audio_uri, :reference_audio_uri, :pronunciation_score,
          :accuracy_score, :fluency_score, :completeness_score,
          :course_id, :practice_sentence_id, :topic
        )
        
        # Manually handle word_level_details array (Rails strong parameters doesn't handle array of hashes well)
        word_level_details = []
        if params[:recording][:word_level_details].present?
          word_level_details_raw = params[:recording][:word_level_details]
          
          # Handle both array and JSON string
          word_level_details = if word_level_details_raw.is_a?(Array)
            # Clean each hash in the array - only allow permitted keys
            word_level_details_raw.map do |word_hash|
              if word_hash.is_a?(Hash) || word_hash.is_a?(ActionController::Parameters)
                word_hash = word_hash.to_unsafe_h if word_hash.is_a?(ActionController::Parameters)
                {
                  'word' => word_hash['word'] || word_hash[:word],
                  'accuracy_score' => (word_hash['accuracy_score'] || word_hash[:accuracy_score] || 0).to_f,
                  'error_type' => word_hash['error_type'] || word_hash[:error_type],
                  'offset' => (word_hash['offset'] || word_hash[:offset] || 0).to_i,
                  'duration' => (word_hash['duration'] || word_hash[:duration] || 0).to_i
                }
              else
                nil
              end
            end.compact
          elsif word_level_details_raw.is_a?(String)
            begin
              JSON.parse(word_level_details_raw)
            rescue JSON::ParserError
              []
            end
          else
            []
          end
        end

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
        
        # Extract detailed scores
        accuracy = recording_params[:accuracy_score] ? recording_params[:accuracy_score].to_f : 0.0
        fluency = recording_params[:fluency_score] ? recording_params[:fluency_score].to_f : 0.0
        completeness = recording_params[:completeness_score] ? recording_params[:completeness_score].to_f : 0.0
        
        # Use word_level_details (already processed above)
        words = word_level_details
        
        Rails.logger.info "=== Saving Recording with Word Details ==="
        Rails.logger.info "Word level details count: #{words.length}"
        Rails.logger.info "Word level details sample: #{words.first(3).inspect}" if words.any?
        
        # Ensure scores are within valid range
        accuracy = [[accuracy, 0].max, 100].min
        fluency = [[fluency, 0].max, 100].min
        completeness = [[completeness, 0].max, 100].min
        
        # Validate course_id if provided
        course_id = recording_params[:course_id]
        if course_id.present?
          course = current_user.courses.find_by(id: course_id)
          unless course
            render json: { error: 'Course not found or access denied' }, status: :not_found
            return
          end
        end

        # Get practice_sentence_id and topic if provided
        practice_sentence_id = recording_params[:practice_sentence_id]
        topic = recording_params[:topic]

        recording = current_user.recordings.build(
          level: recording_params[:level],
          transcript: recording_params[:user_transcript] || '',
          reference_text: recording_params[:sentence] || '',
          score: score_value,
          local_uri: user_audio_uri,
          language_code: recording_params[:language_code],
          accuracy: accuracy,
          fluency: fluency,
          completeness: completeness,
          words: words,
          course_id: course_id,
          practice_sentence_id: practice_sentence_id,
          topic: topic
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
              accuracy: recording.accuracy,
              fluency: recording.fluency,
              completeness: recording.completeness,
              words: recording.words,
              course_id: recording.course_id,
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
            accuracy: recording.accuracy,
            fluency: recording.fluency,
            completeness: recording.completeness,
            words: recording.words,
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
          accuracy: recording.accuracy,
          fluency: recording.fluency,
          completeness: recording.completeness,
          words: recording.words,
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

