class EmailVerification < ApplicationRecord
  belongs_to :user

  validates :code, presence: true
  validates :expires_at, presence: true

  # Callbacks
  before_create :set_uuid

  # Scopes
  scope :active, -> { where(verified: false).where('expires_at > ?', Time.current) }

  def expired?
    Time.current > expires_at
  end

  def self.generate_code
    SecureRandom.random_number(900000) + 100000 # 6 digit code
  end

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end

