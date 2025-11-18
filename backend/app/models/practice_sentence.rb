class PracticeSentence < ApplicationRecord
  self.table_name = 'practice_sentences'

  # Validations
  validates :language_code, presence: true, length: { is: 2 }
  validates :level, presence: true, inclusion: { in: %w[A1 A2 B1 B2 C1 C2] }
  validates :topic, presence: true, length: { maximum: 50 }
  validates :sentence, presence: true
  validates :order, presence: true, numericality: { only_integer: true, greater_than: 0 }

  # Associations
  has_many :user_course_progresses, foreign_key: 'practice_sentence_id', dependent: :destroy

  # Scopes
  scope :by_language, ->(lang) { where(language_code: lang) }
  scope :by_level, ->(level) { where(level: level) }
  scope :by_topic, ->(topic) { where(topic: topic) }
  scope :ordered, -> { order(:order) }

  # Class methods
  def self.for_course(course)
    where(language_code: course.language_code, level: course.level)
      .ordered
  end

  def self.topics_for_course(course)
    where(language_code: course.language_code, level: course.level)
      .distinct
      .pluck(:topic)
      .sort
  end
end

