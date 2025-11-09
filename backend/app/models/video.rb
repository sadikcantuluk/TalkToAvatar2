class Video < ApplicationRecord
  belongs_to :user

  # Validations
  validates :text, presence: true
  validates :status, presence: true, 
            inclusion: { in: %w[processing completed failed] }

  # Callbacks
  before_create :set_uuid
  before_validation :set_default_status, on: :create

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :completed, -> { where(status: 'completed') }
  scope :processing, -> { where(status: 'processing') }
  scope :failed, -> { where(status: 'failed') }

  private

  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end

  def set_default_status
    self.status ||= 'processing'
  end
end

