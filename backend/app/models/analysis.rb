class Analysis < ApplicationRecord
  belongs_to :course
  
  # Validations
  validates :analysis_type, presence: true, length: { maximum: 50 }
  validates :data, presence: true
  
  # Callbacks
  before_create :set_uuid
  
  # Scopes
  scope :by_type, ->(type) { where(analysis_type: type) }
  scope :recent, -> { order(created_at: :desc) }
  
  private
  
  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
end
