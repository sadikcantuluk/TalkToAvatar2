module Api
  module V1
    class NotificationsController < ApplicationController
      # GET /api/v1/notifications
      def index
        unless current_user
          render json: { error: 'Unauthorized' }, status: :unauthorized
          return
        end

        notifications = current_user.notifications.recent
        
        render json: notifications.map { |n| 
          {
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            read: n.read,
            created_at: n.created_at
          }
        }, status: :ok
      end

      # POST /api/v1/notifications
      def create
        notification = current_user.notifications.build(notification_params)
        
        if notification.save
          render json: {
            message: 'Notification created successfully',
            notification: {
              id: notification.id,
              title: notification.title,
              message: notification.message,
              type: notification.type,
              read: notification.read,
              created_at: notification.created_at
            }
          }, status: :created
        else
          render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/notifications/:id/mark_read
      def mark_read
        notification = current_user.notifications.find_by(id: params[:id])
        
        unless notification
          render json: { error: 'Notification not found' }, status: :not_found
          return
        end

        if notification.update(read: true)
          render json: { message: 'Notification marked as read' }, status: :ok
        else
          render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/notifications/mark_all_read
      def mark_all_read
        current_user.notifications.unread.update_all(read: true)
        
        render json: { message: 'All notifications marked as read' }, status: :ok
      end

      # DELETE /api/v1/notifications/:id
      def destroy
        notification = current_user.notifications.find_by(id: params[:id])
        
        unless notification
          render json: { error: 'Notification not found' }, status: :not_found
          return
        end

        notification.destroy
        render json: { message: 'Notification deleted successfully' }, status: :ok
      end

      # DELETE /api/v1/notifications
      def destroy_all
        current_user.notifications.destroy_all
        
        render json: { message: 'All notifications deleted successfully' }, status: :ok
      end

      private

      def notification_params
        params.require(:notification).permit(:title, :message, :type)
      end
    end
  end
end

