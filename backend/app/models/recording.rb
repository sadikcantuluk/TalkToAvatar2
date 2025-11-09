class Recording < ApplicationRecord
  # Associations
  belongs_to :user

  # Validations
  validates :local_uri, presence: true
  validates :transcript, presence: true
  validates :reference_text, presence: true
  validates :score, presence: true, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :level, presence: true, inclusion: { in: %w[A1 A2 B1 B2 C1 C2] }

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :by_level, ->(level) { where(level: level) }
  scope :recent, -> { order(created_at: :desc) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

