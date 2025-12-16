class UserTopicProgress < ApplicationRecord
  self.table_name = 'user_topic_progress'

  # Associations
  belongs_to :user
  belongs_to :course

  # Validations
  validates :user_id, presence: true
  validates :course_id, presence: true
  validates :topic, presence: true, length: { maximum: 50 }
  validates :progress_percentage, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 100 
  }
  validates :completed_sentences, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 0 
  }
  validates :total_sentences, numericality: { 
    only_integer: true, 
    greater_than_or_equal_to: 0 
  }

  # Scopes
  scope :for_user, ->(user) { where(user_id: user.id) }
  scope :for_course, ->(course) { where(course_id: course.id) }
  scope :for_topic, ->(topic) { where(topic: topic) }
  scope :recent, -> { order(last_updated_at: :desc) }

  # Callbacks
  before_save :update_last_updated_at

  # Class methods
  def self.update_or_create_progress(user, course, topic)
    # Count completed sentences (score >= 85)
    completed_count = UserCourseProgress
      .joins(:practice_sentence)
      .where(
        user_id: user.id,
        course_id: course.id,
        practice_sentences: { topic: topic }
      )
      .where(completed: true)
      .count

    # Count total sentences for this topic (must match course language AND level)
    total_count = PracticeSentence
      .where(language_code: course.language_code, level: course.level, topic: topic)
      .count

    # Calculate progress percentage
    progress_pct = total_count > 0 ? ((completed_count.to_f / total_count) * 100).round : 0

    # Find or create and update
    progress = find_or_initialize_by(
      user_id: user.id,
      course_id: course.id,
      topic: topic
    )

    progress.assign_attributes(
      progress_percentage: progress_pct,
      completed_sentences: completed_count,
      total_sentences: total_count,
      last_updated_at: Time.current
    )

    progress.save!
    # Reload to ensure we have the latest data
    progress.reload
    progress
  end

  private

  def update_last_updated_at
    self.last_updated_at = Time.current if progress_percentage_changed? || 
                                           completed_sentences_changed? || 
                                           total_sentences_changed?
  end
end

