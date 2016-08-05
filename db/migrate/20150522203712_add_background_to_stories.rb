class AddBackgroundToStories < ActiveRecord::Migration
  def change
    add_column :stories, :background, :string
  end
end
