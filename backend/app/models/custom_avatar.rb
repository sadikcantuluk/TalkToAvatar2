class CustomAvatar < ApplicationRecord
  belongs_to :user

  # Validations
  validates :avatar_name, presence: true, length: { maximum: 255 }
  validates :local_uri, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_name, ->(name) { where('avatar_name ILIKE ?', "%#{name}%") }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

