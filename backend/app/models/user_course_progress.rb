class UserCourseProgress < ApplicationRecord
  self.table_name = 'user_course_progresses'

  # Associations
  belongs_to :user
  belongs_to :course
  belongs_to :practice_sentence, foreign_key: 'practice_sentence_id'

  # Validations
  validates :user_id, presence: true
  validates :course_id, presence: true
  validates :practice_sentence_id, presence: true
  validates :score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validates :best_score, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validates :attempts, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # Scopes
  scope :for_user, ->(user) { where(user_id: user.id) }
  scope :for_course, ->(course) { where(course_id: course.id) }
  scope :completed, -> { where(completed: true) }
  scope :incomplete, -> { where(completed: false) }
  scope :by_topic, ->(topic) { joins(:practice_sentence).where(practice_sentences: { topic: topic }) }

  # Callbacks
  before_save :update_best_score
  before_save :update_last_practiced_at

  # Constants
  SUCCESS_THRESHOLD = 85

  # Instance methods
  def mark_completed!(score_value = nil)
    # Only mark as completed if score meets success threshold
    if score_value.present? && score_value >= SUCCESS_THRESHOLD
      self.completed = true
      self.score = score_value
    elsif score_value.present?
      # Score provided but below threshold
      self.completed = false
      self.score = score_value
    else
      # No score provided, check current score
      if score.present? && score >= SUCCESS_THRESHOLD
        self.completed = true
      else
        self.completed = false
      end
    end
    self.attempts += 1
    save!
  end

  def record_attempt(score_value)
    self.attempts += 1
    self.score = score_value
    self.last_practiced_at = Time.current
    save!
  end

  private

  def update_best_score
    if score.present? && (best_score.nil? || score > best_score)
      self.best_score = score
    end
  end

  def update_last_practiced_at
    self.last_practiced_at = Time.current if score_changed? || attempts_changed?
  end
end

