class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :destroy]

  def show
    bookmark_ids = @user.bookmarks.pluck(:story_id)
    @bookmarks = Story.find(bookmark_ids).index_by(&:id).slice(*bookmark_ids).values
    @user_stories = @user.stories.select(:id, :title, :author, :munged_title, :picture)
    if logged_in? && current_user == @user
      @own_page = true
    else
      @own_page = false
    end
  end

  def new
    @user = User.new
    respond_to do |format|
      format.html { render :new }
      format.js   { render :form_sign_up }
    end
  end

  def create
    @user = User.new(user_params)
     respond_to do |format|
       if @user.save
         @user.send_activation_email
         format.html { 
           @account_created = true
           flash.now[:success] = "Account created. Please check email to confirm."
           render :new
         }
         format.js   { render 'sessions/userCreated', status: :created }
       else
         format.html { render :new }
         format.js   { render :form_sign_up, status: :unprocessable_entity }
       end
     end
  end

  def index
    unless logged_in? && current_user.admin?
      redirect_to root_url
    end
    @users = User.all
  end

  def destroy
    if logged_in? 
      if current_user == @user || current_user.admin?
        @user.destroy
        return redirect_to signup_url
      end
    end
    redirect_to root_url
  end

end

private

  def set_user
    @user = User.find_by(username: params[:id])
    if !@user.activated?
      flash[:notice] = 'This user is not yet activated. Check your email.'
      redirect_to login_url and return
    end
  end
  
  def user_params
    params.require(:user).permit(:username, :email, :password,
                                 :password_confirmation)
  end