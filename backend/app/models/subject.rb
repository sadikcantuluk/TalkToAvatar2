class Subject < ApplicationRecord
  belongs_to :course
  
  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :order, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Callbacks
  before_create :set_uuid
  before_validation :set_default_order, on: :create
  
  # Scopes
  scope :ordered, -> { order(:order, :created_at) }
  scope :recent, -> { order(created_at: :desc) }
  
  private
  
  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
  
  def set_default_order
    if order.nil?
      max_order = course.subjects.maximum(:order) || -1
      self.order = max_order + 1
    end
  end
end
