class SentenceBank < ApplicationRecord
  # Validations
  validates :level, presence: true, inclusion: { in: %w[A1 A2 B1 B2 C1 C2] }
  validates :language_code, presence: true
  validates :sentence, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :by_level, ->(level) { where(level: level) }
  scope :by_language, ->(language_code) { where(language_code: language_code) }
  scope :for_practice, ->(level, language_code) { by_level(level).by_language(language_code) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

