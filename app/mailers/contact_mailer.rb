class ContactMailer < ApplicationMailer

    def contact_form(params)
        @name = params[:name]
        @message = params[:message]
        mail(to: 'hank@henrygd.me',
             from: "\"#{@name}\"<emailrelay@mailer.henrygd.me>",
             reply_to: "\"#{@name}\"<#{params[:email]}>",
             subject: 'New message on Stories on a Map')
    end
    
end
