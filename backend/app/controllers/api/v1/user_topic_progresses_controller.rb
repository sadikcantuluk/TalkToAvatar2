module Api
  module V1
    class UserTopicProgressesController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/courses/:course_id/topic_progress
      def index
        course = current_user.courses.find_by(id: params[:course_id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        # Get all topics for this course
        topics = PracticeSentence.topics_for_course(course)
        
        # Get or create progress for each topic
        progress_data = topics.map do |topic|
          # Always use update_or_create_progress to ensure data is current
          progress = UserTopicProgress.update_or_create_progress(current_user, course, topic)

          {
            topic: topic,
            title: topic.humanize,
            progress: progress.progress_percentage,
            completed_sentences: progress.completed_sentences,
            total_sentences: progress.total_sentences,
            last_updated_at: progress.last_updated_at
          }
        end

        render json: { topic_progress: progress_data }, status: :ok
      end

      # POST /api/v1/user_topic_progress
      def create
        course = current_user.courses.find_by(id: topic_progress_params[:course_id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        topic = topic_progress_params[:topic]
        
        unless topic.present?
          render json: { error: 'Topic is required' }, status: :unprocessable_entity
          return
        end

        # Update or create progress
        progress = UserTopicProgress.update_or_create_progress(
          current_user,
          course,
          topic
        )

        render json: {
          message: 'Topic progress updated successfully',
          progress: {
            id: progress.id,
            user_id: progress.user_id,
            course_id: progress.course_id,
            topic: progress.topic,
            progress_percentage: progress.progress_percentage,
            completed_sentences: progress.completed_sentences,
            total_sentences: progress.total_sentences,
            last_updated_at: progress.last_updated_at
          }
        }, status: :created
      end

      private

      def topic_progress_params
        params.require(:user_topic_progress).permit(:course_id, :topic)
      end
    end
  end
end

