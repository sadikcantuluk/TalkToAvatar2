module Api
  module V1
    class SentencesController < ApplicationController
      skip_before_action :authenticate_request, only: [:index, :create_translation]

      # GET /api/v1/sentences?level=A1&language=en
      def index
        level = params[:level]
        language_code = params[:language] || 'en'

        Rails.logger.info "🔍 [DEBUG] Fetching sentences - Level: #{level}, Language: #{language_code}"

        unless %w[A1 A2 B1 B2 C1 C2].include?(level)
          Rails.logger.error "❌ [ERROR] Invalid level: #{level}"
          return render json: { error: 'Invalid level' }, status: :bad_request
        end

        begin
          sentences = SentenceBank.for_practice(level, language_code)
          Rails.logger.info "✅ [SUCCESS] Found #{sentences.count} sentences"
          
          render json: sentences.map { |s| { id: s.id, text: s.sentence, sentence: s.sentence, level: s.level, language_code: s.language_code } }
        rescue => e
          Rails.logger.error "❌ [ERROR] Failed to fetch sentences: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to fetch sentences', details: e.message }, status: :internal_server_error
        end
      end

      # POST /api/v1/sentences/translations
      # Save translated sentences to database
      def create_translation
        level = params[:level]
        language_code = params[:language_code]
        sentence = params[:sentence]

        unless %w[A1 A2 B1 B2 C1 C2].include?(level)
          return render json: { error: 'Invalid level' }, status: :bad_request
        end

        unless sentence.present?
          return render json: { error: 'Sentence is required' }, status: :bad_request
        end

        # Check if this sentence already exists
        existing = SentenceBank.find_by(
          level: level,
          language_code: language_code,
          sentence: sentence
        )

        if existing
          render json: { message: 'Sentence already exists', sentence: existing }, status: :ok
        else
          # Create new sentence
          new_sentence = SentenceBank.create!(
            level: level,
            language_code: language_code,
            sentence: sentence
          )

          render json: { message: 'Translation saved successfully', sentence: new_sentence }, status: :created
        end
      rescue => e
        Rails.logger.error "Error saving translation: #{e.message}"
        render json: { error: 'Failed to save translation' }, status: :internal_server_error
      end
    end
  end
end

