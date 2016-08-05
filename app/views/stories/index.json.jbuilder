json.array!(@stories) do |story|
  json.extract! story, :id, :coords, :icon, :title, :author, :content
  json.url story_path(story, format: :json)
end
