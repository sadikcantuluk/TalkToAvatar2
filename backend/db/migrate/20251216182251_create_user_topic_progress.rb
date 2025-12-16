class CreateUserTopicProgress < ActiveRecord::Migration[7.1]
  def change
    # Table already exists in Supabase, skip migration
    unless table_exists?(:user_topic_progress)
      create_table :user_topic_progress, id: :uuid do |t|
        t.references :user, null: false, foreign_key: true, type: :uuid
        t.references :course, null: false, foreign_key: true, type: :uuid
        t.string :topic, null: false, limit: 50
        t.integer :progress_percentage, null: false, default: 0
        t.integer :completed_sentences, null: false, default: 0
        t.integer :total_sentences, null: false, default: 0
        t.timestamp :last_updated_at, default: -> { 'CURRENT_TIMESTAMP' }

        t.timestamps
      end

      # Add indexes
      add_index :user_topic_progress, :user_id, name: 'idx_user_topic_progress_user'
      add_index :user_topic_progress, :course_id, name: 'idx_user_topic_progress_course'
      add_index :user_topic_progress, :topic, name: 'idx_user_topic_progress_topic'
      add_index :user_topic_progress, [:user_id, :course_id], name: 'idx_user_topic_progress_composite'
      add_index :user_topic_progress, [:user_id, :course_id, :topic], unique: true, name: 'idx_user_topic_progress_unique'
      add_index :user_topic_progress, :last_updated_at, name: 'idx_user_topic_progress_updated'
    end
  end
end

