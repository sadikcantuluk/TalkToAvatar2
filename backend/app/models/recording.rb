class Recording < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :course, optional: true
  belongs_to :practice_sentence, optional: true

  # Validations
  validates :local_uri, presence: true
  validates :transcript, presence: true, allow_blank: true  # Allow blank transcript if Azure fails
  validates :reference_text, presence: true
  validates :score, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :level, presence: true, inclusion: { in: %w[A1 A2 B1 B2 C1 C2] }
  
  # Set default transcript if blank
  before_validation :set_default_transcript, if: -> { transcript.blank? }

  # Callbacks
  before_create :set_uuid
  before_save :set_topic_from_sentence, if: -> { practice_sentence_id.present? }
  after_create :cleanup_old_recordings, if: -> { practice_sentence_id.present? && course_id.present? }

  # Scopes
  scope :by_level, ->(level) { where(level: level) }
  scope :recent, -> { order(created_at: :desc) }
  scope :for_course, ->(course) { where(course_id: course.id) }
  scope :by_topic, ->(topic) { where(topic: topic) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
  
  def set_default_transcript
    self.transcript = '(No transcript available)' if transcript.blank?
  end

  def set_topic_from_sentence
    return unless practice_sentence
    
    self.topic = practice_sentence.topic
  end

  def cleanup_old_recordings
    # Keep only last 3 recordings per sentence
    # Find all recordings for this user, course, and sentence (excluding current)
    old_recordings = Recording
      .where(
        user_id: user_id,
        course_id: course_id,
        practice_sentence_id: practice_sentence_id
      )
      .where.not(id: id)
      .order(created_at: :desc)
    
    # If we have more than 2 (this is the 3rd), delete the rest
    if old_recordings.count >= 2
      old_recordings.offset(2).destroy_all
    end
  end
end

