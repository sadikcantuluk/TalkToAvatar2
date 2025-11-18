module Api
  module V1
    class CoursesController < ApplicationController
      # GET /api/v1/courses
      def index
        courses = current_user.courses.recent
        
        render json: courses.map { |course|
          {
            id: course.id,
            title: course.title,
            description: course.description,
            language_code: course.language_code,
            level: course.level,
            status: course.status,
            created_at: course.created_at,
            updated_at: course.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/courses/:id
      def show
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        render json: {
          id: course.id,
          title: course.title,
          description: course.description,
          language_code: course.language_code,
          level: course.level,
          status: course.status,
          created_at: course.created_at,
          updated_at: course.updated_at
        }, status: :ok
      end

      # POST /api/v1/courses
      def create
        course = current_user.courses.build(course_params)
        
        if course.save
          render json: {
            message: 'Course created successfully',
            course: {
              id: course.id,
              title: course.title,
              description: course.description,
              language_code: course.language_code,
              level: course.level,
              status: course.status,
              created_at: course.created_at
            }
          }, status: :created
        else
          render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/courses/:id
      def update
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        if course.update(course_params)
          render json: {
            message: 'Course updated successfully',
            course: {
              id: course.id,
              title: course.title,
              description: course.description,
              language_code: course.language_code,
              level: course.level,
              status: course.status,
              updated_at: course.updated_at
            }
          }, status: :ok
        else
          render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/courses/:id
      def destroy
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        if course.destroy
          render json: { message: 'Course deleted successfully' }, status: :ok
        else
          render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/courses/:id/subjects
      def subjects
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        subjects = course.subjects.ordered
        
        render json: subjects.map { |subject|
          {
            id: subject.id,
            title: subject.title,
            description: subject.description,
            order: subject.order,
            created_at: subject.created_at,
            updated_at: subject.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/courses/:id/videos
      def videos
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        videos = course.videos.recent
        
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

      # GET /api/v1/courses/:id/reports
      def reports
        Rails.logger.debug "🔍 [DEBUG] CoursesController#reports"
        Rails.logger.debug "📊 [DEBUG] Course ID: #{params[:id]}"

        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          Rails.logger.error "❌ [ERROR] Course not found: #{params[:id]}"
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Course found: #{course.id} - #{course.title}"

        # Fetch recordings (reports are derived from recordings)
        recordings = Recording
          .for_course(course)
          .includes(:practice_sentence)
          .recent
        
        Rails.logger.debug "📊 [DEBUG] Total recordings found: #{recordings.count}"

        # Group by topic and sentence, then limit to last 3 per sentence
        grouped_by_sentence = recordings.group_by { |r| [r.topic, r.practice_sentence_id] }
        
        # Limit to last 3 recordings per sentence
        limited_recordings = grouped_by_sentence.transform_values { |recs| recs.take(3) }
          .values
          .flatten
        
        # Group by topic for final structure
        grouped_by_topic = limited_recordings.group_by(&:topic)
        
        Rails.logger.debug "📊 [DEBUG] Grouped by topic: #{grouped_by_topic.keys.count} topics"

        # Format response: Topic > Sentence > Reports (from recordings)
        result = grouped_by_topic.map do |topic, topic_recordings|
          {
            topic: topic || 'unknown',
            topic_title: (topic || 'unknown').humanize,
            sentences: topic_recordings.group_by(&:practice_sentence_id).map do |sentence_id, sentence_recordings|
              sentence = sentence_recordings.first.practice_sentence
              {
                sentence_id: sentence_id,
                sentence: sentence ? sentence.sentence : sentence_recordings.first.reference_text,
                reports: sentence_recordings.map { |r|
                  {
                    id: r.id,
                    score: r.score,
                    accuracy_score: r.accuracy,
                    fluency_score: r.fluency,
                    completeness_score: r.completeness,
                    transcript: r.transcript,
                    reference_text: r.reference_text,
                    words: r.words || [],
                    word_level_details: r.words || [], # Alias for compatibility
                    created_at: r.created_at,
                    updated_at: r.updated_at
                  }
                }
              }
            end
          }
        end
        
        Rails.logger.debug "✅ [DEBUG] Returning #{result.count} topics with reports"
        
        render json: result, status: :ok
      end

      # GET /api/v1/courses/:id/analyses
      def analyses
        Rails.logger.debug "🔍 [DEBUG] CoursesController#analyses"
        Rails.logger.debug "📊 [DEBUG] Course ID: #{params[:id]}"

        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          Rails.logger.error "❌ [ERROR] Course not found: #{params[:id]}"
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Course found: #{course.id} - #{course.title}"

        # Get all recordings for this course
        recordings = Recording.for_course(course).includes(:practice_sentence)
        progress_records = current_user.user_course_progresses.for_course(course).includes(:practice_sentence)
        
        # Calculate aggregated statistics
        total_recordings = recordings.count
        total_sentences = PracticeSentence.for_course(course).count
        completed_sentences = progress_records.completed.count
        
        # Score statistics
        scores = recordings.where.not(score: nil).pluck(:score)
        avg_score = scores.any? ? (scores.sum / scores.count).round(2) : 0
        max_score = scores.any? ? scores.max.round(2) : 0
        min_score = scores.any? ? scores.min.round(2) : 0
        
        # Success rate (score >= 85)
        success_count = scores.count { |s| s >= 85 }
        success_rate = scores.any? ? ((success_count.to_f / scores.count) * 100).round(2) : 0
        
        # Topic-wise statistics
        topics = PracticeSentence.topics_for_course(course)
        topic_stats = topics.map do |topic|
          topic_recordings = recordings.by_topic(topic)
          topic_scores = topic_recordings.where.not(score: nil).pluck(:score)
          topic_progress = progress_records.select { |p| p.practice_sentence&.topic == topic }
          
          {
            topic: topic,
            topic_title: topic.humanize,
            total_sentences: PracticeSentence.for_course(course).by_topic(topic).count,
            completed_sentences: topic_progress.count { |p| p.completed },
            total_recordings: topic_recordings.count,
            avg_score: topic_scores.any? ? (topic_scores.sum / topic_scores.count).round(2) : 0,
            success_rate: topic_scores.any? ? ((topic_scores.count { |s| s >= 85 }.to_f / topic_scores.count) * 100).round(2) : 0
          }
        end
        
        # Time-series data (last 7 days)
        week_ago = 7.days.ago
        daily_stats = (0..6).map do |days_back|
          date = (days_back.days.ago).beginning_of_day
          day_recordings = recordings.where('recordings.created_at >= ? AND recordings.created_at < ?', date, date + 1.day)
          day_scores = day_recordings.where.not(score: nil).pluck(:score)
          
          {
            date: date.to_date.iso8601,
            recordings_count: day_recordings.count,
            avg_score: day_scores.any? ? (day_scores.sum / day_scores.count).round(2) : 0,
            practices: day_recordings.count
          }
        end.reverse
        
        # Error analysis (from word-level details)
        error_types = {}
        recordings.where.not(words: nil).find_each do |recording|
          next unless recording.words.is_a?(Array)
          
          recording.words.each do |word|
            if word.is_a?(Hash) && word['error_type'].present?
              error_type = word['error_type']
              error_types[error_type] = (error_types[error_type] || 0) + 1
            end
          end
        end
        
        result = {
          overall: {
            total_sentences: total_sentences,
            completed_sentences: completed_sentences,
            completion_rate: total_sentences > 0 ? ((completed_sentences.to_f / total_sentences) * 100).round(2) : 0,
            total_recordings: total_recordings,
            avg_score: avg_score,
            max_score: max_score,
            min_score: min_score,
            success_rate: success_rate,
            success_count: success_count,
            total_attempts: scores.count
          },
          topics: topic_stats,
          time_series: daily_stats,
          error_analysis: error_types.map { |type, count| { error_type: type, count: count } }
        }
        
        Rails.logger.debug "✅ [DEBUG] Returning analysis data"
        
        render json: result, status: :ok
      end

      # GET /api/v1/courses/:id/recordings
      def recordings
        Rails.logger.debug "🔍 [DEBUG] CoursesController#recordings"
        Rails.logger.debug "📊 [DEBUG] Course ID: #{params[:id]}"
        Rails.logger.debug "👤 [DEBUG] Current user: #{current_user.id}"

        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          Rails.logger.error "❌ [ERROR] Course not found: #{params[:id]}"
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        Rails.logger.debug "✅ [DEBUG] Course found: #{course.id} - #{course.title}"

        # Fetch recordings with practice sentence
        recordings = Recording
          .for_course(course)
          .includes(:practice_sentence)
          .recent
        
        Rails.logger.debug "📊 [DEBUG] Total recordings found: #{recordings.count}"

        # Group by topic and sentence, then limit to last 3 per sentence
        grouped_by_sentence = recordings.group_by { |r| [r.topic, r.practice_sentence_id] }
        
        Rails.logger.debug "📊 [DEBUG] Grouped by sentence: #{grouped_by_sentence.keys.count} unique sentences"
        
        # Limit to last 3 recordings per sentence
        limited_recordings = grouped_by_sentence.transform_values { |recs| recs.take(3) }
          .values
          .flatten
        
        Rails.logger.debug "📊 [DEBUG] After limiting: #{limited_recordings.count} recordings"
        
        # Group by topic for final structure
        grouped_by_topic = limited_recordings.group_by(&:topic)
        
        Rails.logger.debug "📊 [DEBUG] Grouped by topic: #{grouped_by_topic.keys.count} topics"

        # Format response: Topic > Sentence > Recordings
        result = grouped_by_topic.map do |topic, topic_recordings|
          {
            topic: topic || 'unknown',
            topic_title: (topic || 'unknown').humanize,
            sentences: topic_recordings.group_by(&:practice_sentence_id).map do |sentence_id, sentence_recordings|
              sentence = sentence_recordings.first.practice_sentence
              {
                sentence_id: sentence_id,
                sentence: sentence ? sentence.sentence : sentence_recordings.first.reference_text,
                recordings: sentence_recordings.map { |r|
                  {
                    id: r.id,
                    score: r.score,
                    accuracy_score: r.accuracy,
                    fluency_score: r.fluency,
                    completeness_score: r.completeness,
                    transcript: r.transcript,
                    words: r.words || [],
                    audio_uri: r.local_uri,
                    created_at: r.created_at,
                    updated_at: r.updated_at
                  }
                }
              }
            end
          }
        end
        
        Rails.logger.debug "✅ [DEBUG] Returning #{result.count} topics with recordings"
        
        render json: result, status: :ok
      end

      # GET /api/v1/courses/:id/practice_sentences
      def practice_sentences
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        sentences = PracticeSentence.for_course(course)
        
        # Filter by topic if provided
        sentences = sentences.by_topic(params[:topic]) if params[:topic].present?

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

      # GET /api/v1/courses/:id/subjects (Updated to return topics)
      def subjects
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        # Get topics from practice sentences
        topics = PracticeSentence.topics_for_course(course)
        
        # Get user progress for each topic
        progress_records = current_user.user_course_progresses
          .for_course(course)
          .includes(:practice_sentence)

        # Build subjects (topics) with progress
        subjects_data = topics.map do |topic|
          topic_sentences = PracticeSentence.for_course(course).by_topic(topic)
          topic_progress = progress_records.select { |p| p.practice_sentence.topic == topic }
          
          completed_count = topic_progress.count { |p| p.completed }
          total_count = topic_sentences.count
          progress_percentage = total_count > 0 ? (completed_count.to_f / total_count * 100).round : 0
          
          {
            id: topic, # Use topic as ID for now
            title: topic.humanize,
            topic: topic,
            description: "Practice sentences for #{topic.humanize}",
            order: topics.index(topic) + 1,
            total_sentences: total_count,
            completed_sentences: completed_count,
            progress_percentage: progress_percentage,
            completed: completed_count == total_count && total_count > 0,
            created_at: course.created_at,
            updated_at: course.updated_at
          }
        end

        render json: subjects_data, status: :ok
      end

      # GET /api/v1/courses/:id/progress
      def progress
        course = current_user.courses.find_by(id: params[:id])
        
        unless course
          render json: { error: 'Course not found' }, status: :not_found
          return
        end

        # Get all topics for this course
        topics = PracticeSentence.topics_for_course(course)
        
        # Get user progress
        progress_records = current_user.user_course_progresses
          .for_course(course)
          .includes(:practice_sentence)

        # Calculate overall progress
        total_sentences = PracticeSentence.for_course(course).count
        completed_sentences = progress_records.completed.count
        overall_progress = total_sentences > 0 ? (completed_sentences.to_f / total_sentences * 100).round : 0

        # Calculate topic progress
        topic_progress = topics.map do |topic|
          topic_sentences = PracticeSentence.for_course(course).by_topic(topic)
          topic_progress_records = progress_records.select { |p| p.practice_sentence.topic == topic }
          
          completed = topic_progress_records.count { |p| p.completed }
          total = topic_sentences.count
          progress_pct = total > 0 ? (completed.to_f / total * 100).round : 0
          
          {
            topic: topic,
            title: topic.humanize,
            completed: completed,
            total: total,
            progress: progress_pct,
            completed_status: completed == total && total > 0
          }
        end

        # Calculate average score
        scores = progress_records.where.not(score: nil).pluck(:score)
        avg_score = scores.any? ? (scores.sum / scores.count).round : 0

        # Weekly stats
        week_ago = 7.days.ago
        recent_progress = progress_records.where('last_practiced_at >= ?', week_ago)
        weekly_practices = recent_progress.count
        weekly_scores = recent_progress.where.not(score: nil).pluck(:score)
        weekly_avg_score = weekly_scores.any? ? (weekly_scores.sum / weekly_scores.count).round : 0

        render json: {
          overall_progress: overall_progress,
          total_sentences: total_sentences,
          completed_sentences: completed_sentences,
          average_score: avg_score,
          topic_progress: topic_progress,
          weekly_stats: {
            practices: weekly_practices,
            avg_score: weekly_avg_score
          }
        }, status: :ok
      end

      private

      def course_params
        params.require(:course).permit(:title, :description, :language_code, :level, :status)
      end
    end
  end
end
