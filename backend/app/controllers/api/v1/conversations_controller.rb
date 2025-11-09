module Api
  module V1
    class ConversationsController < ApplicationController
      # GET /api/v1/conversations
      def index
        conversations = current_user.conversations.order(created_at: :desc)
        
        render json: conversations.map { |conv| 
          {
            id: conv.id,
            user_text: conv.user_text,
            translated_text: conv.translated_text,
            user_language: conv.user_language,
            target_language: conv.target_language,
            created_at: conv.created_at
          }
        }, status: :ok
      end

      # POST /api/v1/conversations
      def create
        conversation = current_user.conversations.build(conversation_params)
        
        if conversation.save
          render json: {
            message: 'Conversation saved successfully',
            conversation: {
              id: conversation.id,
              user_text: conversation.user_text,
              translated_text: conversation.translated_text,
              user_language: conversation.user_language,
              target_language: conversation.target_language,
              created_at: conversation.created_at
            }
          }, status: :created
        else
          render json: { errors: conversation.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/conversations/:id
      def show
        conversation = current_user.conversations.find_by(id: params[:id])
        
        unless conversation
          render json: { error: 'Conversation not found' }, status: :not_found
          return
        end

        render json: {
          id: conversation.id,
          user_text: conversation.user_text,
          translated_text: conversation.translated_text,
          user_language: conversation.user_language,
          target_language: conversation.target_language,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at
        }, status: :ok
      end

      # DELETE /api/v1/conversations/:id
      def destroy
        conversation = current_user.conversations.find_by(id: params[:id])
        
        unless conversation
          render json: { error: 'Conversation not found' }, status: :not_found
          return
        end

        if conversation.destroy
          render json: { message: 'Conversation deleted successfully' }, status: :ok
        else
          render json: { errors: conversation.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def conversation_params
        params.require(:conversation).permit(
          :user_text, 
          :translated_text, 
          :user_language, 
          :target_language
        )
      end
    end
  end
end

