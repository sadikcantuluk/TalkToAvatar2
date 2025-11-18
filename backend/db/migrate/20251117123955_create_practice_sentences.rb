class CreatePracticeSentences < ActiveRecord::Migration[7.1]
  def change
    return if table_exists?(:practice_sentences)
    
    create_table :practice_sentences, id: :uuid do |t|
      t.string :language_code, limit: 2, null: false
      t.string :level, limit: 2, null: false
      t.string :topic, limit: 50, null: false
      t.text :sentence, null: false
      t.integer :order, null: false

      t.timestamps
    end

    # Indexes already exist in Supabase, skip if table exists
    unless table_exists?(:practice_sentences)
      add_index :practice_sentences, :language_code, name: 'idx_practice_sentences_language'
      add_index :practice_sentences, :level, name: 'idx_practice_sentences_level'
      add_index :practice_sentences, :topic, name: 'idx_practice_sentences_topic'
      add_index :practice_sentences, [:language_code, :level, :topic], name: 'idx_practice_sentences_composite'
      add_check_constraint :practice_sentences, "level::text = ANY (ARRAY['A1'::character varying, 'A2'::character varying, 'B1'::character varying, 'B2'::character varying, 'C1'::character varying, 'C2'::character varying]::text[])", name: 'practice_sentences_level_check'
    end
  end
end
