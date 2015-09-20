class UsersController < ApplicationController
  respond_to :json
  def update
    user_params = params.require(:user).permit(:email, :name)
    @user = User.where(facebook_id: params[:id]).first_or_initialize
    @user.update_attributes(user_params)
    respond_with @user
  end
end
