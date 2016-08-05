class ContactFormController < ApplicationController

  def show
    respond_to do |format|
      format.html { render :show }
      format.js   { render :contact_form }
    end
  end

  def send_mail
    @args = contact_params
    @errors = []
    max_length = {
      :name      => 255,
      :email     => 255,
      :message   => 8000,
    }
    # check if needed params exist, return error if missing
    [:name, :email, :message].each do |k|
      if !@args[k] || @args[k] == ""
        @errors.push "Missing #{k} parameter"
      end
      if @args[k].length > max_length[k]
        @errors.push "#{k.capitalize} is too long (max #{max_length[k]} characters)"
      end
    end
    if !@errors.empty?
      respond_to do |format|
        format.js {
          return render :contact_errors, status: :unprocessable_entity
        }
        format.html {
          return render :show
        }
      end
    end
    # send email
    ContactMailer.contact_form(@args).deliver_now
    @mail_sent = true
    flash.now[:success] = 'Message sent. Thank you!'
    respond_to do |format|
      format.js { render :contact_form }
      format.html { render :show }
    end
  end

end

private

  # def contact_params_remote
  #   params.permit(:name, :email, :message)
  # end

  def contact_params
    params.require(:contact_form).permit(:name, :email, :message)
  end