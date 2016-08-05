class PasswordResetsController < ApplicationController
  before_action :get_user,   only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  def index
    redirect_to new_password_reset_url
  end

  def new
    respond_to do |format|
      format.html { render :new }
      format.js   { render :reset_form }
    end
  end

  def create
    @user = User.find_by(email: params[:password_reset][:email].downcase)
    respond_to do |format|
      if @user
        @user.create_reset_digest
        @user.send_password_reset_email
        @emailsent = true
        flash.now[:success] = "Email sent with password reset instructions"
        format.html { render :new }
        format.js   { render :reset_form }
      else
        flash.now[:danger] = "Email address not found"
        format.html { render :new }
        format.js   { render :reset_form, status: :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if params[:user][:password].empty?
      @user.errors.add(:password, "can't be empty")
      render 'edit'
    elsif @user.update_attributes(user_params)
      log_in @user
      flash[:notice] = "Password has been reset"
      redirect_to @user
    else
      render 'edit'
    end
  end

  private

    def user_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    # Before filters
    
    def get_user
      @user = User.find_by(email: params[:email])
    end

    # Confirms a valid user.
    def valid_user
      unless (@user && @user.activated? &&
              @user.authenticated?(:reset, params[:id]))
        flash[:notice] = "Link is not valid. Request new link below."
        redirect_to new_password_reset_url
      end
    end

    # Checks expiration of reset token.
    def check_expiration
      if @user.password_reset_expired?
        flash[:notice] = "Link expired. Request new link below."
        redirect_to new_password_reset_url
      end
    end
end