class AddPracticeSentenceDetailsToRecordings < ActiveRecord::Migration[7.1]
  def change
    # Check if columns already exist (for Supabase compatibility)
    unless column_exists?(:recordings, :practice_sentence_id)
      add_column :recordings, :practice_sentence_id, :uuid
    end
    
    unless column_exists?(:recordings, :topic)
      add_column :recordings, :topic, :string
    end

    # Add indexes for performance
    unless index_exists?(:recordings, :practice_sentence_id)
      add_index :recordings, :practice_sentence_id
    end
    
    unless index_exists?(:recordings, [:course_id, :topic])
      add_index :recordings, [:course_id, :topic]
    end
    
    unless index_exists?(:recordings, [:practice_sentence_id, :created_at])
      add_index :recordings, [:practice_sentence_id, :created_at]
    end
  end
end
