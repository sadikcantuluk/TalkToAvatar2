class User < ApplicationRecord
  has_secure_password
  
  # Validations
  validates :username, presence: true, uniqueness: true, length: { minimum: 3 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, if: :password_digest_changed?
  validate :password_complexity, if: :password_digest_changed?

  # Associations
  has_many :recordings, dependent: :destroy
  has_many :email_verifications, dependent: :destroy
  has_many :password_resets, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :custom_avatars, dependent: :destroy
  has_many :videos, dependent: :destroy
  has_many :conversations, dependent: :destroy
  has_many :audios, dependent: :destroy

  # Callbacks
  before_create :set_uuid

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end

  def password_complexity
    return if password.blank?
    
    errors.add(:password, "must include at least one uppercase letter") unless password.match(/[A-Z]/)
    errors.add(:password, "must include at least one lowercase letter") unless password.match(/[a-z]/)
    errors.add(:password, "must include at least one digit") unless password.match(/\d/)
  end
end

