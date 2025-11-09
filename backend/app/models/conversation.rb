class Conversation < ApplicationRecord
  belongs_to :user

  # Validations
  validates :user_text, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_language, ->(lang) { where(user_language: lang).or(where(target_language: lang)) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

