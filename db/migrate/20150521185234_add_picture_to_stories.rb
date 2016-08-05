class AddPictureToStories < ActiveRecord::Migration
  def change
    add_column :stories, :picture, :string
  end
end
