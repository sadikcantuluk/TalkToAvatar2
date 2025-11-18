class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :description
      t.string :language_code, limit: 5
      t.string :level, limit: 2
      t.string :status, limit: 20, default: 'active'

      t.timestamps
    end
    
    add_index :courses, :user_id, name: 'idx_courses_user_id'
    add_index :courses, :level, name: 'idx_courses_level'
    add_index :courses, :language_code, name: 'idx_courses_language_code'
    add_index :courses, :status, name: 'idx_courses_status'
    
    add_check_constraint :courses, "level IS NULL OR level::text = ANY (ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying]::text[])", name: 'courses_level_check'
    add_check_constraint :courses, "status::text = ANY (ARRAY['active'::character varying, 'completed'::character varying, 'archived'::character varying]::text[])", name: 'courses_status_check'
  end
end
