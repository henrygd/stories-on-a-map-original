class StoriesController < ApplicationController
  before_action :set_story, only: [:show, :edit, :update, :destroy]
  before_action :must_login, only: [:create, :destroy]

  # GET /stories
  # GET /stories.json
  def index
    unless logged_in? && current_user.admin?
      redirect_to root_url
    end
    @stories = Story.all
  end

  # GET /stories/1
  def show
  end

  # GET /stories/new
  def new
    @story = Story.new
  end

  # POST /stories
  def create
    @story = current_user.stories.build(story_params)
    respond_to do |format|
      if @story.save
        flash[:notice] = 'story created'
        format.html { redirect_to @story }
        format.js   { render 'stories/js/created.js' }
      else
        format.html { render :new }
        format.js   { render 'stories/js/form_errors' }
      end
    end
  end

  # DELETE /stories/1
  def destroy
    if logged_in? && current_user.id == @story.user_id
      # destroy story
      @story.destroy
      # destroy user bookmarks of story
      Bookmark.delete_all("story_id = #{@story.id}")
      respond_to do |format|
        format.js { render 'stories/js/destroyed.js' }
        format.html { redirect_to current_user }
      end
    else
      respond_to do |format|
        format.js { render 'shared/must_login.js' }
        format.html { redirect_to current_user }
      end
    end
  end

  def random
    @story = Story.select("munged_title, coords").sample
    respond_to do |format|
      format.js { render 'stories/js/random.js' }
      format.html { redirect_to action: "show", id: @story_title }
    end
  end

  private
    def set_story
      @story = Story.find_by(munged_title: params[:id])
    end

    def story_params
      params.require(:story).permit(:coords, :icon, :title, :author, :content, :picture, :background)
    end

    def must_login
      unless logged_in?
        respond_to do |format|
          format.js   { render 'shared/must_login.js'}
          format.html { redirect_to signup_url }
        end
      end
    end
end
