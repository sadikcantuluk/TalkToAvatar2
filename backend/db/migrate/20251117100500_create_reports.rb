class CreateReports < ActiveRecord::Migration[7.1]
  def change
    create_table :reports, id: :uuid do |t|
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :content, null: false
      t.string :report_type, null: false, limit: 50

      t.timestamps
    end
    
    add_index :reports, :course_id, name: 'idx_reports_course_id'
    add_index :reports, :report_type, name: 'idx_reports_type'
  end
end
