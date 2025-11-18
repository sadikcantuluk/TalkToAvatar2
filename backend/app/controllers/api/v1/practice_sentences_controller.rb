module Api
  module V1
    class PracticeSentencesController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/practice_sentences
      def index
        sentences = PracticeSentence.all

        # Filtering
        sentences = sentences.by_language(params[:language_code]) if params[:language_code].present?
        sentences = sentences.by_level(params[:level]) if params[:level].present?
        sentences = sentences.by_topic(params[:topic]) if params[:topic].present?

        # Ordering
        sentences = sentences.ordered

        render json: sentences.map { |sentence|
          {
            id: sentence.id,
            language_code: sentence.language_code,
            level: sentence.level,
            topic: sentence.topic,
            sentence: sentence.sentence,
            order: sentence.order,
            created_at: sentence.created_at,
            updated_at: sentence.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/practice_sentences/:id
      def show
        sentence = PracticeSentence.find_by(id: params[:id])

        unless sentence
          render json: { error: 'Practice sentence not found' }, status: :not_found
          return
        end

        render json: {
          id: sentence.id,
          language_code: sentence.language_code,
          level: sentence.level,
          topic: sentence.topic,
          sentence: sentence.sentence,
          order: sentence.order,
          created_at: sentence.created_at,
          updated_at: sentence.updated_at
        }, status: :ok
      end
    end
  end
end

