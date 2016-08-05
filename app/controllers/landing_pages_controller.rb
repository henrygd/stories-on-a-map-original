class LandingPagesController < ApplicationController

  def home
  end

  def storylist
    @stories = Story.all.pluck('coords', 'author', 'title', 'munged_title')
    return render json: @stories
  end
  
end