class Story < ActiveRecord::Base
  belongs_to :user
  before_create :create_munged_title
  before_save :sanitize_content

  mount_uploader :picture,    PictureUploader
  mount_uploader :background, BackgroundUploader

  validates :title,      presence: true, length: { maximum: 100 }
  validates :author,     presence: true, length: { maximum: 100 }
  validates :content,    presence: true, length: { maximum: 50000 }
  validates :coords,     presence: true
  validates :picture,    presence: true
  validates :background, presence: true
  validates :user_id,    presence: true
  validate  :image_size

  def to_param
    munged_title
  end

  private

    # converts title to url-friendly string - 'This Title' -> 'this-title-7wH' 
    def create_munged_title
      self.munged_title = "#{title.parameterize}-#{rand(36**3).to_s(36)}"
    end

    def sanitize_content
      self.content = ActionController::Base.helpers.sanitize content,
                       tags: %w(p i u strong b br img blockquote),
                       attributes: %w(class file src)
    end

    # Validates the size of an uploaded image
    def image_size
      if picture.size > 1.megabytes
        errors.add(:picture, "should be less than 1MB")
      end
      if background.size > 2.megabytes
        errors.add(:background, "should be less than 2MB")
      end
    end

end
