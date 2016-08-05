class SessionsController < ApplicationController

  def new
    respond_to do |format|
      format.html { render :new }
      format.js   { render :login_form }
    end
  end

  def create
    @user = User.find_by(username: params[:session][:username])
    respond_to do |format|
      if @user && @user.authenticate(params[:session][:password])
        if @user.activated?
          log_in @user
          params[:session][:remember_me] == '1' ? remember(@user) : forget(@user)
          format.html { 
            flash[:notice] = 'Logged in'
            redirect_to @user
          }
          format.js { render :login}
        else
          message  = "Account not activated. "
          message += "Check your email for the activation link."
          flash.now[:danger] = message
          format.html { render :new }
          format.js   { render :login_form, status: :unprocessable_entity }
        end
      else
        flash.now[:danger] = 'Invalid username/password combination'
        format.html { render :new }
        format.js   { render :login_form, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    log_out if logged_in?
    respond_to do |format|
      format.html { redirect_to root_url }
      format.js   { render :logout }
    end
  end

end
