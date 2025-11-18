class AddCourseIdToVideos < ActiveRecord::Migration[7.1]
  def change
    add_reference :videos, :course, null: true, foreign_key: true, type: :uuid
    add_index :videos, :course_id, name: 'idx_videos_course_id'
  end
end
