class NavbarController < ApplicationController

  def new
    respond_to do |format|
      format.js { render 'shared/navbar.js' }
    end
  end

end