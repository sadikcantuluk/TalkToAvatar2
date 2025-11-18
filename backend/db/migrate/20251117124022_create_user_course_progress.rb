class CreateUserCourseProgress < ActiveRecord::Migration[7.1]
  def change
    # Table already exists in Supabase, skip migration
    return if table_exists?(:user_course_progresses)
    
    create_table :user_course_progresses, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :course, null: false, foreign_key: true, type: :uuid
      t.references :practice_sentence, null: false, foreign_key: { to_table: :practice_sentences }, type: :uuid
      t.boolean :completed, default: false
      t.float :score
      t.integer :attempts, default: 0
      t.float :best_score
      t.timestamp :last_practiced_at

      t.timestamps
    end

    # Indexes already exist in Supabase, skip if table exists
    unless table_exists?(:user_course_progresses)
      add_index :user_course_progresses, :user_id, name: 'idx_user_course_progress_user'
      add_index :user_course_progresses, :course_id, name: 'idx_user_course_progress_course'
      add_index :user_course_progresses, :practice_sentence_id, name: 'idx_user_course_progress_sentence'
      add_index :user_course_progresses, [:user_id, :course_id], name: 'idx_user_course_progress_composite'
      add_index :user_course_progresses, [:user_id, :course_id, :practice_sentence_id], unique: true, name: 'idx_user_course_progress_unique'
    end
  end
end
