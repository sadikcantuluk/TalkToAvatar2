module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      @decoded = JwtHelper.decode(header)
      @current_user = User.find(@decoded[:user_id]) if @decoded
    rescue ActiveRecord::RecordNotFound
      @current_user = nil
    end

    unless @current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end

