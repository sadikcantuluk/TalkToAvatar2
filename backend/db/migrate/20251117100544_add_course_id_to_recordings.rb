class AddCourseIdToRecordings < ActiveRecord::Migration[7.1]
  def change
    add_reference :recordings, :course, null: true, foreign_key: true, type: :uuid
    add_index :recordings, :course_id, name: 'idx_recordings_course_id'
  end
end
