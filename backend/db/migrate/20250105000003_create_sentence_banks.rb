class CreateSentenceBanks < ActiveRecord::Migration[7.1]
  def change
    unless table_exists?(:sentence_banks)
      create_table :sentence_banks, id: :uuid do |t|
        t.string :level, null: false
        t.string :language, null: false
        t.text :text, null: false
        
        t.timestamps
      end

      add_index :sentence_banks, [:level, :language] unless index_exists?(:sentence_banks, [:level, :language])
    end
  end
end

