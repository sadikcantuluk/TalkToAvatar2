class CreateRecordings < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:recordings)
      create_table :recordings, id: :uuid do |t|
      t.uuid :user_id, null: false
      t.string :audio_url, null: false
      t.text :transcript, null: false
      t.text :reference_text, null: false
      t.integer :score, null: false
      t.string :level, null: false
      
      t.timestamps
      end

      add_foreign_key :recordings, :users, on_delete: :cascade unless foreign_key_exists?(:recordings, :users)
      add_index :recordings, :user_id unless index_exists?(:recordings, :user_id)
      add_index :recordings, :level unless index_exists?(:recordings, :level)
      add_index :recordings, :created_at unless index_exists?(:recordings, :created_at)
    end
  end
end

