class Audio < ApplicationRecord
  belongs_to :user

  # Validations
  validates :local_uri, presence: true
  validates :text, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_language, ->(lang) { where(language_code: lang) }
  scope :by_voice_type, ->(voice) { where(voice_type: voice) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

