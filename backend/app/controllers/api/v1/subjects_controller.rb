module Api
  module V1
    class SubjectsController < ApplicationController
      # GET /api/v1/subjects
      def index
        # Get subjects for all courses of current user
        course_ids = current_user.courses.pluck(:id)
        subjects = Subject.where(course_id: course_ids).ordered
        
        render json: subjects.map { |subject|
          {
            id: subject.id,
            course_id: subject.course_id,
            title: subject.title,
            description: subject.description,
            order: subject.order,
            created_at: subject.created_at,
            updated_at: subject.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/subjects/:id
      def show
        course_ids = current_user.courses.pluck(:id)
        subject = Subject.where(course_id: course_ids).find_by(id: params[:id])
        
        unless subject
          render json: { error: 'Subject not found' }, status: :not_found
          return
        end

        render json: {
          id: subject.id,
          course_id: subject.course_id,
          title: subject.title,
          description: subject.description,
          order: subject.order,
          created_at: subject.created_at,
          updated_at: subject.updated_at
        }, status: :ok
      end

      # POST /api/v1/subjects
      def create
        # Verify that the course belongs to current user
        course = current_user.courses.find_by(id: subject_params[:course_id])
        
        unless course
          render json: { error: 'Course not found or access denied' }, status: :not_found
          return
        end

        subject = course.subjects.build(subject_params.except(:course_id))
        
        if subject.save
          render json: {
            message: 'Subject created successfully',
            subject: {
              id: subject.id,
              course_id: subject.course_id,
              title: subject.title,
              description: subject.description,
              order: subject.order,
              created_at: subject.created_at
            }
          }, status: :created
        else
          render json: { errors: subject.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/subjects/:id
      def update
        course_ids = current_user.courses.pluck(:id)
        subject = Subject.where(course_id: course_ids).find_by(id: params[:id])
        
        unless subject
          render json: { error: 'Subject not found' }, status: :not_found
          return
        end

        if subject.update(subject_params.except(:course_id))
          render json: {
            message: 'Subject updated successfully',
            subject: {
              id: subject.id,
              course_id: subject.course_id,
              title: subject.title,
              description: subject.description,
              order: subject.order,
              updated_at: subject.updated_at
            }
          }, status: :ok
        else
          render json: { errors: subject.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/subjects/:id
      def destroy
        course_ids = current_user.courses.pluck(:id)
        subject = Subject.where(course_id: course_ids).find_by(id: params[:id])
        
        unless subject
          render json: { error: 'Subject not found' }, status: :not_found
          return
        end

        if subject.destroy
          render json: { message: 'Subject deleted successfully' }, status: :ok
        else
          render json: { errors: subject.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def subject_params
        params.require(:subject).permit(:course_id, :title, :description, :order)
      end
    end
  end
end
