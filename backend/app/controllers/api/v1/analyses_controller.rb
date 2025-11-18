module Api
  module V1
    class AnalysesController < ApplicationController
      # GET /api/v1/analyses
      def index
        # Get analyses for all courses of current user
        course_ids = current_user.courses.pluck(:id)
        analyses = Analysis.where(course_id: course_ids).recent
        
        render json: analyses.map { |analysis|
          {
            id: analysis.id,
            course_id: analysis.course_id,
            analysis_type: analysis.analysis_type,
            data: analysis.data,
            summary: analysis.summary,
            created_at: analysis.created_at,
            updated_at: analysis.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/analyses/:id
      def show
        course_ids = current_user.courses.pluck(:id)
        analysis = Analysis.where(course_id: course_ids).find_by(id: params[:id])
        
        unless analysis
          render json: { error: 'Analysis not found' }, status: :not_found
          return
        end

        render json: {
          id: analysis.id,
          course_id: analysis.course_id,
          analysis_type: analysis.analysis_type,
          data: analysis.data,
          summary: analysis.summary,
          created_at: analysis.created_at,
          updated_at: analysis.updated_at
        }, status: :ok
      end

      # POST /api/v1/analyses
      def create
        # Verify that the course belongs to current user
        course = current_user.courses.find_by(id: analysis_params[:course_id])
        
        unless course
          render json: { error: 'Course not found or access denied' }, status: :not_found
          return
        end

        analysis = course.analyses.build(analysis_params.except(:course_id))
        
        if analysis.save
          render json: {
            message: 'Analysis created successfully',
            analysis: {
              id: analysis.id,
              course_id: analysis.course_id,
              analysis_type: analysis.analysis_type,
              data: analysis.data,
              summary: analysis.summary,
              created_at: analysis.created_at
            }
          }, status: :created
        else
          render json: { errors: analysis.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/analyses/:id
      def update
        course_ids = current_user.courses.pluck(:id)
        analysis = Analysis.where(course_id: course_ids).find_by(id: params[:id])
        
        unless analysis
          render json: { error: 'Analysis not found' }, status: :not_found
          return
        end

        if analysis.update(analysis_params.except(:course_id))
          render json: {
            message: 'Analysis updated successfully',
            analysis: {
              id: analysis.id,
              course_id: analysis.course_id,
              analysis_type: analysis.analysis_type,
              data: analysis.data,
              summary: analysis.summary,
              updated_at: analysis.updated_at
            }
          }, status: :ok
        else
          render json: { errors: analysis.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/analyses/:id
      def destroy
        course_ids = current_user.courses.pluck(:id)
        analysis = Analysis.where(course_id: course_ids).find_by(id: params[:id])
        
        unless analysis
          render json: { error: 'Analysis not found' }, status: :not_found
          return
        end

        if analysis.destroy
          render json: { message: 'Analysis deleted successfully' }, status: :ok
        else
          render json: { errors: analysis.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def analysis_params
        params.require(:analysis).permit(:course_id, :analysis_type, :data, :summary)
      end
    end
  end
end
