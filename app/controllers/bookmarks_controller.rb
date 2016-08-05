class BookmarksController < ApplicationController
  before_action :must_login, only: [:create, :destroy, :show]

  # Return json index of user bookmarked story ids
  def index
    if logged_in?
      @bookmarks = @current_user.bookmarks.pluck(:story_id)
      respond_to do |format|
        format.json { render json: {ids: @bookmarks} }
        format.html { redirect_to bookmarks_url }
      end
    else
      redirect_to bookmarks_url
    end
  end

  def show
    # if logged_in?
    bookmark_ids = current_user.bookmarks.pluck(:story_id)
    @bookmarks = Story.find(bookmark_ids).index_by(&:id).slice(*bookmark_ids).values
    if logged_in? && current_user == @user
      @own_page = true
    else
      @own_page = false
    end
    # end
    respond_to do |format|
      format.js { render 'bookmarks.js' }
      format.html
    end
  end

  def create
    @bookmark = current_user.bookmarks.build(story_id: params[:story_id])
    @bookmark.save
    @bookmarked_story_ids = current_user.bookmarks.pluck(:story_id)
    render json: {ids: @bookmarked_story_ids}
  end

  def destroy
    @bookmark = current_user.bookmarks.find_by(story_id: params[:story_id])
    @bookmark.delete
    # different actions for user page or story page
    if request.env['HTTP_REFERER'].include? 'users'
      respond_to do |format|
        format.js { render 'deleteBookmark.js' }
        format.html { redirect_to users_url }
      end
    else
      @bookmarked_story_ids = current_user.bookmarks.pluck(:story_id)
      render json: {ids: @bookmarked_story_ids}
    end
  end

  private

  #   def bookmark_params
  #     params.require(:bookmark).permit(:story_id)
  #   end

  def must_login
    unless logged_in?
      respond_to do |format|
        format.js   { render 'shared/must_login.js'}
        format.html { redirect_to signup_url }
      end
    end
  end

end