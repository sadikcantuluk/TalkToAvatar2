class Notification < ApplicationRecord
  belongs_to :user

  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :message, presence: true
  validates :type, presence: true, inclusion: { in: %w[success error info warning video_ready] }

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :unread, -> { where(read: false) }
  scope :read_notifications, -> { where(read: true) }
  scope :by_type, ->(type) { where(type: type) }
  scope :recent, -> { order(created_at: :desc) }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

