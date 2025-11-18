module Api
  module V1
    class ReportsController < ApplicationController
      # GET /api/v1/reports
      def index
        # Get reports for all courses of current user
        course_ids = current_user.courses.pluck(:id)
        reports = Report.where(course_id: course_ids).recent
        
        render json: reports.map { |report|
          {
            id: report.id,
            course_id: report.course_id,
            title: report.title,
            content: report.content,
            report_type: report.report_type,
            created_at: report.created_at,
            updated_at: report.updated_at
          }
        }, status: :ok
      end

      # GET /api/v1/reports/:id
      def show
        course_ids = current_user.courses.pluck(:id)
        report = Report.where(course_id: course_ids).find_by(id: params[:id])
        
        unless report
          render json: { error: 'Report not found' }, status: :not_found
          return
        end

        render json: {
          id: report.id,
          course_id: report.course_id,
          title: report.title,
          content: report.content,
          report_type: report.report_type,
          created_at: report.created_at,
          updated_at: report.updated_at
        }, status: :ok
      end

      # POST /api/v1/reports
      def create
        # Verify that the course belongs to current user
        course = current_user.courses.find_by(id: report_params[:course_id])
        
        unless course
          render json: { error: 'Course not found or access denied' }, status: :not_found
          return
        end

        report = course.reports.build(report_params.except(:course_id))
        
        if report.save
          render json: {
            message: 'Report created successfully',
            report: {
              id: report.id,
              course_id: report.course_id,
              title: report.title,
              content: report.content,
              report_type: report.report_type,
              created_at: report.created_at
            }
          }, status: :created
        else
          render json: { errors: report.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/reports/:id
      def update
        course_ids = current_user.courses.pluck(:id)
        report = Report.where(course_id: course_ids).find_by(id: params[:id])
        
        unless report
          render json: { error: 'Report not found' }, status: :not_found
          return
        end

        if report.update(report_params.except(:course_id))
          render json: {
            message: 'Report updated successfully',
            report: {
              id: report.id,
              course_id: report.course_id,
              title: report.title,
              content: report.content,
              report_type: report.report_type,
              updated_at: report.updated_at
            }
          }, status: :ok
        else
          render json: { errors: report.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/reports/:id
      def destroy
        course_ids = current_user.courses.pluck(:id)
        report = Report.where(course_id: course_ids).find_by(id: params[:id])
        
        unless report
          render json: { error: 'Report not found' }, status: :not_found
          return
        end

        if report.destroy
          render json: { message: 'Report deleted successfully' }, status: :ok
        else
          render json: { errors: report.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def report_params
        params.require(:report).permit(:course_id, :title, :content, :report_type)
      end
    end
  end
end
