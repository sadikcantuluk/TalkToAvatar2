class Report < ApplicationRecord
  belongs_to :course
  
  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :report_type, presence: true, length: { maximum: 50 }
  validates :content, presence: true
  
  # Callbacks
  before_create :set_uuid
  
  # Scopes
  scope :by_type, ->(type) { where(report_type: type) }
  scope :recent, -> { order(created_at: :desc) }
  
  private
  
  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end
