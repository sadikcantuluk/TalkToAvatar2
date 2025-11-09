class PasswordReset < ApplicationRecord
  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :active, -> { where(used: false).where('expires_at > ?', Time.current) }

  def expired?
    Time.current > expires_at
  end

  def self.generate_token
    SecureRandom.urlsafe_base64(32)
  end

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

