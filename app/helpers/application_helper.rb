module ApplicationHelper

  def full_title(title)
    base_title = "Stories on a Map"
    return base_title if title.empty?
    "#{title} | #{base_title}"
  end

end
