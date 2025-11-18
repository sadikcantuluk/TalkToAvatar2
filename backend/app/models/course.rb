class Course < ApplicationRecord
  belongs_to :user
  
  # Associations
  has_many :subjects, dependent: :destroy
  has_many :videos, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :analyses, dependent: :destroy
  has_many :recordings, dependent: :destroy
  has_many :user_course_progresses, dependent: :destroy
  
  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :level, inclusion: { in: %w[A1 A2 B1 B2 C1 C2] }, allow_nil: true
  validates :status, inclusion: { in: %w[active completed archived] }, allow_nil: true
  validates :language_code, length: { maximum: 5 }, allow_nil: true
  
  # Callbacks
  before_create :set_uuid
  before_validation :set_default_status, on: :create
  
  # Scopes
  scope :active, -> { where(status: 'active') }
  scope :completed, -> { where(status: 'completed') }
  scope :archived, -> { where(status: 'archived') }
  scope :by_level, ->(level) { where(level: level) }
  scope :by_language, ->(lang) { where(language_code: lang) }
  scope :recent, -> { order(created_at: :desc) }
  
  private
  
  def set_uuid
    self.id = SecureRandom.uuid if id.nil?
  end
  
  def set_default_status
    self.status ||= 'active'
  end
end
