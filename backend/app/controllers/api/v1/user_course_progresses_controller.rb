module Api
  module V1
    class UserCourseProgressesController < ApplicationController
      before_action :authenticate_user!

      # GET /api/v1/user_course_progresses
      def index
        Rails.logger.debug "🔍 [DEBUG] UserCourseProgressesController#index"
        Rails.logger.debug "📊 [DEBUG] Received params: #{params.inspect}"
        Rails.logger.debug "👤 [DEBUG] Current user: #{current_user.id}"

        progress_records = current_user.user_course_progresses

        # Filter by course
        if params[:course_id].present?
          Rails.logger.debug "🔍 [DEBUG] Filtering by course_id: #{params[:course_id]}"
          course = Course.find_by(id: params[:course_id])
          if course
            progress_records = progress_records.for_course(course)
            Rails.logger.debug "✅ [DEBUG] Course found: #{course.id} - #{course.title}"
          else
            Rails.logger.warn "⚠️ [WARN] Course not found: #{params[:course_id]}"
          end
        end

        # Filter by topic
        if params[:topic].present?
          Rails.logger.debug "🔍 [DEBUG] Filtering by topic: #{params[:topic]}"
          progress_records = progress_records.by_topic(params[:topic])
        end

        # Filter by practice_sentence_id
        if params[:practice_sentence_id].present?
          Rails.logger.debug "🔍 [DEBUG] Filtering by practice_sentence_id: #{params[:practice_sentence_id]}"
          progress_records = progress_records.where(practice_sentence_id: params[:practice_sentence_id])
        end

        Rails.logger.debug "📊 [DEBUG] Found #{progress_records.count} progress records"

        render json: progress_records.map { |progress|
          {
            id: progress.id,
            user_id: progress.user_id,
            course_id: progress.course_id,
            sentence_id: progress.practice_sentence_id,
            practice_sentence_id: progress.practice_sentence_id,
            completed: progress.completed,
            score: progress.score,
            attempts: progress.attempts,
            best_score: progress.best_score,
            last_practiced_at: progress.last_practiced_at,
            created_at: progress.created_at,
            updated_at: progress.updated_at
          }
        }, status: :ok
      end

      # POST /api/v1/user_course_progresses
      def create
        Rails.logger.debug "🔍 [DEBUG] UserCourseProgressesController#create"
        Rails.logger.debug "📊 [DEBUG] Received params: #{params.inspect}"
        Rails.logger.debug "📊 [DEBUG] Progress params: #{progress_params.inspect}"
        Rails.logger.debug "👤 [DEBUG] Current user: #{current_user.id}"

        course_id = progress_params[:course_id]
        Rails.logger.debug "🔍 [DEBUG] Looking for course with ID: #{course_id}"
        
        course = current_user.courses.find_by(id: course_id)
        
        unless course
          Rails.logger.error "❌ [ERROR] Course not found or access denied"
          Rails.logger.error "❌ [ERROR] Course ID: #{course_id}"
          Rails.logger.error "❌ [ERROR] User courses count: #{current_user.courses.count}"
          render json: { error: 'Course not found or access denied' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Course found: #{course.id} - #{course.title}"
        Rails.logger.debug "✅ [DEBUG] Course language: #{course.language_code}, level: #{course.level}"

        practice_sentence_id = progress_params[:practice_sentence_id]
        Rails.logger.debug "🔍 [DEBUG] Looking for practice sentence with ID: #{practice_sentence_id}"
        Rails.logger.debug "🔍 [DEBUG] Practice sentence ID type: #{practice_sentence_id.class}"
        
        sentence = PracticeSentence.find_by(id: practice_sentence_id)
        
        unless sentence
          Rails.logger.error "❌ [ERROR] Practice sentence not found"
          Rails.logger.error "❌ [ERROR] Practice sentence ID: #{practice_sentence_id}"
          Rails.logger.error "❌ [ERROR] Total practice sentences count: #{PracticeSentence.count}"
          Rails.logger.error "❌ [ERROR] Practice sentences for course language/level: #{PracticeSentence.where(language_code: course.language_code, level: course.level).count}"
          
          # Try to find similar sentences for debugging
          similar_sentences = PracticeSentence.where(language_code: course.language_code, level: course.level).limit(5)
          Rails.logger.error "❌ [ERROR] Sample sentences for course: #{similar_sentences.pluck(:id, :sentence).inspect}"
          
          render json: { error: 'Practice sentence not found' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Practice sentence found: #{sentence.id}"
        Rails.logger.debug "✅ [DEBUG] Practice sentence: #{sentence.sentence}"
        Rails.logger.debug "✅ [DEBUG] Practice sentence language: #{sentence.language_code}, level: #{sentence.level}, topic: #{sentence.topic}"

        # Find or initialize progress
        Rails.logger.debug "🔍 [DEBUG] Looking for existing progress..."
        progress = current_user.user_course_progresses.find_or_initialize_by(
          course_id: course.id,
          practice_sentence_id: sentence.id
        )

        Rails.logger.debug "📊 [DEBUG] Progress record: #{progress.new_record? ? 'NEW' : 'EXISTING'}"
        Rails.logger.debug "📊 [DEBUG] Current progress state: #{progress.inspect}"

        # Update progress
        if progress_params[:score].present?
          score_value = progress_params[:score].to_f
          Rails.logger.debug "📊 [DEBUG] Recording attempt with score: #{score_value}"
          progress.record_attempt(score_value)
        end

        if progress_params[:completed] == true || progress_params[:completed] == 'true'
          score_value = progress_params[:score]&.to_f
          Rails.logger.debug "✅ [DEBUG] Marking as completed with score: #{score_value}"
          progress.mark_completed!(score_value)
        end

        Rails.logger.debug "💾 [DEBUG] Saving progress..."
        if progress.save
          Rails.logger.debug "✅ [SUCCESS] Progress saved successfully"
          Rails.logger.debug "📊 [DEBUG] Final progress state: #{progress.inspect}"
          render json: {
            message: 'Progress updated successfully',
            progress: {
              id: progress.id,
              user_id: progress.user_id,
              course_id: progress.course_id,
              sentence_id: progress.practice_sentence_id,
              practice_sentence_id: progress.practice_sentence_id,
              completed: progress.completed,
              score: progress.score,
              attempts: progress.attempts,
              best_score: progress.best_score,
              last_practiced_at: progress.last_practiced_at,
              created_at: progress.created_at,
              updated_at: progress.updated_at
            }
          }, status: :created
        else
          Rails.logger.error "❌ [ERROR] Failed to save progress"
          Rails.logger.error "❌ [ERROR] Errors: #{progress.errors.full_messages.inspect}"
          render json: { errors: progress.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/user_course_progresses/:id
      def update
        Rails.logger.debug "🔍 [DEBUG] UserCourseProgressesController#update"
        Rails.logger.debug "📊 [DEBUG] Received params: #{params.inspect}"
        Rails.logger.debug "📊 [DEBUG] Progress params: #{progress_params.inspect}"
        Rails.logger.debug "👤 [DEBUG] Current user: #{current_user.id}"
        Rails.logger.debug "🔍 [DEBUG] Looking for progress with ID: #{params[:id]}"

        progress = current_user.user_course_progresses.find_by(id: params[:id])

        unless progress
          Rails.logger.error "❌ [ERROR] Progress not found"
          Rails.logger.error "❌ [ERROR] Progress ID: #{params[:id]}"
          Rails.logger.error "❌ [ERROR] User progress count: #{current_user.user_course_progresses.count}"
          render json: { error: 'Progress not found' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Progress found: #{progress.id}"
        Rails.logger.debug "📊 [DEBUG] Current progress state: #{progress.inspect}"

        if progress_params[:score].present?
          score_value = progress_params[:score].to_f
          Rails.logger.debug "📊 [DEBUG] Recording attempt with score: #{score_value}"
          progress.record_attempt(score_value)
        end

        if progress_params[:completed].present?
          if progress_params[:completed] == true || progress_params[:completed] == 'true'
            score_value = progress_params[:score]&.to_f
            Rails.logger.debug "✅ [DEBUG] Marking as completed with score: #{score_value}"
            progress.mark_completed!(score_value)
          else
            Rails.logger.debug "❌ [DEBUG] Marking as incomplete"
            progress.completed = false
          end
        end

        Rails.logger.debug "💾 [DEBUG] Saving progress..."
        if progress.save
          Rails.logger.debug "✅ [SUCCESS] Progress updated successfully"
          Rails.logger.debug "📊 [DEBUG] Final progress state: #{progress.inspect}"
          render json: {
            message: 'Progress updated successfully',
            progress: {
              id: progress.id,
              user_id: progress.user_id,
              course_id: progress.course_id,
              sentence_id: progress.practice_sentence_id,
              practice_sentence_id: progress.practice_sentence_id,
              completed: progress.completed,
              score: progress.score,
              attempts: progress.attempts,
              best_score: progress.best_score,
              last_practiced_at: progress.last_practiced_at,
              updated_at: progress.updated_at
            }
          }, status: :ok
        else
          Rails.logger.error "❌ [ERROR] Failed to update progress"
          Rails.logger.error "❌ [ERROR] Errors: #{progress.errors.full_messages.inspect}"
          render json: { errors: progress.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def progress_params
        permitted = params.require(:user_course_progress).permit(
          :course_id,
          :practice_sentence_id,  # ✅ Changed from :sentence_id
          :completed,
          :score,
          :attempts
        )
        Rails.logger.debug "🔍 [DEBUG] Permitted params: #{permitted.inspect}"
        permitted
      end
    end
  end
end

